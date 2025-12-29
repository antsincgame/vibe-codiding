import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InboundEmailPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    message_id?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{
      id: string;
      filename: string;
      content_type: string;
      content_disposition?: string;
      content_id?: string;
    }>;
  };
}

interface ResendEmailContent {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: InboundEmailPayload = await req.json();

    console.log('Received inbound email webhook:', JSON.stringify(payload, null, 2));

    if (payload.type !== 'email.received') {
      console.log('Not an email.received event, skipping');
      return new Response(
        JSON.stringify({ success: true, message: 'Event type not handled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailData = payload.data;

    console.log(`Fetching email content for email_id: ${emailData.email_id}`);

    const resendResponse = await fetch(`https://api.resend.com/emails/${emailData.email_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!resendResponse.ok) {
      console.error('Failed to fetch email content from Resend:', resendResponse.status, await resendResponse.text());
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const emailContent: ResendEmailContent = await resendResponse.json();
    console.log('Successfully fetched email content from Resend');

    const fromMatch = emailData.from.match(/^(.+?)\s*<(.+?)>$/) || [null, null, emailData.from];
    const fromName = fromMatch[1]?.trim() || null;
    const fromEmail = fromMatch[2] || emailData.from;

    const attachmentsMetadata: Array<{
      filename: string;
      content_type: string;
      size: number;
      storage_path: string;
    }> = [];

    if (emailData.attachments && emailData.attachments.length > 0) {
      console.log(`Processing ${emailData.attachments.length} attachments`);

      for (const attachment of emailData.attachments) {
        try {
          const attachmentResponse = await fetch(`https://api.resend.com/emails/${emailData.email_id}/attachments/${attachment.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`
            }
          });

          if (!attachmentResponse.ok) {
            console.error(`Failed to fetch attachment ${attachment.filename}:`, attachmentResponse.status);
            continue;
          }

          const attachmentBlob = await attachmentResponse.blob();
          const attachmentBuffer = await attachmentBlob.arrayBuffer();
          const binaryData = new Uint8Array(attachmentBuffer);

          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const storagePath = `${emailData.email_id}/${timestamp}-${randomStr}-${attachment.filename}`;

          const { error: uploadError } = await supabase.storage
            .from('email-attachments')
            .upload(storagePath, binaryData, {
              contentType: attachment.content_type,
              upsert: false
            });

          if (uploadError) {
            console.error('Failed to upload attachment:', uploadError);
          } else {
            attachmentsMetadata.push({
              filename: attachment.filename,
              content_type: attachment.content_type,
              size: binaryData.length,
              storage_path: storagePath
            });
            console.log(`Uploaded attachment: ${attachment.filename}`);
          }
        } catch (error) {
          console.error(`Error processing attachment ${attachment.filename}:`, error);
        }
      }
    }

    const { error: insertError } = await supabase
      .from('inbox')
      .insert({
        message_id: emailData.email_id,
        from_email: fromEmail,
        from_name: fromName,
        to_email: emailData.to[0],
        subject: emailData.subject || '(No subject)',
        text_content: emailContent.text || null,
        html_content: emailContent.html || null,
        headers: emailContent.headers || {},
        attachments: attachmentsMetadata,
        is_read: false,
        is_archived: false
      });

    if (insertError) {
      console.error('Error inserting email into inbox:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store email', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully stored email ${emailData.email_id} with ${attachmentsMetadata.length} attachments`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email received and stored',
        email_id: emailData.email_id,
        attachments_count: attachmentsMetadata.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});