# 🔄 Ralph Wiggum - Prompts Ultra-Robustos

**Data:** 30 de dezembro de 2025
**Plugin:** `/ralph-wiggum:ralph-loop`
**Estratégia:** Ultra-think com verificações sistemáticas

---

## 🎯 PROMPT 1: Configuração Supabase OAuth (P0 - CRÍTICO)

**Contexto:** App Nossa Maternidade - login OAuth não funciona sem essas configurações.

**Prompt para `/ralph-wiggum:ralph-loop`:**

```
⚙️ TASK: Validar e documentar estado atual de configurações OAuth Supabase
📋 TYPE: validation + documentation
🎯 DONE: Relatório completo com status de cada configuração + comandos de verificação
🚫 SCOPE: Apenas leitura/verificação via API e documentação (NÃO modificar código)

──────────────────────────────────────────────────────────────
📍 CONTEXTO DO PROJETO
──────────────────────────────────────────────────────────────

Projeto: Nossa Maternidade (iOS/Android React Native)
Supabase Project ID: lqahkqfpynypbmhtffyi
Data atual: 30 de dezembro de 2025

Configurações críticas que precisam estar funcionando:
1. URL Configuration (Site URL + Redirect URLs)
2. Google OAuth Provider (habilitado com credenciais)
3. Apple Sign-In Provider (habilitado com credenciais)

──────────────────────────────────────────────────────────────
🔍 COMANDOS DE VERIFICAÇÃO (executar todos)
──────────────────────────────────────────────────────────────

1) Verificar status providers via API:
   npm run test:oauth

2) Se não existir script, criar query manual:
   curl -s "https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/settings" \
     -H "apikey: $(grep EXPO_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d= -f2)" | jq '.external'

3) Verificar redirect URIs no código:
   grep -rn "nossamaternidade://" src/ | head -20

4) Verificar configuração local (config.toml):
   cat supabase/config.toml | grep -A 5 "additional_redirect_urls"

──────────────────────────────────────────────────────────────
📊 VALIDAÇÕES OBRIGATÓRIAS
──────────────────────────────────────────────────────────────

Para cada configuração, criar seção no relatório com:
- ✅ Status: ATIVO / ⚠️ PARCIAL / ❌ INATIVO
- 🔗 Link direto do Dashboard Supabase
- 📝 Comandos de verificação executados
- 🐛 Problemas encontrados (se houver)
- ✅ Checklist de itens pendentes

──────────────────────────────────────────────────────────────
📄 SAÍDA ESPERADA
──────────────────────────────────────────────────────────────

Arquivo: docs/SUPABASE_OAUTH_STATUS_REPORT_2025-12-30.md

Conteúdo:
1. Status Executivo (resumo em tabela)
2. P0.1 - URL Configuration (Status + Links + Verificações)
3. P0.2 - Google OAuth (Status + Links + Verificações)
4. P0.3 - Apple Sign-In (Status + Links + Verificações)
5. Comandos de Teste (copy-paste ready)
6. Próximos Passos (ações manuais necessárias)

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO
──────────────────────────────────────────────────────────────

✗ NÃO assumir status - sempre verificar via API/comandos
✗ NÃO modificar código - apenas documentar estado atual
✗ NÃO criar credenciais - apenas verificar se existem
✗ SEMPRE incluir links diretos do Dashboard Supabase
✗ SEMPRE incluir comandos executados e seus resultados

STOP CONDITIONS:
- Todos os comandos executados
- Relatório completo gerado
- Links diretos documentados
- Status de cada item validado

──────────────────────────────────────────────────────────────
✅ QUALITY GATES
──────────────────────────────────────────────────────────────

Após gerar relatório:
1. Verificar que todos os comandos foram executados
2. Verificar que links diretos estão corretos
3. Verificar que status reflete realidade (não suposições)
4. Verificar que próximos passos são ações manuais (não código)

COMPLETION PROMISE: "✅ Relatório de status OAuth completo e validado"
```

---

## 🎯 PROMPT 2: Migrations Pendentes Supabase (P0 - CRÍTICO)

**Contexto:** 3 migrations não aplicadas (027, 028, 029) podem causar falhas em produção.

**Prompt para `/ralph-wiggum:ralph-loop`:**

```
⚙️ TASK: Verificar e aplicar migrations pendentes do Supabase
📋 TYPE: database migration
🎯 DONE: Todas as migrations aplicadas + verificação de integridade
🚫 SCOPE: Apenas migrations (NÃO modificar migrations existentes)

──────────────────────────────────────────────────────────────
📍 CONTEXTO
──────────────────────────────────────────────────────────────

Projeto: Nossa Maternidade
Supabase Project ID: lqahkqfpynypbmhtffyi
Data: 30 de dezembro de 2025

Migrations pendentes (segundo SUPABASE_BLOCKERS_LANCAMENTO.md):
- 027_complete_rls_policies.sql
- 028_nath_journey_onboarding.sql
- 029_fase2_community_mundonath.sql

──────────────────────────────────────────────────────────────
🔍 FASE 1: VERIFICAÇÃO (obrigatória antes de aplicar)
──────────────────────────────────────────────────────────────

1) Listar migrations aplicadas no remoto:
   npx supabase migration list --project-ref lqahkqfpynypbmhtffyi

2) Listar migrations locais:
   ls -1 supabase/migrations/ | sort

3) Comparar e identificar gaps:
   - Criar lista de migrations locais
   - Criar lista de migrations remotas
   - Identificar diferenças

4) Verificar conteúdo das migrations pendentes:
   cat supabase/migrations/027_complete_rls_policies.sql | head -50
   cat supabase/migrations/028_nath_journey_onboarding.sql | head -50
   cat supabase/migrations/029_fase2_community_mundonath.sql | head -50

──────────────────────────────────────────────────────────────
⚙️ FASE 2: APLICAÇÃO (se faltarem migrations)
──────────────────────────────────────────────────────────────

Se migrations pendentes forem identificadas:

1) Aplicar migrations pendentes:
   npx supabase db push --project-ref lqahkqfpynypbmhtffyi

2) Verificar resultado:
   npx supabase migration list --project-ref lqahkqfpynypbmhtffyi

3) Verificar integridade do schema:
   npx supabase db remote commit --project-ref lqahkqfpynypbmhtffyi

──────────────────────────────────────────────────────────────
📊 VALIDAÇÃO PÓS-APLICAÇÃO
──────────────────────────────────────────────────────────────

Para cada migration aplicada, verificar:
- ✅ Migration aparece na lista remota
- ✅ Sem erros na aplicação
- ✅ Tabelas/views/functions criadas (se aplicável)
- ✅ RLS policies aplicadas (se aplicável)

Comandos de validação:
   npx supabase db remote diff --project-ref lqahkqfpynypbmhtffyi

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO
──────────────────────────────────────────────────────────────

✗ NÃO aplicar migrations sem verificar lista remota primeiro
✗ NÃO modificar conteúdo das migrations
✗ NÃO aplicar migrations em ordem errada
✗ SEMPRE verificar resultado após aplicar
✗ SEMPRE documentar qual migration foi aplicada

STOP CONDITIONS:
- Todas as migrations aplicadas OU
- Migrations não podem ser aplicadas (erro) + relatório de erro
- Verificação de integridade completa

──────────────────────────────────────────────────────────────
✅ QUALITY GATES
──────────────────────────────────────────────────────────────

1) npm run typecheck (se houver mudanças de tipos)
2) Verificar que migrations estão sincronizadas (local == remoto)
3) Verificar que não há erros de schema
4) Documentar status final

COMPLETION PROMISE: "✅ Todas as migrations aplicadas e validadas"
```

---

## 🎯 PROMPT 3: Cloud Sync - Ciclo Menstrual (P1 - ALTA PRIORIDADE)

**Contexto:** Dados do ciclo estão apenas em AsyncStorage local. Precisam sincronizar com Supabase.

**Prompt para `/ralph-wiggum:ralph-loop`:**

```
⚙️ TASK: Implementar cloud sync para ciclo menstrual (useCycleStore)
📋 TYPE: feature implementation
🎯 DONE: Sync bidirecional ciclo + dailyLogs funcionando com offline-first
🚫 SCOPE: Apenas sync (NÃO alterar lógica de negócio do ciclo)

──────────────────────────────────────────────────────────────
📍 CONTEXTO
──────────────────────────────────────────────────────────────

Store atual: src/state/cycle-store.ts (Zustand + AsyncStorage)
Tabelas Supabase: cycle_periods, cycle_daily_logs (já existem - migrations aplicadas)
Data: 30 de dezembro de 2025

Estado atual:
- ✅ Store local funciona
- ✅ Tabelas Supabase existem
- ❌ Zero sincronização

──────────────────────────────────────────────────────────────
🔍 FASE 1: ANÁLISE DO CÓDIGO ATUAL (obrigatória)
──────────────────────────────────────────────────────────────

1) Ler store atual:
   cat src/state/cycle-store.ts

2) Verificar schema Supabase:
   grep -A 20 "CREATE TABLE.*cycle" supabase/migrations/*.sql

3) Verificar se há funções de API existentes:
   find src/api -name "*cycle*" -o -name "*daily*"

4) Verificar useCycleStore usage:
   grep -rn "useCycleStore" src/ | head -20

──────────────────────────────────────────────────────────────
⚙️ FASE 2: IMPLEMENTAÇÃO (seguir padrão do projeto)
──────────────────────────────────────────────────────────────

Estrutura esperada:

1) Criar service de sync:
   src/services/cycle-sync-service.ts

   Funções necessárias:
   - syncCycleToCloud(): Promise<void>
   - syncCycleFromCloud(): Promise<void>
   - syncDailyLog(log: DailyLog): Promise<void>
   - handleConflict(local: CycleData, remote: CycleData): CycleData

2) Integrar no store:
   - Adicionar flag isLoadingSync
   - Adicionar método sync()
   - Chamar sync() após mutations críticas
   - Chamar syncFromCloud() no mount do hook

3) Estratégia offline-first:
   - Escrever sempre em local primeiro
   - Sync em background
   - Merge inteligente (last-write-wins com timestamp)

──────────────────────────────────────────────────────────────
📋 REQUIREMENTS ESPECÍFICOS
──────────────────────────────────────────────────────────────

Baseado em docs/PLATAFORMA_PREMIUM_AUDIT.md (linha 197):
- Sync bidirecional (pull + push)
- Offline-first (local como source of truth)
- Merge inteligente (evitar perda de dados)
- Error handling robusto
- Logging via logger.* (NÃO console.log)

Padrão de código:
- TypeScript strict (zero any)
- Usar logger.* de src/utils/logger.ts
- Usar Tokens.* para cores (NÃO hardcoded)
- Retorno padrão: { data, error }

──────────────────────────────────────────────────────────────
✅ QUALITY GATES (após cada fase)
──────────────────────────────────────────────────────────────

1) npm run typecheck (deve passar sem erros)
2) npm run lint (deve passar)
3) Verificar que logger.* é usado (NÃO console.log)
4) Testar sync manualmente (se possível)
5) Verificar que não há breaking changes no store interface

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO
──────────────────────────────────────────────────────────────

✗ NÃO modificar lógica de negócio do ciclo
✗ NÃO quebrar interface existente do store
✗ NÃO usar console.log (sempre logger.*)
✗ NÃO hardcodar cores (usar Tokens.*)
✗ SEMPRE seguir padrão { data, error } de retorno

STOP CONDITIONS:
- Typecheck falha (reverter e corrigir)
- Lint falha (reverter e corrigir)
- Store interface quebrada (reverter e corrigir)
- Sync implementado + testado + documentado

COMPLETION PROMISE: "✅ Cloud sync para ciclo menstrual implementado e testado"
```

---

## 🎯 PROMPT 4: Entitlement Gating Runtime (P0 - CRÍTICO)

**Contexto:** Backend sabe quem é premium, mas client não consulta nem respeita.

**Prompt para `/ralph-wiggum:ralph-loop`:**

```
⚙️ TASK: Implementar entitlement gating runtime (consultar profiles.is_premium)
📋 TYPE: feature implementation
🎯 DONE: Hook usePremiumStatus() consulta Supabase + gates aplicados em IA/comunidade
🚫 SCOPE: Apenas gating (NÃO modificar lógica de assinatura)

──────────────────────────────────────────────────────────────
📍 CONTEXTO
──────────────────────────────────────────────────────────────

Problema: Backend tem profiles.is_premium, mas client usa apenas RevenueCat local.
Requisito: Client deve consultar Supabase para verificar premium status real.

Data: 30 de dezembro de 2025

──────────────────────────────────────────────────────────────
🔍 FASE 1: ANÁLISE (obrigatória)
──────────────────────────────────────────────────────────────

1) Verificar hook atual:
   find src/hooks -name "*premium*" -o -name "*subscription*"

2) Verificar store premium:
   grep -rn "usePremiumStore\|premium" src/state/ | head -20

3) Verificar onde premium é usado:
   grep -rn "isPremium\|is_premium" src/ | head -30

4) Verificar schema Supabase:
   grep -A 10 "is_premium" supabase/migrations/*.sql

──────────────────────────────────────────────────────────────
⚙️ FASE 2: IMPLEMENTAÇÃO
──────────────────────────────────────────────────────────────

1) Criar/atualizar hook:
   src/hooks/usePremiumStatus.ts

   Deve:
   - Consultar profiles.is_premium via Supabase
   - Cachear resultado (evitar queries excessivas)
   - Invalidar cache quando necessário
   - Fallback para RevenueCat se Supabase falhar

2) Aplicar gates em:
   - src/screens/AssistantScreen.tsx (limite 5 msg/dia free)
   - src/components/community/NewPostModal.tsx (premium only?)
   - src/screens/ProfileScreen.tsx (export data premium?)

3) Criar componente PaywallGate:
   src/components/premium/PaywallGate.tsx
   - Wrapper que mostra paywall se não premium
   - Usa hook usePremiumStatus()

──────────────────────────────────────────────────────────────
📋 REQUIREMENTS (baseado em PLATAFORMA_PREMIUM_AUDIT.md linha 216)
──────────────────────────────────────────────────────────────

Gates necessários:
- IA Chat: 5 msg/dia free (hard limit)
- Comunidade: Post requer premium (verificar requisito)
- Exports: Data export requer premium (verificar requisito)

Padrão de código:
- TypeScript strict
- logger.* (NÃO console.log)
- Retorno padrão: { data, error }
- Cache inteligente (React Query ou similar)

──────────────────────────────────────────────────────────────
✅ QUALITY GATES
──────────────────────────────────────────────────────────────

1) npm run typecheck
2) npm run lint
3) Verificar que não há console.log
4) Verificar que gates funcionam (teste manual se possível)
5) Verificar que cache está implementado (não query em cada render)

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO
──────────────────────────────────────────────────────────────

✗ NÃO modificar lógica de assinatura RevenueCat
✗ NÃO remover RevenueCat (usar como fallback)
✗ NÃO fazer query Supabase em cada render (usar cache)
✗ NÃO usar console.log (sempre logger.*)
✗ SEMPRE consultar profiles.is_premium (não assumir)

STOP CONDITIONS:
- Typecheck falha
- Lint falha
- Gates implementados + testados
- Cache funcionando

COMPLETION PROMISE: "✅ Entitlement gating implementado com consulta Supabase"
```

---

## 🎯 PROMPT 5: Design System Migration - Cores Hardcoded (P1)

**Contexto:** Migração final de cores hardcoded → Tokens.\* (design system Calm FemTech).

**Prompt para `/ralph-wiggum:ralph-loop`:**

```
⚙️ TASK: Eliminar cores hardcoded restantes (migrar para Tokens.*)
📋 TYPE: refactoring
🎯 DONE: Zero cores hardcoded (#xxx, rgba(), 'white', 'black') restantes
🚫 SCOPE: Apenas cores (NÃO alterar lógica ou estrutura)

──────────────────────────────────────────────────────────────
📍 CONTEXTO
──────────────────────────────────────────────────────────────

Design System: src/theme/tokens.ts (Calm FemTech preset)
Data: 30 de dezembro de 2025

Regra do projeto (CLAUDE.md):
- PROIBIDO cores hardcoded: #xxx, rgba(), 'white', 'black'
- SINGLE SOURCE OF TRUTH: src/theme/tokens.ts
- Usar Tokens.* ou useThemeColors() hook

──────────────────────────────────────────────────────────────
🔍 FASE 1: AUDITORIA (obrigatória)
──────────────────────────────────────────────────────────────

1) Buscar cores hardcoded:
   grep -rn "#[0-9a-fA-F]\{3,6\}" src/ --include="*.tsx" --include="*.ts" | grep -v "//" | head -50
   grep -rn "rgba(" src/ --include="*.tsx" --include="*.ts" | grep -v "Tokens\|logger" | head -50
   grep -rn "'white'\|'black'" src/ --include="*.tsx" --include="*.ts" | grep -v "Tokens\|logger" | head -50

2) Criar lista de arquivos com problemas:
   - Para cada match, identificar arquivo + linha
   - Classificar por tipo (#xxx, rgba, 'white'/'black')

3) Verificar tokens disponíveis:
   cat src/theme/tokens.ts | grep -A 5 "export const Tokens"

──────────────────────────────────────────────────────────────
⚙️ FASE 2: MIGRAÇÃO (um arquivo por vez)
──────────────────────────────────────────────────────────────

Para cada arquivo identificado:

1) Ler arquivo completo:
   cat src/arquivo.tsx

2) Identificar cores hardcoded:
   - Encontrar equivalente em Tokens.*
   - Se não existir, verificar se deve ser criado (consultar design system)

3) Substituir:
   - #xxx → Tokens.brand.* ou Tokens.neutral.*
   - rgba() → Tokens.overlay.* ou Tokens.premium.glass.*
   - 'white' → Tokens.neutral[0]
   - 'black' → Tokens.neutral[900]

4) Verificar imports:
   - Adicionar import de Tokens se necessário
   - Usar useThemeColors() se for tema-aware

──────────────────────────────────────────────────────────────
✅ QUALITY GATES (após cada arquivo)
──────────────────────────────────────────────────────────────

1) npm run typecheck (deve passar)
2) npm run lint (deve passar)
3) Verificar visualmente (se possível)
4) Verificar que não há cores hardcoded restantes no arquivo:
   grep -n "#[0-9a-fA-F]\{3,6\}\|rgba(\|'white'\|'black'" src/arquivo.tsx

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO
──────────────────────────────────────────────────────────────

✗ NÃO inventar cores (sempre usar Tokens.*)
✗ NÃO modificar lógica (apenas cores)
✗ NÃO alterar estrutura de componentes
✗ SEMPRE verificar equivalente em Tokens.* antes de substituir
✗ SEMPRE testar typecheck após cada arquivo

STOP CONDITIONS:
- Typecheck falha (reverter e corrigir)
- Nenhuma cor hardcoded restante em src/
- Todos os arquivos migrados

COMPLETION PROMISE: "✅ Migração de cores completa - zero hardcoded restantes"
```

---

## 📋 USO RECOMENDADO

### Ordem de Execução:

1. **P0 - Crítico (fazer primeiro):**
   - Prompt 1: Validação OAuth
   - Prompt 2: Migrations Pendentes
   - Prompt 4: Entitlement Gating

2. **P1 - Alta Prioridade:**
   - Prompt 3: Cloud Sync Ciclo
   - Prompt 5: Design System Migration

### Como Executar:

```bash
# Exemplo: Validar OAuth
/ralph-wiggum:ralph-loop [colar Prompt 1 aqui]

# Exemplo: Aplicar migrations
/ralph-wiggum:ralph-loop [colar Prompt 2 aqui]
```

### Monitoramento:

- Cada prompt tem `COMPLETION PROMISE` que o plugin deve outputar quando completo
- Quality gates devem ser executados após cada fase
- Stop conditions devem ser respeitadas

---

**Última atualização:** 30 de dezembro de 2025
**Versão:** 1.0.0
