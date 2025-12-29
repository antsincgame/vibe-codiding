import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ResendEmailRequest {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
  tags?: Array<{ name: string; value: string }>;
}

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
        'resend_api_key',
        'resend_from_email',
        'resend_from_name',
        'resend_reply_to',
        'resend_track_opens',
        'resend_track_clicks'
      ]);

    if (!settings || settings.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Resend settings not configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const settingsMap: Record<string, string> = {};
    settings.forEach(item => {
      settingsMap[item.key] = item.value;
    });

    const resendApiKey = settingsMap['resend_api_key'];
    const fromEmail = settingsMap['resend_from_email'];
    const fromName = settingsMap['resend_from_name'] || 'VIBECODING';
    const replyTo = settingsMap['resend_reply_to'] || undefined;

    if (!resendApiKey || !fromEmail) {
      return new Response(
        JSON.stringify({ error: 'Resend API Key и Email отправителя обязательны. Заполните настройки.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
            <p class="success-text">Ваши настройки Resend работают корректно!</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">Отправлено: ${new Date().toLocaleString('ru-RU')}</p>
        </div>
      </body>
      </html>
    `;

    const emailPayload: ResendEmailRequest = {
      from: `${fromName} <${fromEmail}>`,
      to: [testEmail],
      subject: 'VIBECODING - Тестовое письмо',
      html: htmlContent,
      tags: [
        { name: 'category', value: 'test' },
        { name: 'environment', value: 'production' }
      ]
    };

    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({ 
          error: `Ошибка Resend API: ${resendData.message || 'Unknown error'}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('email_logs')
      .insert({
        resend_email_id: resendData.id,
        recipient_email: testEmail,
        subject: 'VIBECODING - Тестовое письмо',
        template_type: 'test',
        status: 'sent',
        metadata: { test: true }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Тестовое письмо успешно отправлено на ${testEmail}`,
        emailId: resendData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: `Ошибка отправки: ${errorMessage}. Проверьте настройки Resend.` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});