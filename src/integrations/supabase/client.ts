import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL не установлен в переменных окружения');
  throw new Error('VITE_SUPABASE_URL обязателен для работы приложения');
}

if (!SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY не установлен в переменных окружения');
  throw new Error('VITE_SUPABASE_ANON_KEY обязателен для работы приложения');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
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
  }
);