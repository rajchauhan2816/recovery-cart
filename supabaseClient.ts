import { createClient } from 'https://esm.sh/@supabase/supabase-js@^1.33.2'

export const supabaseClient = createClient(
  // Supabase API URL - env var exported by default when deployed.
  Deno.env.get('SUPABASE_URL') ?? 'https://qmnsavmlqqnbvfpxsceo.supabase.co',
  // Supabase API ANON KEY - env var exported by default when deployed.
  Deno.env.get('SUPABASE_ANON_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbnNhdm1scXFuYnZmcHhzY2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTk5NDkwNTIsImV4cCI6MTk3NTUyNTA1Mn0.vK1sBwC4uLWZr_7vjRE-HtV0oOnfTcgPXdsSy-r59iU'
)