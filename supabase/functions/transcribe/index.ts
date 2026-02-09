/**
 * Nossa Maternidade - Transcribe Edge Function
 *
 * Transcreve audio para texto usando OpenAI Whisper.
 * Usado para mensagens de voz no chat da NathIA.
 *
 * @version 1.0.0
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.89.0";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

// =======================
// ENV & CLIENTS
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

const openai = new OpenAI({ apiKey: OPENAI_KEY });

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req) => {
  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  try {
    // 1. JWT Validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401, req);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired token" }, 401, req);
    }

    // 2. Parse request
    const body = await req.json();
    const { audioBase64, mimeType = "audio/m4a" } = body;

    if (!audioBase64) {
      return jsonResponse({ error: "Audio data is required" }, 400, req);
    }

    // Validate audio size (max 25MB for Whisper)
    const audioSizeBytes = (audioBase64.length * 3) / 4;
    const maxSizeMB = 25;
    if (audioSizeBytes > maxSizeMB * 1024 * 1024) {
      return jsonResponse(
        { error: `Audio file too large. Maximum size is ${maxSizeMB}MB` },
        400,
        req
      );
    }

    console.log(
      `[Transcribe] Processing audio: ${(audioSizeBytes / 1024).toFixed(1)}KB, type: ${mimeType}`
    );

    // 3. Convert base64 to File for OpenAI
    const audioBuffer = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));

    // Determine file extension from mime type
    const extensionMap: Record<string, string> = {
      "audio/m4a": "m4a",
      "audio/mp4": "m4a",
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/webm": "webm",
      "audio/ogg": "ogg",
    };
    const extension = extensionMap[mimeType] || "m4a";

    // Create a File object for OpenAI API
    const audioFile = new File([audioBuffer], `audio.${extension}`, { type: mimeType });

    // 4. Call OpenAI Whisper
    const startTime = Date.now();

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "pt", // Portuguese (Brazil)
      response_format: "text",
    });

    const latency = Date.now() - startTime;
    console.log(`[Transcribe] Success: ${latency}ms, text length: ${transcription.length}`);

    // 5. Return transcription
    return jsonResponse(
      {
        text: transcription,
        latency,
      },
      200,
      req
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[Transcribe] Error:", err.message);

    return jsonResponse(
      {
        error: "Failed to transcribe audio",
        details: err.message,
      },
      500,
      req
    );
  }
});

// =======================
// HELPERS
// =======================

function jsonResponse(data: unknown, status: number, requestObj: Request) {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}
