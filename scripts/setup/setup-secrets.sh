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

# Configurar secrets (NUNCA hardcode secrets no repo)
echo "📝 Configurando secrets..."
echo ""

required_vars=(
  OPENAI_API_KEY
  GEMINI_API_KEY
  ANTHROPIC_API_KEY
  PERPLEXITY_API_KEY
  ELEVENLABS_API_KEY
)

missing=0
for v in "${required_vars[@]}"; do
  if [ -z "${!v}" ]; then
    echo "❌ Missing env var: $v"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo ""
  echo "Defina as variaveis acima e rode novamente. Exemplo:"
  echo "  export OPENAI_API_KEY='sk-proj-...'"
  echo "  export GEMINI_API_KEY='AIzaSy...'"
  echo "  export ANTHROPIC_API_KEY='sk-ant-...'"
  echo "  export PERPLEXITY_API_KEY='pplx-...'"
  echo "  export ELEVENLABS_API_KEY='sk_...'"
  exit 1
fi

npx supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY" --project-ref "$PROJECT_REF"
npx supabase secrets set GEMINI_API_KEY="$GEMINI_API_KEY" --project-ref "$PROJECT_REF"
npx supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" --project-ref "$PROJECT_REF"
npx supabase secrets set PERPLEXITY_API_KEY="$PERPLEXITY_API_KEY" --project-ref "$PROJECT_REF"
npx supabase secrets set ELEVENLABS_API_KEY="$ELEVENLABS_API_KEY" --project-ref "$PROJECT_REF"

echo ""
echo "✅ Secrets configurados!"
echo ""
echo "💡 Para verificar, acesse:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
