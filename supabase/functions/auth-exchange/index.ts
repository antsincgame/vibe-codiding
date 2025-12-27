import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    const clientOrigin = url.searchParams.get('origin') || Deno.env.get('CLIENT_ORIGIN') || 'http://localhost:5173';

    console.log('Auth exchange called with code:', code ? 'present' : 'absent', 'origin:', clientOrigin);

    if (error) {
      const redirectUrl = `${clientOrigin}/auth/callback?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || '')}`;
      console.log('Redirecting with error:', redirectUrl);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders
        }
      });
    }

    if (!code) {
      const redirectUrl = `${clientOrigin}/auth/callback?error=no_code`;
      console.log('Redirecting - no code:', redirectUrl);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': redirectUrl,
          ...corsHeaders
        }
      });
    }

    // For PKCE flow, pass the code to the client
    // The client will exchange it using exchangeCodeForSession with the stored code_verifier
    const redirectUrl = `${clientOrigin}/auth/callback?code=${encodeURIComponent(code)}`;
    console.log('Redirecting with code to client for PKCE exchange:', redirectUrl);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': redirectUrl,
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Auth exchange error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});