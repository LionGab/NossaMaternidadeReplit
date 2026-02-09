import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";

function jsonResponse(data: unknown, status: number = 200, requestObj: Request): Response {
  const headers = buildCorsHeaders(requestObj);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { status, headers });
}

serve(async (req) => {
  // CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // 1. Verificar Autenticação
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401, req);
    }

    // 2. Verificar Status Premium
    // Tenta buscar na tabela de subscriptions (se existir integração)
    // Ou verifica flag no profile
    // Para MVP seguro: Se não tiver certeza, assume false e bloqueia mídia
    let isPremium = false;

    // Check 1: Tabela subscriptions (comum em integrações RC)
    const { data: subs } = await supabaseClient
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .maybeSingle();

    if (subs) isPremium = true;

    // Check 2: Admin sempre é premium
    if (!isPremium) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (profile?.is_admin) isPremium = true;
    }

    // 3. Buscar Posts (Apenas publicados)
    const { page = 1, limit = 10 } = await req.json();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: posts, error: dbError } = await supabaseClient
      .from("mundo_nath_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .range(from, to);

    if (dbError) throw dbError;

    // 4. Processar Mídia (Privacy Check)
    const processedPosts = await Promise.all(
      (posts || []).map(async (post, index) => {
        // Lógica de Preview:
        // Se Premium: Vê tudo.
        // Se Free: Vê apenas os 3 primeiros posts do feed como "teaser" (opcional) OU nenhum.
        // Requisito: "Não-premium vê preview (2-3 cards com lock)"
        // Isso significa que ele vê o card (título/texto), mas a MÍDIA tem lock.

        let signedUrl = null;

        if (post.media_path) {
          if (isPremium) {
            // Gera URL
            const { data: signedData } = await supabaseClient.storage
              .from("mundo-nath-media")
              .createSignedUrl(post.media_path, 3600);
            signedUrl = signedData?.signedUrl;
          } else {
            // Free User:
            // Não gera URL. O frontend deve mostrar cadeado/blur.
            signedUrl = null;
          }
        }

        return {
          ...post,
          signed_media_url: signedUrl,
          is_locked: !isPremium && !!post.media_path, // Flag para UI saber se deve mostrar cadeado
        };
      })
    );

    return jsonResponse(
      {
        data: processedPosts,
        user_is_premium: isPremium,
      },
      200,
      req
    );
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      400,
      req
    );
  }
});
