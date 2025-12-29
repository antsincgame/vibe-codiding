import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { token, email, newPassword } = await req.json();
    
    if (!token || !email || !newPassword) {
      return new Response(
        JSON.stringify({ error: 'Token, email and new password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePassword(newPassword)) {
      return new Response(
        JSON.stringify({ 
          error: 'weak_password', 
          message: 'Password must be at least 8 characters and contain uppercase, lowercase letters and numbers' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from('auth_tokens')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('token_type', 'password_reset')
      .is('used_at', null)
      .maybeSingle();

    if (tokenError) {
      console.error('Token lookup error:', tokenError);
      return new Response(
        JSON.stringify({ error: 'invalid_token', message: 'Error looking up token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!tokenData) {
      return new Response(
        JSON.stringify({ error: 'invalid_token', message: 'Invalid or expired reset link' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      await supabase.from('auth_tokens').delete().eq('id', tokenData.id);
      return new Response(
        JSON.stringify({ error: 'token_expired', message: 'Reset link has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!tokenData.user_id) {
      return new Response(
        JSON.stringify({ error: 'invalid_token', message: 'Invalid reset token - no user associated' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Attempting to update password for user:', tokenData.user_id);

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(tokenData.user_id);
    
    if (userError || !userData.user) {
      console.error('User lookup error:', userError);
      return new Response(
        JSON.stringify({ error: 'user_not_found', message: 'User not found in system' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      if (updateError.message.includes('weak') || updateError.message.includes('password')) {
        return new Response(
          JSON.stringify({ error: 'weak_password', message: 'Password is too weak. Please use a stronger password.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'update_failed', message: `Failed to update password: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('auth_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    await supabase
      .from('auth_tokens')
      .delete()
      .eq('email', email)
      .eq('token_type', 'password_reset')
      .is('used_at', null);

    console.log('Password updated successfully for user:', tokenData.user_id);

    return new Response(
      JSON.stringify({ success: true, message: 'Password updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error resetting password:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Server error: ${errorMessage}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});