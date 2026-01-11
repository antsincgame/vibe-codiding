import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /student-auth
Disallow: /student-dashboard
Disallow: /reset-password
Disallow: /forgot-password
Disallow: /verify-email
Disallow: /auth/callback

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Yandex
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

Host: https://vibecoding.by
Sitemap: https://vibecoding.by/sitemap.xml
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
});
