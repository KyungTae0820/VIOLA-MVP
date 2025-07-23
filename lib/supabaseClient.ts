import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://icspercgwcnstspnrhqr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljc3BlcmNnd2Nuc3RzcG5yaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzU5MDMsImV4cCI6MjA2ODQxMTkwM30.-EcQ3m5lAPQcLA1Rr7e-DVHMYoHB5MwrUANG0M3XytQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
