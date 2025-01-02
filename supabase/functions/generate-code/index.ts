import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY') || '',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, technology = 'react', projectId } = await req.json();
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log(`Processing prompt for ${technology}: "${prompt}"`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that generates ${technology.toUpperCase()} code based on user descriptions. 
          Always provide complete, working code examples with proper imports and error handling.
          For React components, include proper TypeScript types and use modern React practices.
          For Vue components, use Vue 3 composition API.
          For Node.js, include proper error handling and follow best practices.`
        },
        { role: 'user', content: prompt }
      ],
    });

    const generatedCode = response.choices[0].message.content;

    // If projectId is provided, save the generated code to the database
    if (projectId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      );

      const { error: saveError } = await supabaseClient
        .from('generated_files')
        .insert({
          project_id: projectId,
          name: `generated_${new Date().getTime()}.${technology === 'react' ? 'tsx' : 'js'}`,
          content: generatedCode,
          path: `/src/generated/${technology}/`,
        });

      if (saveError) {
        console.error('Error saving generated code:', saveError);
        throw new Error('Failed to save generated code');
      }
    }

    return new Response(
      JSON.stringify({ 
        response: generatedCode,
        technology,
        projectId 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});