/**
 * ElevenLabs TTS Edge Function
 *
 * Proxy seguro para ElevenLabs API - mantém API key no servidor
 * Aceita texto + voiceId, retorna audio base64
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

function jsonResponse(data: unknown, status: number, requestObj: Request): Response {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

serve(async (req) => {
  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  try {
    // 1. Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401, req);
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401, req);
    }

    // 2. Validar payload
    const {
      text,
      voiceId,
      modelId = "eleven_multilingual_v2",
      voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.4,
        use_speaker_boost: true,
      },
    } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return jsonResponse({ error: "Invalid or missing text" }, 400, req);
    }

    if (text.length > 5000) {
      return jsonResponse({ error: "Text too long (max 5000 chars)" }, 400, req);
    }

    // 3. Obter configuração do ElevenLabs
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "ElevenLabs not configured" }, 500, req);
    }

    const resolvedVoiceId =
      (typeof voiceId === "string" && voiceId.trim()) ||
      Deno.env.get("ELEVENLABS_VOICE_ID_DEFAULT") ||
      "EXAVITQu4vr4xnSDxMaL"; // Bella - fallback

    // 4. Chamar ElevenLabs API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`;

    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: modelId,
        voice_settings: voiceSettings,
      }),
    });

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text().catch(() => "Unknown error");
      console.error("ElevenLabs API error:", elevenLabsResponse.status, errorText.slice(0, 500));

      return jsonResponse(
        {
          error: "elevenlabs_failed",
          status: elevenLabsResponse.status,
          details: errorText.slice(0, 200),
        },
        502,
        req
      );
    }

    // 5. Converter audio para base64
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);

    // Converter para base64
    let binary = "";
    const len = audioBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(audioBytes[i]);
    }
    const audioBase64 = btoa(binary);

    console.log(`TTS generated: ${text.length} chars → ${audioBytes.length} bytes audio`);

    // 6. Retornar resposta
    return jsonResponse(
      {
        audioBase64,
        mimeType: "audio/mpeg",
        textLength: text.length,
        audioSize: audioBytes.length,
      },
      200,
      req
    );
  } catch (error) {
    console.error("Edge function error:", error);

    return jsonResponse(
      {
        error: "internal_error",
        message: error instanceof Error ? error.message : String(error),
      },
      500,
      req
    );
  }
});
