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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  // Handle error from OAuth provider
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  if (code) {
    const cookieStore = await cookies()

    // Track cookies that need to be set on the response
    const cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookies) {
            cookies.forEach((cookie) => {
              cookiesToSet.push(cookie)
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

    // Create redirect response and attach cookies
    const response = NextResponse.redirect(`${baseUrl}${next}`)

    // Set all cookies on the response
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options as Record<string, unknown>)
    })

    return response
  }

  // No code and no error - something unexpected
  return NextResponse.redirect(`${baseUrl}/login?error=No authentication code received`)
}
