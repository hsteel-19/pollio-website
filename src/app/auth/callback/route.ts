import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  // Use origin from request, or fallback to production URL
  const baseUrl = origin || 'https://pollio.se'

  if (error) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=No+code`)
  }

  // Create response that we'll add cookies to
  const redirectUrl = `${baseUrl}${next}`
  let response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Exchange error:', exchangeError.message)
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  return response
}
