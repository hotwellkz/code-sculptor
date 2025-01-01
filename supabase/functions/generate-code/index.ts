import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Received request:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, projectId } = await req.json();
    console.log('Received prompt:', prompt);

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY') || '');
    console.log('OpenAI client initialized');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful code generator. Generate clean, well-documented code based on the user's description."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const generatedCode = response.choices[0].message.content;
    console.log('Code generated successfully');

    // Save generated code to the database
    if (projectId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: fileError } = await supabase
        .from('generated_files')
        .insert({
          project_id: projectId,
          name: 'generated-code.ts',
          content: generatedCode,
          path: '/generated-code.ts'
        });

      if (fileError) {
        console.error('Error saving generated file:', fileError);
        throw fileError;
      }
    }

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});