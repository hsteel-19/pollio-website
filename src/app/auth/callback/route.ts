import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  // Use environment variable or fallback to request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pollio.se'

  // Handle error from OAuth provider
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  if (code) {
    const cookieStore = await cookies()

    // Create response first so we can set cookies on it
    const response = NextResponse.redirect(`${baseUrl}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set on both cookieStore and response
              try {
                cookieStore.set(name, value, options)
              } catch {
                // Ignore cookieStore errors
              }
              // Always set on response - this is the critical part
              response.cookies.set(name, value, {
                ...options,
                // Ensure cookies work in production
                secure: true,
                sameSite: 'lax',
              } as Record<string, unknown>)
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Exchange error:', exchangeError.message)
      return NextResponse.redirect(
        `${baseUrl}/login?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    return response
  }

  // No code and no error - something unexpected
  return NextResponse.redirect(`${baseUrl}/login?error=No+authentication+code+received`)
}
