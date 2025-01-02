import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://msqyjrpkylernifouxct.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcXlqcnBreWxlcm5pZm91eGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzA4MDUsImV4cCI6MjA1MTM0NjgwNX0.bTNPVbC47amZfBenyT-zIqpb01wZW0Bjm_oT6gXb0M4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'skillacademyhub'
    }
  }
});