import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.69.0/mod.ts";
import { Anthropic } from "https://deno.land/x/anthropic@v1.1.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  prompt: string;
  model?: "openai" | "anthropic";
}

serve(async (req) => {
  // Обработка CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, model = "openai" } = await req.json() as RequestBody;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    let generatedCode = "";

    // Генерация кода через OpenAI
    if (model === "openai") {
      const openai = new OpenAI(Deno.env.get("OPENAI_API_KEY") || "");
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful code generator. Generate only clean code without explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      generatedCode = completion.choices[0]?.message?.content || "";
    }
    // Генерация кода через Anthropic
    else {
      const anthropic = new Anthropic({
        apiKey: Deno.env.get("ANTHROPIC_API_KEY") || ""
      });
      
      const completion = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Generate code based on this description: ${prompt}. Provide only clean code without explanations.`
          }
        ]
      });

      generatedCode = completion.content[0]?.text || "";
    }

    // Логирование успешной генерации
    console.log(`Code generated successfully for prompt: ${prompt.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    // Логирование ошибок
    console.error("Error generating code:", error);

    return new Response(
      JSON.stringify({ 
        error: "Failed to generate code", 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});