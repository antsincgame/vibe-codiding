import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zxywgueplrosvdwgpmvb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXdndWVwbHJvc3Zkd2dwbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzE4NDcsImV4cCI6MjA3ODcwNzg0N30.xyJkFplsbLrBIWEHNksO681xR9htWpV0N45keuc-Uro'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    autoRefreshToken: true,
    persistSession: true,
    storage: sessionStorage
  }
})
