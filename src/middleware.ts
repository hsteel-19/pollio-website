import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run middleware on:
     * - Protected routes that need auth (/app/*)
     * - Auth pages to redirect logged-in users (/login, /signup)
     * Exclude /auth/callback - it handles cookies itself
     */
    '/app/:path*',
    '/login',
    '/signup',
  ],
}
