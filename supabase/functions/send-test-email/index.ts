import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.8";

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

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background: #0a0a0f; color: #fff; padding: 40px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(0,255,249,0.1), rgba(255,0,110,0.1)); border: 1px solid rgba(0,255,249,0.3); border-radius: 12px; padding: 40px; }
          h1 { color: #00fff9; margin-bottom: 20px; }
          p { line-height: 1.6; color: #ccc; }
          .success { background: rgba(0,255,100,0.2); border: 1px solid rgba(0,255,100,0.5); padding: 20px; border-radius: 8px; margin-top: 20px; }
          .success-text { color: #00ff64; font-weight: bold; margin: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>VIBECODING</h1>
          <p>Это тестовое письмо из админ-панели VIBECODING.</p>
          <div class="success">
            <p class="success-text">Ваши SMTP настройки работают корректно!</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">Отправлено: ${new Date().toLocaleString('ru-RU')}</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${smtpFromName}" <${smtpFromEmail}>`,
      to: testEmail,
      subject: 'VIBECODING - Тестовое письмо',
      text: 'Это тестовое письмо из админ-панели VIBECODING. Ваши SMTP настройки работают корректно!',
      html: htmlContent,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Тестовое письмо успешно отправлено на ${testEmail}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: `Ошибка отправки: ${errorMessage}. Проверьте настройки SMTP.` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
