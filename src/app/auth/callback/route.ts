import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  const baseUrl = 'https://pollio.se'

  if (error) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=No+code`)
  }

  // Create the redirect response FIRST
  const redirectTo = new URL(next, baseUrl)
  const response = NextResponse.redirect(redirectTo)

  // Create Supabase client that sets cookies on the response
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

  // Exchange the code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  return response
}
