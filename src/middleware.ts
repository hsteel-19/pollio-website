import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run middleware on protected routes that need auth
     * Exclude /auth/callback - it handles cookies itself
     */
    '/app/:path*',
  ],
}
