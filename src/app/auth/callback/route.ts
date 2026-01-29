import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(`https://pollio.se/login?error=${encodeURIComponent(error_description || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`https://pollio.se/login?error=No+code`)
  }

  // Return an HTML page that handles the auth client-side
  // This ensures cookies are set properly in the browser context
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Signing in...</title>
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
      </head>
      <body>
        <p>Signing you in...</p>
        <script>
          (async function() {
            const supabase = window.supabase.createClient(
              '${process.env.NEXT_PUBLIC_SUPABASE_URL}',
              '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
            );

            // Exchange the code for a session
            const { data, error } = await supabase.auth.exchangeCodeForSession('${code}');

            if (error) {
              console.error('Auth error:', error);
              window.location.href = '/login?error=' + encodeURIComponent(error.message);
            } else {
              // Session is now stored in cookies by the client
              window.location.href = '/app';
            }
          })();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
