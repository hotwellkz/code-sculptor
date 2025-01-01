import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.24.0/mod.ts";
import { Anthropic } from "https://deno.land/x/anthropic@v0.1.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI(Deno.env.get('OPENAI_API_KEY') || '');
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
    });

    try {
      // Try OpenAI first
      const openaiResponse = await openai.chat.completions.create({
        model: "gpt-4",
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

      return new Response(
        JSON.stringify({ 
          code: openaiResponse.choices[0].message.content,
          provider: 'openai'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (openaiError) {
      console.error('OpenAI Error:', openaiError);

      // Fallback to Anthropic if OpenAI fails
      try {
        const anthropicResponse = await anthropic.messages.create({
          model: "claude-3-opus-20240229",
          max_tokens: 4096,
          messages: [{
            role: "user",
            content: prompt
          }]
        });

        return new Response(
          JSON.stringify({ 
            code: anthropicResponse.content[0].text,
            provider: 'anthropic'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );

      } catch (anthropicError) {
        console.error('Anthropic Error:', anthropicError);
        throw new Error('Both AI providers failed');
      }
    }

  } catch (error) {
    console.error('Server Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});