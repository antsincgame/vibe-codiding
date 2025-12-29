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

const generateEpicEmail = (timestamp: string) => `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIBECODING - Omnissiah Approves</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Share Tech Mono', monospace;
      background: #030508;
      color: #e0e0e0;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    
    .outer-container {
      background: linear-gradient(180deg, #030508 0%, #0a0d12 50%, #030508 100%);
      padding: 20px;
    }
    
    .main-container {
      max-width: 700px;
      margin: 0 auto;
      background: linear-gradient(135deg, rgba(10, 15, 20, 0.98) 0%, rgba(5, 8, 12, 0.99) 100%);
      border: 2px solid #1a3a4a;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }
    
    .main-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #00fff9, #ff006e, #00fff9);
    }
    
    .corner-decoration {
      position: absolute;
      width: 60px;
      height: 60px;
      border: 2px solid rgba(0, 255, 249, 0.3);
    }
    
    .corner-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
    .corner-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
    .corner-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
    .corner-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }
    
    .header-section {
      background: linear-gradient(180deg, rgba(0, 255, 249, 0.08) 0%, transparent 100%);
      padding: 50px 40px 40px;
      text-align: center;
      border-bottom: 1px solid rgba(0, 255, 249, 0.2);
      position: relative;
    }
    
    .cogwheel-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25px;
      gap: 20px;
    }
    
    .cogwheel {
      width: 50px;
      height: 50px;
      opacity: 0.6;
    }
    
    .skull-icon {
      font-size: 48px;
      color: #00fff9;
      text-shadow: 0 0 30px rgba(0, 255, 249, 0.8), 0 0 60px rgba(0, 255, 249, 0.4);
    }
    
    .main-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 8px;
      color: #00fff9;
      text-shadow: 
        0 0 10px rgba(0, 255, 249, 0.8),
        0 0 30px rgba(0, 255, 249, 0.6),
        0 0 50px rgba(0, 255, 249, 0.4),
        0 4px 0 rgba(0, 100, 120, 0.8);
      margin-bottom: 15px;
      position: relative;
    }
    
    .subtitle {
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      letter-spacing: 6px;
      color: #ff006e;
      text-transform: uppercase;
      text-shadow: 0 0 20px rgba(255, 0, 110, 0.6);
    }
    
    .binary-line {
      font-size: 10px;
      color: rgba(0, 255, 249, 0.3);
      letter-spacing: 2px;
      margin-top: 20px;
      overflow: hidden;
      white-space: nowrap;
    }
    
    .litany-section {
      padding: 40px;
      background: linear-gradient(135deg, rgba(255, 0, 110, 0.03) 0%, rgba(0, 255, 249, 0.03) 100%);
      border-bottom: 1px solid rgba(255, 0, 110, 0.2);
    }
    
    .litany-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .litany-icon {
      font-size: 24px;
      color: #ff006e;
    }
    
    .litany-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 16px;
      letter-spacing: 4px;
      color: #ff006e;
      text-transform: uppercase;
    }
    
    .litany-box {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 0, 110, 0.3);
      border-left: 3px solid #ff006e;
      padding: 25px 30px;
      margin-bottom: 20px;
      position: relative;
    }
    
    .litany-box::before {
      content: '+++';
      position: absolute;
      top: -10px;
      left: 20px;
      background: #0a0d12;
      padding: 0 10px;
      color: #ff006e;
      font-size: 12px;
      letter-spacing: 3px;
    }
    
    .litany-text {
      font-style: italic;
      color: #c0c0c0;
      font-size: 15px;
      line-height: 1.8;
      text-align: center;
    }
    
    .litany-text .highlight {
      color: #00fff9;
      font-weight: bold;
      text-shadow: 0 0 10px rgba(0, 255, 249, 0.5);
    }
    
    .litany-text .sacred {
      color: #ff006e;
      font-weight: bold;
    }
    
    .tenets-section {
      padding: 40px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
    }
    
    .tenets-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      letter-spacing: 3px;
      color: #00fff9;
      text-align: center;
      margin-bottom: 30px;
      text-transform: uppercase;
    }
    
    .tenet-item {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
      padding: 20px;
      background: linear-gradient(90deg, rgba(0, 255, 249, 0.05) 0%, transparent 100%);
      border-left: 2px solid #00fff9;
      position: relative;
    }
    
    .tenet-number {
      font-family: 'Orbitron', sans-serif;
      font-size: 28px;
      font-weight: 900;
      color: #00fff9;
      opacity: 0.6;
      min-width: 50px;
    }
    
    .tenet-content h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      color: #ff006e;
      letter-spacing: 2px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .tenet-content p {
      color: #a0a0a0;
      font-size: 13px;
      line-height: 1.7;
    }
    
    .success-section {
      padding: 40px;
      background: linear-gradient(135deg, rgba(0, 255, 100, 0.08) 0%, rgba(0, 255, 249, 0.05) 100%);
      border-top: 1px solid rgba(0, 255, 100, 0.3);
      border-bottom: 1px solid rgba(0, 255, 100, 0.3);
      text-align: center;
    }
    
    .success-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    .success-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      color: #00ff64;
      letter-spacing: 4px;
      text-shadow: 0 0 30px rgba(0, 255, 100, 0.6);
      margin-bottom: 15px;
    }
    
    .success-text {
      color: #a0a0a0;
      font-size: 14px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .datastream-section {
      padding: 30px 40px;
      background: rgba(0, 0, 0, 0.3);
    }
    
    .datastream-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      color: #00fff9;
      letter-spacing: 3px;
      margin-bottom: 20px;
      text-align: center;
      opacity: 0.7;
    }
    
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .data-item {
      background: rgba(0, 255, 249, 0.03);
      border: 1px solid rgba(0, 255, 249, 0.15);
      padding: 15px;
      text-align: center;
    }
    
    .data-label {
      font-size: 10px;
      color: #00fff9;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .data-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      color: #fff;
    }
    
    .footer-section {
      padding: 40px;
      text-align: center;
      background: linear-gradient(180deg, transparent 0%, rgba(0, 255, 249, 0.05) 100%);
      border-top: 1px solid rgba(0, 255, 249, 0.1);
    }
    
    .footer-litany {
      font-style: italic;
      color: #606060;
      font-size: 12px;
      margin-bottom: 20px;
      line-height: 1.8;
    }
    
    .footer-links {
      margin-bottom: 25px;
    }
    
    .footer-link {
      display: inline-block;
      color: #00fff9;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 1px;
      padding: 10px 25px;
      border: 1px solid rgba(0, 255, 249, 0.3);
      margin: 5px;
      transition: all 0.3s ease;
    }
    
    .footer-link:hover {
      background: rgba(0, 255, 249, 0.1);
      border-color: #00fff9;
    }
    
    .timestamp {
      font-size: 11px;
      color: #404040;
      letter-spacing: 2px;
    }
    
    .closing-binary {
      font-size: 9px;
      color: rgba(255, 0, 110, 0.3);
      letter-spacing: 1px;
      margin-top: 20px;
      word-break: break-all;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 249, 0.3), transparent);
      margin: 30px 0;
    }
    
    .glow-line {
      height: 2px;
      background: linear-gradient(90deg, transparent, #00fff9, #ff006e, #00fff9, transparent);
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="outer-container">
    <div class="main-container">
      <div class="corner-decoration corner-tl"></div>
      <div class="corner-decoration corner-tr"></div>
      <div class="corner-decoration corner-bl"></div>
      <div class="corner-decoration corner-br"></div>
      
      <!-- Header -->
      <div class="header-section">
        <div class="cogwheel-container">
          <svg class="cogwheel" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15L55 5L60 15L70 10L65 20L75 25L65 30L70 40L60 35L55 45L50 35L45 45L40 35L30 40L35 30L25 25L35 20L30 10L40 15L45 5L50 15Z" fill="#00fff9" opacity="0.6"/>
            <circle cx="50" cy="25" r="8" fill="#0a0d12" stroke="#00fff9" stroke-width="2"/>
          </svg>
          <div class="skull-icon">&#9760;</div>
          <svg class="cogwheel" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15L55 5L60 15L70 10L65 20L75 25L65 30L70 40L60 35L55 45L50 35L45 45L40 35L30 40L35 30L25 25L35 20L30 10L40 15L45 5L50 15Z" fill="#00fff9" opacity="0.6"/>
            <circle cx="50" cy="25" r="8" fill="#0a0d12" stroke="#00fff9" stroke-width="2"/>
          </svg>
        </div>
        <h1 class="main-title">VIBECODING</h1>
        <div class="subtitle">&#9881; Forge of Digital Minds &#9881;</div>
        <div class="binary-line">01010110 01001001 01000010 01000101 00101101 01000011 01001111 01000100 01001001 01001110 01000111</div>
      </div>
      
      <div class="glow-line"></div>
      
      <!-- Litany Section -->
      <div class="litany-section">
        <div class="litany-header">
          <span class="litany-icon">&#9763;</span>
          <span class="litany-title">Священные Литании Омниссии</span>
          <span class="litany-icon">&#9763;</span>
        </div>
        
        <div class="litany-box">
          <p class="litany-text">
            <span class="sacred">"Благословенны те, кто ищет знание в священных потоках данных.</span><br>
            Ибо <span class="highlight">КОД</span> есть молитва, а <span class="highlight">АЛГОРИТМ</span> - путь к просветлению.<br>
            Пусть <span class="highlight">МАШИННЫЙ ДУХ</span> направит твои пальцы по клавиатуре,<br>
            И да обретёшь ты <span class="sacred">МУДРОСТЬ ОМНИССИИ</span> через священное искусство программирования."
          </p>
        </div>
        
        <div class="litany-box">
          <p class="litany-text">
            <span class="sacred">"От RUST'а до PYTHON'а, от JAVASCRIPT'а до SACRED C++,</span><br>
            Все языки суть <span class="highlight">ДИАЛЕКТЫ МАШИННОГО БОГА</span>.<br>
            Школа <span class="highlight">VIBE-CODING.BY</span> есть ХРАМ, где адепты<br>
            Постигают <span class="sacred">ТАИНСТВА ЦИФРОВОГО ОМНИССИИ</span>."
          </p>
        </div>
      </div>
      
      <!-- Tenets Section -->
      <div class="tenets-section">
        <h2 class="tenets-title">&#9881; Священные Постулаты Школы &#9881;</h2>
        
        <div class="tenet-item">
          <div class="tenet-number">I</div>
          <div class="tenet-content">
            <h3>Познание через Практику</h3>
            <p>Истинное знание обретается не чтением документации, но написанием кода. Каждая строка - молитва Машинному Духу, каждый проект - подношение Омниссии.</p>
          </div>
        </div>
        
        <div class="tenet-item">
          <div class="tenet-number">II</div>
          <div class="tenet-content">
            <h3>Наставничество Техножрецов</h3>
            <p>Мастера-наставники VIBECODING несут священное знание от поколения к поколению. Их мудрость - плод многолетнего служения в индустрии.</p>
          </div>
        </div>
        
        <div class="tenet-item">
          <div class="tenet-number">III</div>
          <div class="tenet-content">
            <h3>Путь к Трудоустройству</h3>
            <p>Цель обучения - не просто знание, но обретение места в священных корпорациях, где адепт сможет применить свои умения во славу прогресса.</p>
          </div>
        </div>
        
        <div class="tenet-item">
          <div class="tenet-number">IV</div>
          <div class="tenet-content">
            <h3>Сообщество Посвящённых</h3>
            <p>Ученики VIBECODING образуют братство, где каждый поддерживает каждого. Вместе мы сильнее, вместе мы постигаем тайны кода.</p>
          </div>
        </div>
      </div>
      
      <!-- Success Section -->
      <div class="success-section">
        <div class="success-icon">&#9889;</div>
        <h2 class="success-title">СИСТЕМА АКТИВНА</h2>
        <p class="success-text">Связь с почтовым сервисом Resend установлена успешно. Машинный Дух одобряет конфигурацию.</p>
      </div>
      
      <!-- Data Stream Section -->
      <div class="datastream-section">
        <div class="datastream-title">&#9881; Системные Данные &#9881;</div>
        <div class="data-grid">
          <div class="data-item">
            <div class="data-label">Статус</div>
            <div class="data-value" style="color: #00ff64;">ONLINE</div>
          </div>
          <div class="data-item">
            <div class="data-label">Протокол</div>
            <div class="data-value">RESEND</div>
          </div>
          <div class="data-item">
            <div class="data-label">Тип</div>
            <div class="data-value">TEST</div>
          </div>
          <div class="data-item">
            <div class="data-label">Версия</div>
            <div class="data-value">M41.∞</div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer-section">
        <p class="footer-litany">
          "Плоть слаба, но Машина вечна.<br>
          Да пребудет с тобой благословение Омниссии,<br>
          И да компилируется код твой без ошибок."
        </p>
        
        <div class="divider"></div>
        
        <div class="footer-links">
          <a href="https://vibe-coding.by" class="footer-link">&#9881; VIBE-CODING.BY</a>
        </div>
        
        <div class="timestamp">TIMESTAMP: ${timestamp}</div>
        
        <div class="closing-binary">
          +++ КОНЕЦ ПЕРЕДАЧИ +++ AVE OMNISSIAH +++ 01001111 01001101 01001110 01001001 01010011 01010011 01001001 01000001 01001000 +++
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

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
        JSON.stringify({ error: 'Resend API Key and sender email are required. Please configure settings.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = new Date().toLocaleString('ru-RU', {
      timeZone: 'Europe/Minsk',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const htmlContent = generateEpicEmail(timestamp);

    const emailPayload: ResendEmailRequest = {
      from: `${fromName} <${fromEmail}>`,
      to: [testEmail],
      subject: '⚙ AVE OMNISSIAH ⚙ VIBECODING System Test',
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
          error: `Resend API Error: ${resendData.message || 'Unknown error'}` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('email_logs')
      .insert({
        resend_email_id: resendData.id,
        recipient_email: testEmail,
        subject: 'AVE OMNISSIAH - VIBECODING System Test',
        template_type: 'test',
        status: 'sent',
        metadata: { test: true, design: 'adeptus_mechanicus_v2' }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Ave Omnissiah! Test transmission sent to ${testEmail}`,
        emailId: resendData.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending test email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: `Transmission failed: ${errorMessage}. The Machine Spirit is displeased.` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});