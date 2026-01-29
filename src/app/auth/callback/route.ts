import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/app'

  if (error) {
    return NextResponse.redirect(`https://pollio.se/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`https://pollio.se/login?error=No+code`)
  }

  const cookieStore = await cookies()

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
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Exchange error:', exchangeError.message)
    return NextResponse.redirect(`https://pollio.se/login?error=${encodeURIComponent(exchangeError.message)}`)
  }

  // Redirect to the app - cookies should now be set
  return NextResponse.redirect(`https://pollio.se${next}`)
}
