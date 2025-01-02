import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') || '',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, technology = 'react', projectId } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`Processing prompt for ${technology}: "${prompt}"`);

    const systemPrompt = `You are an AI assistant that generates ${technology.toUpperCase()} code based on user descriptions. 
    Always provide complete, working code examples with proper imports and error handling.
    For React components, include proper TypeScript types and use modern React practices.
    For Vue components, use Vue 3 composition API.
    For Node.js, include proper error handling and follow best practices.
    Respond in the following format:
    <lov-write file_path="path/to/file">
    // Your code here