#!/bin/bash
# Script para configurar Edge Function Secrets via CLI
# Requer: npx supabase login (ou SUPABASE_ACCESS_TOKEN)

PROJECT_REF="lqahkqfpynypbmhtffyi"

echo "🔐 Configurando Edge Function Secrets para projeto: $PROJECT_REF"
echo ""

# Verificar se está autenticado
if ! npx supabase projects list &>/dev/null; then
  echo "❌ Erro: Não autenticado no Supabase CLI"
  echo "   Execute: npx supabase login"
  echo "   Ou configure: export SUPABASE_ACCESS_TOKEN='sbp_...'"
  exit 1
fi

# Configurar secrets (substitua pelos valores reais)
echo "📝 Configurando secrets..."
echo ""

npx supabase secrets set OPENAI_API_KEY="***REMOVED***" --project-ref "$PROJECT_REF"
npx supabase secrets set GEMINI_API_KEY="***REMOVED***" --project-ref "$PROJECT_REF"
npx supabase secrets set ANTHROPIC_API_KEY="***REMOVED***" --project-ref "$PROJECT_REF"
npx supabase secrets set PERPLEXITY_API_KEY="***REMOVED***" --project-ref "$PROJECT_REF"
npx supabase secrets set ELEVENLABS_API_KEY="***REMOVED***" --project-ref "$PROJECT_REF"

echo ""
echo "✅ Secrets configurados!"
echo ""
echo "💡 Para verificar, acesse:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
