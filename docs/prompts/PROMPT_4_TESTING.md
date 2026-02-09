════════════════════════════════════════════════════════════
CLAUDE CODE PROMPT - COPIAR ABAIXO
════════════════════════════════════════════════════════════

⚙️ TASK: Criar 5 unit tests em Jest (hooks + services)
📋 TYPE: feature (quality improvement)
🎯 DONE: 5 tests escritos + passando, coverage > 50% em 3 files

──────────────────────────────────────────────────────────────
📍 SETUP CHECK
──────────────────────────────────────────────────────────────

1. Leia @CLAUDE.md → testing patterns
2. git status → branch limpo
3. Jest configurado? npm test --version
4. Arquivos alvo:
   - src/hooks/useTheme.ts (design system hook)
   - src/utils/error-handler.ts (error helper)
   - src/state/premium-store.ts (Zustand store)

──────────────────────────────────────────────────────────────
🧭 WORKFLOW: FEATURE - TDD (Test First → Implementation → Verify)
──────────────────────────────────────────────────────────────

1. PLAN MODE (Shift+Tab 2x)
   - Objetivos:
     1. Testar useTheme hook (2 tests)
     - Test 1: retorna tokens Calm FemTech
     - Test 2: muda tema light/dark
     2. Testar AppError class (2 tests)
     - Test 3: cria erro com contexto
     - Test 4: serializa para JSON
     3. Testar premium-store (1 test)
     - Test 5: checkPremiumStatus retorna boolean

   - Tempo estimado: 2h (TDD + gates + debug)
   - Estrutura: **tests**/unit/[hook/service].test.ts
   - Framework: Jest + React Testing Library (setup já existe)

2. STEP 1: Criar arquivo test (useTheme) (15 min)
   a) TDD: Escrever testes que FALHAM
   - Arquivo: src/hooks/**tests**/useTheme.test.ts
   - Teste 1: tokens.brand.primary é string color
   - Teste 2: tema toggle liga/desliga (tema state)

   b) Implementar código para passar
   - Editar: src/hooks/useTheme.ts
   - Garantir: retorna { tokens, theme, setTheme }

   c) Gates: npm test --testPathPattern="useTheme"

3. STEP 2: Criar arquivo test (AppError) (15 min)
   a) TDD: Escrever testes que FALHAM
   - Arquivo: src/utils/**tests**/error-handler.test.ts
   - Teste 3: AppError preserva stack trace
   - Teste 4: toJSON() serializa contexto

   b) Implementar código para passar
   - Editar: src/utils/error-handler.ts
   - Garantir: AppError.toJSON() retorna { code, message, context }

   c) Gates: npm test --testPathPattern="error-handler"

4. STEP 3: Criar arquivo test (premium-store) (20 min)
   a) TDD: Escrever teste que FALHA
   - Arquivo: src/state/**tests**/premium-store.test.ts
   - Teste 5: checkPremiumStatus() detecta isPremium

   b) Implementar código para passar
   - Editar: src/state/premium-store.ts
   - Garantir: checkPremiumStatus() retorna boolean

   c) Gates: npm test --testPathPattern="premium-store"

5. VERIFICAÇÃO FINAL
   - npm test (todos 5 testes PASS)
   - npm test --coverage (>50% para esses 3 files)
   - npm run typecheck (0 erros)
   - npm run lint (OK)

──────────────────────────────────────────────────────────────
🛡️ ANTI-ALUCINAÇÃO PROTOCOL
──────────────────────────────────────────────────────────────

✓ TDD: Teste FALHA primeiro (red), depois implementa (green)
✓ Setup/teardown clean (não leave state entre testes)
✓ Mock Zustand stores (não usar real AsyncStorage)
✓ Mock hooks: renderHook(useTheme) do @testing-library/react-native
✓ Assertions claras: expect(result).toBe(expected)

──────────────────────────────────────────────────────────────
⛔ STOP CONDITIONS
──────────────────────────────────────────────────────────────

1. npm test falha com setup error → STOP, debugga Jest config
2. 2 testes não passam após implementação → STOP, reverte e redesenha
3. Coverage < 40% → Adicione mais assertions ou cases

──────────────────────────────────────────────────────────────
🧪 GATES OBRIGATÓRIOS
──────────────────────────────────────────────────────────────

[ ] npm test → 5/5 PASS
[ ] npm test --coverage → >40% coverage nos 3 files
[ ] npm run typecheck
[ ] npm run lint

──────────────────────────────────────────────────────────────
📏 RESTRIÇÕES
──────────────────────────────────────────────────────────────

- Não modificar src/\* (exceto se test exigir)
- Testes isolados (não dependem uns dos outros)
- Mocks quando necessário (Redux, AsyncStorage, etc)
- Names descritivos: "should return tokens when theme is light"

──────────────────────────────────────────────────────────────
📋 TEMPLATE JEST (CopyPaste)
──────────────────────────────────────────────────────────────

// src/hooks/**tests**/useTheme.test.ts

import { renderHook } from "@testing-library/react-native";
import { useTheme } from "../useTheme";

describe("useTheme", () => {
it("should return Calm FemTech tokens", () => {
const { result } = renderHook(() => useTheme());
expect(result.current.tokens.brand.primary).toBeDefined();
expect(typeof result.current.tokens.brand.primary).toBe("string");
});

it("should toggle theme between light and dark", () => {
const { result, rerender } = renderHook(() => useTheme());
const initialTheme = result.current.theme;

    // Simular toggle
    act(() => {
      result.current.setTheme(initialTheme === "light" ? "dark" : "light");
    });

    rerender();
    expect(result.current.theme).not.toBe(initialTheme);

});
});

──────────────────────────────────────────────────────────────
📋 ESTRUTURA DE PASTAS
──────────────────────────────────────────────────────────────

Criar:
src/hooks/**tests**/useTheme.test.ts
src/utils/**tests**/error-handler.test.ts
src/state/**tests**/premium-store.test.ts

Padrão: [arquivo].test.ts ou [arquivo].spec.ts
Jest auto-detecta esses arquivos

──────────────────────────────────────────────────────────────
✅ SAÍDA FINAL
──────────────────────────────────────────────────────────────

RESUMO: 5 testes implementados, todos passando
ARQUIVOS: 3 test files criados (useTheme, error-handler, premium-store)
COMANDOS:
npm test → 5 PASS ✅
npm test --coverage → [X]% coverage
npm run typecheck ✅
npm run lint ✅
COMMITS: test(unit): add 5 unit tests (hooks + services)
PRÓXIMO: git push → PR → adicionar 10+ tests próximas semanas

Rode: /clear

════════════════════════════════════════════════════════════
FIM DO PROMPT
════════════════════════════════════════════════════════════
