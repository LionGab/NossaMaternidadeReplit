/**
 * CORS Helper para Edge Functions
 *
 * Segurança:
 * - Permite chamadas nativas (sem Origin header) - apps mobile
 * - Restringe Web a allowlist de origens configurada via env
 * - Previne CSRF e acesso não autorizado
 *
 * Uso:
 * 1. Configure ALLOWED_ORIGINS no Supabase Secrets:
 *    "https://app.nossamaternidade.com,https://admin.nossamaternidade.com"
 * 2. Use handlePreflight() para OPTIONS
 * 3. Use buildCorsHeaders() em todas as respostas
 */

export function getAllowedOrigins(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS") ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildCorsHeaders(req: Request): Headers {
  const headers = new Headers();
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "authorization, x-client-info, apikey, content-type");

  const origin = req.headers.get("Origin");
  if (!origin) {
    // Chamadas nativas (sem Origin header) - permitido
    return headers;
  }

  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }

  return headers;
}

export function isOriginAllowed(req: Request): boolean {
  const origin = req.headers.get("Origin");
  if (!origin) return true; // nativo - sempre permitido

  const allowed = getAllowedOrigins();
  return allowed.includes(origin);
}

export function handlePreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;

  if (!isOriginAllowed(req)) {
    return new Response("Forbidden", { status: 403 });
  }

  const headers = buildCorsHeaders(req);
  return new Response(null, { status: 204, headers });
}
