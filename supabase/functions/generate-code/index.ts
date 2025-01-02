import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  prompt: string;
  projectId?: string;
  technology: string;
}

serve(async (req) => {
  const startTime = performance.now();
  
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Handling preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, technology = 'react', projectId } = await req.json() as RequestBody;
    
    if (!prompt) {
      console.error('[Validation] Empty prompt received');
      throw new Error('Prompt is required');
    }

    console.log(`[Request] Received prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}" for ${technology}`);
    
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY") || ""
    });

    // Формируем системный промпт в зависимости от выбранной технологии
    const systemPrompt = `You are an AI assistant that generates ${technology.toUpperCase()} code based on user descriptions. 
    Always provide complete, working code examples with proper imports and error handling.
    For React components, include proper TypeScript types and use modern React practices.
    For Vue components, use Vue 3 composition API.
    For Node.js, include proper error handling and follow best practices.
    Respond in the following format:
    <lov-write file_path="path/to/file">
    // code here