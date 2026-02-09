════════════════════════════════════════════════════════════
CLAUDE CODE PROMPT - COPIAR ABAIXO
════════════════════════════════════════════════════════════

⚙️ TASK: Substituir console.\* por logger em 3 telas
📋 TYPE: bugfix (production quality gate)
🎯 DONE: 0 console.log em produção, quality-gate passa 100%

──────────────────────────────────────────────────────────────
📍 SETUP CHECK
──────────────────────────────────────────────────────────────

1. Leia @CLAUDE.md → logging system: src/utils/logger.ts
2. git status → branch limpo
3. Localize console.\* ocorrências:
   grep -rn "console\." src/ | grep -v "logger.ts\|Toast.tsx\|useToast.ts"
4. Arquivos com console.\*: HomeScreen.tsx (1), purchases.ts (13), reset-onboarding.ts (2)

──────────────────────────────────────────────────────────────
🧭 WORKFLOW: BUGFIX (Reproduzir → Root Cause → Fix Mínimo → Test)
──────────────────────────────────────────────────────────────

1. REPRODUÇÃO
   - Executar quality-gate: npm run quality-gate
   - Deve falhar com "console.log found"
   - Identifique linhas exatas com: grep -n "console\." src/[arquivo]

2. ROOT CAUSE
   - Motivo: ESLint rule no .husky/pre-commit detecta console.\* (exceto warn/error)
   - Impacto: Quality gate bloqueia build/PR
   - Padrão correto: logger.info/warn/error (veja src/utils/logger.ts linhas 1-50)

3. FIX MÍNIMO (Padrão de Substituição)
   ──────────────────────────────────────────────────────────
   ANTES:
   console.log("User logged in:", user);
   console.error("Auth failed:", error);

   DEPOIS:
   import { logger } from "@/utils/logger";
   logger.info("User logged in", "Auth", { user });
   logger.error("Auth failed", "Auth", error as Error);
   ──────────────────────────────────────────────────────────

   REGRA:
   - console.log → logger.info(msg, context, metadata?)
   - console.error → logger.error(msg, context, error)
   - console.warn → logger.warn(msg, context, metadata?)
   - Contexto = nome do arquivo ou função (string)
   - Metadata = dados estruturados (object opcional)

4. PARA CADA ARQUIVO:
   a) TDD: Criar regex test
   Buscar: sed -n '/console\./p' src/[arquivo]
   Confirmar: Match exato de linhas
   b) Implementar fix
   - Adicionar import se falta
   - Substituir console._ por logger._
   - Ajustar parâmetros (msg, context, metadata)
     c) Gates:
     [ ] npm run typecheck
     [ ] npm run lint
     [ ] grep "console\." src/[arquivo] → 0 matches
     d) Se falhar: reverte passo, debugga

5. ARQUIVOS (ORDEM):
   1. HomeScreen.tsx:117 (1 ocorrência, simples)
   2. reset-onboarding.ts (2 ocorrências, utils)
   3. purchases.ts (13 ocorrências, serviço - mais complexo)

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO PROTOCOL
──────────────────────────────────────────────────────────────

✓ Grep ANTES de substituir (confirmae linhas exatas)
✓ Import logger.ts SEMPRE (use path alias: @/utils/logger)
✓ Contexto = meaningful string (não vazio, não "App")
✓ NÃO substituir console em files excluídas:

- src/utils/logger.ts (source of truth)
- src/components/ui/Toast.tsx (UI feedback)
- src/hooks/useToast.ts (hook auxiliar)
  ✓ Metadata = estruturado (object com keys), não stringificado
  ✓ Error sempre: (error as Error) para type safety

──────────────────────────────────────────────────────────────
⛔ STOP CONDITIONS
──────────────────────────────────────────────────────────────

1. Import logger falha (arquivo não encontrado) → STOP
2. 2 testes ESLint falhos consecutivos → STOP + debugga
3. Arquivo > 250 LOC após mudança → Sugerir split
4. Contexto (2º param) vazio → STOP + pergunte o nome

──────────────────────────────────────────────────────────────
🧪 GATES OBRIGATÓRIOS
──────────────────────────────────────────────────────────────

[ ] npm run typecheck → 0 erros
[ ] npm run lint → ESLint pass
[ ] grep "console\." src/ → 0 matches (exceto excluídos)
[ ] npm run quality-gate → PASS (não bloqueia console.log)

──────────────────────────────────────────────────────────────
📏 RESTRIÇÕES
──────────────────────────────────────────────────────────────

- Atomic: 1 arquivo = 1 commit
- Não mudar lógica, apenas substituição
- Manter mensagens original (ex: "Auth failed" → permanece)
- Preservar formatação original quando possível
- NÃO remover logs (apenas converter formato)

──────────────────────────────────────────────────────────────
📋 TEMPLATE PRONTO (Copiar-Colar)
──────────────────────────────────────────────────────────────

Em cada arquivo, adicione no topo:

import { logger } from "@/utils/logger";

E substitua cada ocorrência:

// ❌ ANTES
console.log("message");

// ✅ DEPOIS
logger.info("message", "FileName");

// ❌ ANTES
console.error("message", error);

// ✅ DEPOIS
logger.error("message", "FileName", error as Error);

──────────────────────────────────────────────────────────────
✅ SAÍDA FINAL
──────────────────────────────────────────────────────────────

RESUMO: console.\* removido de 3 arquivos, quality-gate verde
ARQUIVOS: HomeScreen.tsx, reset-onboarding.ts, purchases.ts
COMANDOS:
grep "console\." src/ → 0 prod matches
npm run quality-gate → PASS
npm run typecheck → 0 erros
COMMITS:

- refactor(logger): HomeScreen.tsx (1 commit)
- refactor(logger): reset-onboarding.ts (1 commit)
- refactor(logger): purchases.ts (1 commit)
  PRÓXIMO: git push → PR

Rode: /clear

════════════════════════════════════════════════════════════
FIM DO PROMPT
════════════════════════════════════════════════════════════
