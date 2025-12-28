import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "npm:emailjs@4.0.3";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { testEmail } = await req.json();
    
    if (!testEmail) {
      return new Response(
        JSON.stringify({ error: 'Test email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: settings } = await supabase
      .from('system_settings')
      .select('key, value')
      .in('key', [
        'smtp_host',
        'smtp_port',
        'smtp_user',
        'smtp_password',
        'smtp_from_email',
        'smtp_from_name',
        'smtp_secure'
      ]);

    if (!settings || settings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'SMTP settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const settingsMap: Record<string, string> = {};
    settings.forEach(item => {
      settingsMap[item.key] = item.value;
    });

    const smtpHost = settingsMap['smtp_host'];
    const smtpPort = parseInt(settingsMap['smtp_port'] || '587');
    const smtpUser = settingsMap['smtp_user'];
    const smtpPassword = settingsMap['smtp_password'];
    const smtpFromEmail = settingsMap['smtp_from_email'];
    const smtpFromName = settingsMap['smtp_from_name'] || 'VIBECODING';
    const smtpSecure = settingsMap['smtp_secure'] === 'true';

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFromEmail) {
      return new Response(
        JSON.stringify({ error: 'Incomplete SMTP configuration. Please fill all required fields.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const client = new SMTPClient({
      user: smtpUser,
      password: smtpPassword,
      host: smtpHost,
      port: smtpPort,
      tls: smtpSecure,
      timeout: 10000,
    });

    const message = await client.sendAsync({
      from: `${smtpFromName} <${smtpFromEmail}>`,
      to: testEmail,
      subject: 'VIBECODING - Test Email',
      text: 'This is a test email from VIBECODING admin panel. If you received this message, your SMTP settings are configured correctly!',
      attachment: [
        {
          data: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; background: #0a0a0f; color: #fff; padding: 40px; }
                .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(0,255,249,0.1), rgba(255,0,110,0.1)); border: 1px solid rgba(0,255,249,0.3); border-radius: 12px; padding: 40px; }
                h1 { color: #00fff9; margin-bottom: 20px; }
                p { line-height: 1.6; color: #ccc; }
                .success { background: rgba(0,255,100,0.2); border: 1px solid rgba(0,255,100,0.5); padding: 20px; border-radius: 8px; margin-top: 20px; }
                .success-text { color: #00ff64; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>VIBECODING</h1>
                <p>This is a test email from the VIBECODING admin panel.</p>
                <div class="success">
                  <p class="success-text">Your SMTP settings are configured correctly!</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">Sent at: ${new Date().toISOString()}</p>
              </div>
            </body>
            </html>
          `,
          alternative: true,
        },
      ],
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Test email sent successfully to ${testEmail}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending test email:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to send test email. Check your SMTP settings.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
