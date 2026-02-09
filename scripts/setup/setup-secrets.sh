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

npx supabase secrets set OPENAI_API_KEY="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" --project-ref "$PROJECT_REF"
npx supabase secrets set GEMINI_API_KEY="AIzaSyDS3Y2f52psfek7_dWC_QufBW6jTt85ZV8" --project-ref "$PROJECT_REF"
npx supabase secrets set ANTHROPIC_API_KEY="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" --project-ref "$PROJECT_REF"
npx supabase secrets set PERPLEXITY_API_KEY="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" --project-ref "$PROJECT_REF"
npx supabase secrets set ELEVENLABS_API_KEY="sk_dbcc3162ec773d08cee79219e34a1e211bfee278f0d730ee" --project-ref "$PROJECT_REF"

echo ""
echo "✅ Secrets configurados!"
echo ""
echo "💡 Para verificar, acesse:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
