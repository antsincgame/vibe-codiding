import { supabase } from './supabase';

interface TrialRegistrationData {
  age_group: string;
  parent_name: string;
  child_name?: string;
  child_age?: number;
  phone: string;
  email: string;
  message: string;
}

export async function sendTrialRegistrationEmails(data: TrialRegistrationData) {
  try {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['notification_email', 'smtp_host']);

    if (!settings || settings.length === 0) {
      console.log('Email settings not configured');
      return;
    }

    console.log('Email would be sent to:', data.email);
    console.log('Registration data:', data);
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}
