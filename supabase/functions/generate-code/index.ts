import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  prompt: string;
  useAnthropicModel?: boolean;
}

serve(async (req) => {
  const startTime = performance.now();
  
  // Обработка CORS
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Handling preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, useAnthropicModel = false } = await req.json() as RequestBody;
    
    if (!prompt) {
      console.error('[Validation] Empty prompt received');
      throw new Error('Prompt is required');
    }

    console.log(`[Request] Received prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
    console.log(`[Config] Using model: ${useAnthropicModel ? 'Anthropic Claude' : 'OpenAI GPT'}`);
    console.log(`[Auth] API Keys present: OpenAI (${!!Deno.env.get("OPENAI_API_KEY")}), Anthropic (${!!Deno.env.get("ANTHROPIC_API_KEY")})`);

    let generatedCode = '';

    // Генерация кода через OpenAI
    if (!useAnthropicModel) {
      console.log('[OpenAI] Starting code generation');
      const openai = new OpenAI({
        apiKey: Deno.env.get("OPENAI_API_KEY") || ""
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates clean code based on descriptions. Provide only the code without explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      generatedCode = completion.choices[0]?.message?.content || "";
      console.log('[OpenAI] Code generation completed, length:', generatedCode.length);
    }
    // Генерация кода через Anthropic
    else {
      console.log('[Anthropic] Starting code generation');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Deno.env.get("ANTHROPIC_API_KEY") || "",
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: `Generate code based on this description: ${prompt}. Provide only clean code without explanations.`
            }
          ]
        })
      });

      const data = await response.json();
      generatedCode = data.content[0]?.text || "";
      console.log('[Anthropic] Code generation completed, length:', generatedCode.length);
    }

    const endTime = performance.now();
    console.log(`[Performance] Function execution time: ${(endTime - startTime).toFixed(2)}ms`);

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Error] Details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});