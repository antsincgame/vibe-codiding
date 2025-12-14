import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vagtcecbikwvbzacfwqm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZ3RjZWNiaWt3dmJ6YWNmd3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTkwMTksImV4cCI6MjA4MTEzNTAxOX0.kVBgt2AxgRNytrSx77CAsZho_UMaoMJDAAWmDH3FCRw'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
