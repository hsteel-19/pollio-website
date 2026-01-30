import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // DEBUG: Log incoming cookies
  const allCookies = request.cookies.getAll()
  const authCookies = allCookies.filter(c => c.name.includes('auth-token'))
  console.log('=== MIDDLEWARE ===')
  console.log('Path:', request.nextUrl.pathname)
  console.log('Auth cookies found:', authCookies.length, authCookies.map(c => c.name))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - important for Server Components
  const { data: { user }, error } = await supabase.auth.getUser()
  console.log('getUser result - user:', user?.email, 'error:', error?.message)

  // Protected routes - redirect to login if not authenticated
  const isAppRoute = request.nextUrl.pathname.startsWith('/app')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/signup')

  if (isAppRoute && !user) {
    console.log('No user found, redirecting to /login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && user) {
    console.log('User found on auth page, redirecting to /app')
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
