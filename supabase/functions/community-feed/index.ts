import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { handlePreflight, buildCorsHeaders, isOriginAllowed } from "../_shared/cors.ts";

serve(async (req) => {
  // 1. Handle CORS preflight
  const preflightResponse = handlePreflight(req);
  if (preflightResponse) return preflightResponse;

  // 2. Validate origin for non-preflight requests
  if (!isOriginAllowed(req)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const corsHeaders = buildCorsHeaders(req);

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
      const headers = new Headers(corsHeaders);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    // 2. Parâmetros de Paginação
    const { page = 1, limit = 10, type = "feed" } = await req.json();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseClient
      .from("community_posts")
      .select(
        `
        *,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    // 3. Filtros Baseados no Tipo
    if (type === "my_posts") {
      // Meus posts: ver tudo (draft, submitted, approved, rejected)
      query = query.eq("author_id", user.id);
    } else {
      // Feed público: apenas approved
      query = query.eq("status", "approved");

      // TODO: Filtrar usuários bloqueados (seria um .not('author_id', 'in', blocked_ids))
      // Para performance, idealmente isso é feito em uma View ou RPC, mas aqui no Edge funciona para MVP
      const { data: blocks } = await supabaseClient
        .from("community_user_blocks")
        .select("blocked_user_id")
        .eq("user_id", user.id);

      if (blocks && blocks.length > 0) {
        const blockedIds = blocks.map((b) => b.blocked_user_id);
        query = query.not("author_id", "in", `(${blockedIds.join(",")})`);
      }
    }

    const { data: posts, error: dbError } = await query;

    if (dbError) throw dbError;

    // 4. Gerar Signed URLs para mídia privada
    // Bucket: community-media
    const postsWithMedia = await Promise.all(
      (posts || []).map(async (post) => {
        if (!post.media_path) return post;

        // Gerar URL assinada válida por 1 hora
        const { data: signedData } = await supabaseClient.storage
          .from("community-media")
          .createSignedUrl(post.media_path, 3600);

        return {
          ...post,
          signed_media_url: signedData?.signedUrl || null,
        };
      })
    );

    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ data: postsWithMedia }), {
      headers,
    });
  } catch (error) {
    const headers = new Headers(corsHeaders);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers,
    });
  }
});
