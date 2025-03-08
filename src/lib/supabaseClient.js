import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ehwzmnpmtukqybibgwuk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVod3ptbnBtdHVrcXliaWJnd3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzYxMjksImV4cCI6MjA1MDAxMjEyOX0.6zq77zrf8aa2AYR-VTs8fgSALVTEIbOjM4pcNXQR9Xw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
