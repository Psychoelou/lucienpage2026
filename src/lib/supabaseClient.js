import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqksmilfrsjwieikvmzx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3NtaWxmcnNqd2llaWt2bXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzUyNzksImV4cCI6MjA5MTMxMTI3OX0.Wn_k4Bf68s3-1vNJ9ZBbLxroOBdgfNHTw2bCKEcstB8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  },
})

