import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  // DEBUG LOGGING - remove after fix confirmed
  console.log('=== AUTH CALLBACK HIT ===')
  console.log('Full URL:', request.url)
  console.log('Code exists:', !!code)
  console.log('Error:', error)
  console.log('Next:', next)

  // Use origin from request, or fallback to production URL
  const baseUrl = origin || 'https://pollio.se'

  if (error) {
    console.log('OAuth error, redirecting to login')
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    console.log('No code provided, redirecting to login')
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
          console.log('Setting cookies:', cookiesToSet.map(c => ({ name: c.name, options: c.options })))
          cookiesToSet.forEach(({ name, value, options }) => {
            // Force correct cookie options for whole site
            response.cookies.set(name, value, {
              ...options,
              path: '/',           // CRITICAL: ensure cookie is sent to all paths
              secure: true,        // Required for HTTPS
              sameSite: 'lax',     // Allow cookie on navigation
              httpOnly: true,      // Security best practice
            })
          })
        },
      },
    }
  )

  console.log('Calling exchangeCodeForSession...')
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Exchange error:', exchangeError.message)
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  console.log('Exchange successful, user:', data?.user?.email)
  console.log('Redirecting to:', `${baseUrl}${next}`)
  return response
}
