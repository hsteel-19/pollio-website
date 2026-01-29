import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pollio.se'

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`
    )
  }

  if (code) {
    // Create response first - we'll set cookies directly on it
    const redirectUrl = `${baseUrl}${next}`
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers.get('cookie')?.split('; ').map(cookie => {
              const [name, value] = cookie.split('=')
              return { name, value }
            }) || []
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set cookies on the response with Supabase's exact options
              response.cookies.set({
                name,
                value,
                ...options,
                // Ensure path is root so cookies work everywhere
                path: '/',
              })
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

  return NextResponse.redirect(`${baseUrl}/login?error=No+authentication+code+received`)
}
