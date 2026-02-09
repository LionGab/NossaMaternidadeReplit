════════════════════════════════════════════════════════════
CLAUDE CODE PROMPT - COPIAR ABAIXO
════════════════════════════════════════════════════════════

⚙️ TASK: Migrar cores hardcoded para design-system.ts
📋 TYPE: refactor
🎯 DONE: 4 screens migrando de colors.ts → design-system.ts, 0 erros visuais

──────────────────────────────────────────────────────────────
📍 SETUP CHECK (faça primeiro)
──────────────────────────────────────────────────────────────

1. Leia @CLAUDE.md → stack React Native, Expo SDK 54
2. git status → branch limpo (ou switch para feature/design-migrate)
3. Source of truth: src/theme/tokens.ts (Calm FemTech preset)
4. Commands: npm run typecheck, npm run lint

⚠️ Context: Estamos em migração gradual colors.ts → design-system
Threshold atual: 290 cores hardcoded (target: 0)

──────────────────────────────────────────────────────────────
🧭 WORKFLOW: REFACTOR (Sem mudança de comportamento)
──────────────────────────────────────────────────────────────

1. TESTES PRIMEIRO (Capture comportamento)
   - TDD: Criar snapshot test para cada screen
   - Ro: npm run test --testPathPattern="PremiumGate" 2>/dev/null || true
   - Baseline: Sem testes? Documento comportamento esperado (manual)

2. PLAN MODE (Shift+Tab 2x)
   - Analisar imports atuais: grep -n "from.\*colors" src/components/PremiumGate.tsx
   - Identificar colors usadas: PRIMARY_COLOR, Colors.xxx
   - Mapear para Tokens.\*:
     - PRIMARY_COLOR → Tokens.brand.primary
     - Colors.error → Tokens.semantic[theme].error
     - Colors.surface → Tokens.brand.secondary
   - Listar telas: PremiumGate, VoiceMessagePlayer, AssistantScreen, PaywallScreen
   - Ordem: Menor impacto → maior impacto
   - Aguardar aprovação antes de editar

3. PARA CADA TELA (4 iterações):
   a) STEP 1: Remover import colors.ts
   - Adicionar: import { useThemeColors } from "@/hooks/useTheme"
   - Adicionar: import { Tokens } from "@/theme/tokens"
     b) STEP 2: Substituir no JSX
   - Buscar: color={Colors.xxx} ou color={PRIMARY_COLOR}
   - Trocar: color={useThemeColors().primary} ou color={Tokens.brand.primary}
   - Diffs < 50 linhas
     c) STEP 3: Testar
   - npm run typecheck
   - npm run lint
   - npm start (web view 30s)
   - Verificar visualmente: cores iguais?
     d) STEP 4: Se OK → commit
   - git add -A
   - git commit -m "refactor(design): migrate PremiumGate to tokens"

4. ORDEM RECOMENDADA (baixo risco primeiro):
   1. PremiumGate.tsx (simples, 3 cores)
   2. VoiceMessagePlayer.tsx (4 cores)
   3. AssistantScreen.tsx (6 cores, PRIMARY_COLOR em buttons)
   4. PaywallScreen.tsx (9 cores, colors objeto complexo)

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO PROTOCOL
──────────────────────────────────────────────────────────────

✓ Sempre grep antes de substituir (não confiar em memória)
✓ Se color NÃO EXISTIR em tokens: pergunte antes de criar
✓ TDD: Test deve passar ANTES e DEPOIS da mudança
✓ Cores semânticas devem usar useThemeColors() hook (light/dark mode)
✓ NÃO hardcode Tokens.xxx diretamente se pode ser tema (use hook)

──────────────────────────────────────────────────────────────
⛔ STOP CONDITIONS
──────────────────────────────────────────────────────────────

1. Cor não existe em Tokens → STOP + liste qual falta
2. Teste visual diferente (ex: cor mais clara/escura) → STOP + screenshot
3. 2 falhas ESLint consecutivas em mesma tela → STOP
4. arquivo > 350 LOC após migração → Sugerir split

──────────────────────────────────────────────────────────────
🧪 GATES OBRIGATÓRIOS (após cada tela)
──────────────────────────────────────────────────────────────

[ ] npm run typecheck → 0 erros
[ ] npm run lint → ESLint pass (16 warnings OK por enquanto)
[ ] npm start web → app carrega (30s)
[ ] Visual check: cores iguais ao original?
[ ] Diff < 200 linhas total

──────────────────────────────────────────────────────────────
📏 RESTRIÇÕES
──────────────────────────────────────────────────────────────

- NÃO mudar componentes (apenas imports + colors)
- NÃO remover teste se existir (refactor, não delete)
- NÃO modificar design-system.ts (usar tokens EXISTENTES)
- Preservar comentários originais de lógica
- Atomic commits (1 screen = 1 commit)

──────────────────────────────────────────────────────────────
✅ SAÍDA FINAL
──────────────────────────────────────────────────────────────

RESUMO: 4 telas migrando de colors.ts para tokens design-system
ARQUIVOS: PremiumGate.tsx, VoiceMessagePlayer.tsx, AssistantScreen.tsx, PaywallScreen.tsx
COMANDOS: npm run typecheck ✅, npm run lint ✅, visual check ✅ (4/4)
PRÓXIMO: git push → abrir PR com 4 commits atômicos

Rode: /clear (limpar contexto)

════════════════════════════════════════════════════════════
FIM DO PROMPT
════════════════════════════════════════════════════════════
