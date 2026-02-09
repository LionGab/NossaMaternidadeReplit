# 🚀 Plano de Ação Completo - GitHub PR + TestFlight

> **Status**: ✅ Pronto para execução  
> **Branch**: `cursor/erros-typescript-e-flashlist-be25`  
> **PR**: #67 (Ready for review)

---

## 📋 Resumo Executivo

Este plano cobre:

1. ✅ Melhorias avançadas de código (tokens, performance, tipagem)
2. ✅ Validação completa (Quality Gate)
3. ✅ Criação/atualização de PR no GitHub
4. ✅ Build e deploy para TestFlight

**Tempo estimado total**: 2-3 horas (código) + 1-2 horas (build/deploy)

---

## 🎯 Fase 1: Melhorias de Código

### ✅ Checklist de Implementação

- [ ] **1.1** Migrar cores hardcoded em `COLORS`/`COLORS_DARK`
- [ ] **1.2** Otimizar lista de affirmations (memo ou FlatList)
- [ ] **1.3** Memoizar QUICK_CHIPS em ChatInputArea
- [ ] **1.4** Adicionar React.memo em componentes críticos
- [ ] **1.5** Melhorar documentação JSDoc em tokens.ts

---

### 📝 1.1: Migrar Cores Hardcoded em tokens.ts

**Arquivo**: `src/theme/tokens.ts`  
**Linhas**: 1387-1435 (COLORS), 1454-1472 (COLORS_DARK)

**Mudanças específicas**:

```typescript
// ANTES (linha 1388)
background: {
  primary: "#F0FAFF",  // ❌ Hardcoded
  tertiary: "#E0F4FF", // ❌ Hardcoded
  warm: "#F0FAFF",     // ❌ Hardcoded
  card: "rgba(255, 255, 255, 0.96)", // ❌ Hardcoded
  glass: "rgba(240, 250, 255, 0.85)", // ❌ Hardcoded
}

// DEPOIS
background: {
  primary: brand.primary[50],        // ✅ Token
  tertiary: brand.primary[100],       // ✅ Token
  warm: brand.primary[50],            // ✅ Token
  card: overlay.cardHighlight,        // ✅ Token (ou criar overlay.card se necessário)
  glass: overlay.lightInvertedMedium,  // ✅ Token (ajustar opacidade se necessário)
}
```

**Mudanças em COLORS_DARK** (linha 1454):

```typescript
// ANTES
background: {
  primary: "#0A1520",  // ❌ Hardcoded
  tertiary: "#15283A", // ❌ Hardcoded
  warm: "#0F1A25",     // ❌ Hardcoded
  card: "rgba(15, 30, 45, 0.95)", // ❌ Hardcoded
  glass: "rgba(15, 30, 45, 0.72)", // ❌ Hardcoded
}

// DEPOIS
background: {
  primary: neutral[0],              // ✅ Token
  tertiary: neutral[100],            // ✅ Token
  warm: neutral[50],                 // ✅ Token
  card: overlay.darkMedium,          // ✅ Token (ou criar se necessário)
  glass: overlay.darkLight,          // ✅ Token (ajustar se necessário)
}
```

**Mudanças em mood colors** (linha 1418):

```typescript
// ANTES
mood: {
  happy: "#10B981",      // ❌ Hardcoded
  calm: "#6366F1",       // ❌ Hardcoded
  energetic: "#F59E0B",  // ❌ Hardcoded
  anxious: "#EF4444",   // ❌ Hardcoded
  sad: "#3B82F6",       // ❌ Hardcoded
  irritated: "#F97316", // ❌ Hardcoded
  sensitive: "#EC4899", // ❌ Hardcoded
  tired: "#8B5CF6",     // ❌ Hardcoded
}

// DEPOIS - Usar semantic colors ou criar mood tokens
mood: {
  happy: semantic.light.success,      // ✅ Token
  calm: brand.secondary[500],         // ✅ Token
  energetic: semantic.light.warning,  // ✅ Token
  anxious: semantic.light.error,      // ✅ Token
  sad: brand.primary[500],            // ✅ Token
  irritated: semantic.light.warning,  // ✅ Token
  sensitive: brand.accent[500],       // ✅ Token
  tired: brand.secondary[600],        // ✅ Token
}
```

**Mudanças em legacyAccent** (linha 1428):

```typescript
// ANTES
legacyAccent: {
  sage: "#86EFAC",     // ❌ Hardcoded
  peach: "#FED7AA",    // ❌ Hardcoded
  sky: "#BAE6FD",      // ❌ Hardcoded
  lavender: "#DDD6FE", // ❌ Hardcoded
  coral: "#FECACA",    // ❌ Hardcoded
}

// DEPOIS
legacyAccent: {
  sage: brand.teal[200],      // ✅ Token
  peach: brand.accent[200],   // ✅ Token
  sky: brand.primary[200],    // ✅ Token
  lavender: brand.secondary[200], // ✅ Token
  coral: brand.accent[300],   // ✅ Token
}
```

**Comando de validação**:

```bash
# Verificar se não há mais cores hardcoded
grep -E "(background|mood|legacyAccent).*:\s*[\"']#[0-9A-Fa-f]" src/theme/tokens.ts
```

---

### 📝 1.2: Otimizar Lista de Affirmations

**Arquivo**: `src/screens/AffirmationsScreenRedesign.tsx`  
**Linha**: 274

**Opção A**: Se `otherAffirmations.length <= 10` → Memoizar componente

```typescript
// Adicionar no topo do arquivo
import React, { useMemo } from "react";

// Substituir linha 274-283
{useMemo(
  () => otherAffirmations.map((affirmation, index) => (
    <AffirmationCard
      key={affirmation.id}
      affirmation={affirmation}
      isFavorite={favorites.has(affirmation.id)}
      onFavoritePress={() => handleFavoriteToggle(affirmation.id)}
      onSharePress={() => handleShare(affirmation)}
      animationDelay={600 + index * 100}
    />
  )),
  [otherAffirmations, favorites]
)}
```

**Opção B**: Se `otherAffirmations.length > 10` → Usar FlatList

```typescript
import { FlatList } from "react-native";

// Substituir View + map por FlatList
<FlatList
  data={otherAffirmations}
  renderItem={({ item: affirmation, index }) => (
    <AffirmationCard
      affirmation={affirmation}
      isFavorite={favorites.has(affirmation.id)}
      onFavoritePress={() => handleFavoriteToggle(affirmation.id)}
      onSharePress={() => handleShare(affirmation)}
      animationDelay={600 + index * 100}
    />
  )}
  keyExtractor={(item) => item.id}
  scrollEnabled={false}
  contentContainerStyle={{ paddingHorizontal: spacing.xl }}
  ListEmptyComponent={null}
/>
```

**Decisão**: Verificar `AFFIRMATIONS.length` no código e escolher opção apropriada.

---

### 📝 1.3: Memoizar QUICK_CHIPS

**Arquivo**: `src/components/chat/ChatInputArea.tsx`  
**Linha**: 25-30, 124

**Mudança**:

```typescript
// ANTES (linha 25)
export const QUICK_CHIPS = [
  "Como está meu bebê?",
  "Posso tomar café?",
  "Dicas de sono",
  "Preparar enxoval",
];

// DEPOIS - Mover para dentro do componente e memoizar
// Remover export, adicionar dentro do componente:
const QUICK_CHIPS = useMemo(
  () => ["Como está meu bebê?", "Posso tomar café?", "Dicas de sono", "Preparar enxoval"],
  []
);
```

**Import necessário**:

```typescript
import React, { useMemo } from "react";
```

---

### 📝 1.4: Adicionar React.memo em Componentes Críticos

**Arquivos a verificar**:

1. **AffirmationCard** (se existir como componente separado)

   ```typescript
   export const AffirmationCard = React.memo(function AffirmationCard({ ... }) {
     // ...
   });
   ```

2. **MessageBubble** (já tem memo? Verificar)
   - Arquivo: `src/components/chat/MessageBubble.tsx`
   - Se não tiver, adicionar `React.memo`

**Comando para verificar**:

```bash
grep -r "React.memo\|memo(" src/components/chat/MessageBubble.tsx
```

---

### 📝 1.5: Melhorar Documentação JSDoc

**Arquivo**: `src/theme/tokens.ts`  
**Linhas**: 1379-1381, 1473-1479

**Adicionar JSDoc completo**:

````typescript
/**
 * @deprecated Use `brand`, `neutral`, `semantic`, `overlay` diretamente
 *
 * Este objeto existe apenas para compatibilidade com código legado.
 *
 * **Migração recomendada:**
 * ```typescript
 * // ❌ ANTES
 * import { COLORS } from '@/theme/tokens';
 * backgroundColor: COLORS.background.primary
 *
 * // ✅ DEPOIS
 * import { brand, neutral } from '@/theme/tokens';
 * backgroundColor: brand.primary[50] // ou neutral[0] para dark mode
 * ```
 *
 * **Quando usar:**
 * - Apenas em código legado que ainda não foi migrado
 * - Durante migração gradual para tokens diretos
 *
 * **Não usar em:**
 * - Código novo
 * - Componentes que suportam dark mode (usar `useThemeColors()`)
 */
export const COLORS = {
  // ...
};
````

**Adicionar exemplos nos type exports** (linha ~1473):

````typescript
/**
 * Type exports para melhor DX com TypeScript
 *
 * @example
 * ```typescript
 * import type { NeutralShade, OverlayVariant } from '@/theme/tokens';
 *
 * function getColor(shade: NeutralShade): string {
 *   return neutral[shade];
 * }
 *
 * function getOverlay(variant: OverlayVariant): string {
 *   return overlay[variant];
 * }
 * ```
 */
export type NeutralShade = keyof typeof neutral;
export type OverlayVariant = keyof typeof overlay;
// ... outros types
````

---

## ✅ Fase 2: Validação Completa

### Comandos de Validação (executar nesta ordem)

```bash
# 1. Verificar TypeScript
npm run typecheck

# 2. Verificar ESLint
npm run lint

# 3. Quality Gate completo
npm run quality-gate
# ou (Windows)
npm run quality-gate:win

# 4. Verificar cores hardcoded (deve retornar 0 ou apenas em tokens.ts)
grep -rE "(backgroundColor|color):\s*[\"']#[0-9A-Fa-f]{3,6}" src/ --include="*.tsx" --include="*.ts" | grep -v "tokens.ts" | grep -v "colors.ts"

# 5. Verificar console.log (deve retornar apenas logger.ts)
grep -r "console\.(log|warn|error|info|debug)" src/ --include="*.tsx" --include="*.ts" | grep -v "logger.ts"

# 6. Verificar @ts-ignore/@ts-expect-error (deve ter justificativa)
grep -r "@ts-ignore\|@ts-expect-error" src/ --include="*.tsx" --include="*.ts"
```

**Critérios de sucesso**:

- ✅ TypeScript: 0 erros
- ✅ ESLint: 0 erros
- ✅ Quality Gate: ALL PASS
- ✅ Cores hardcoded: 0 (exceto em tokens.ts/colors.ts)
- ✅ console.log: 0 (exceto logger.ts)
- ✅ @ts-ignore: apenas com justificativa

---

## 🔀 Fase 3: GitHub PR

### 3.1: Commit das Mudanças

```bash
# Verificar status
git status

# Adicionar arquivos modificados
git add src/theme/tokens.ts
git add src/screens/AffirmationsScreenRedesign.tsx
git add src/components/chat/ChatInputArea.tsx
# ... outros arquivos modificados

# Commit com mensagem descritiva
git commit -m "refactor: migrar cores hardcoded e otimizar performance

- tokens.ts: migrar COLORS/COLORS_DARK para usar brand tokens
- AffirmationsScreenRedesign: memoizar lista de affirmations
- ChatInputArea: memoizar QUICK_CHIPS
- Adicionar React.memo em componentes críticos
- Melhorar documentação JSDoc em tokens.ts

Fixes: #67"
```

### 3.2: Push para Branch

```bash
# Push para branch atual
git push origin cursor/erros-typescript-e-flashlist-be25

# Ou criar nova branch se necessário
git checkout -b refactor/design-system-tokens
git push origin refactor/design-system-tokens
```

### 3.3: Criar/Atualizar PR no GitHub

**Título da PR**:

```
refactor: Migrar cores hardcoded para tokens e otimizar performance
```

**Descrição da PR** (copiar abaixo):

```markdown
## 🎯 Objetivo

Migrar todas as cores hardcoded em `COLORS`/`COLORS_DARK` para usar tokens do design system e otimizar performance de componentes críticos.

## 📝 Mudanças

### Tokens (`src/theme/tokens.ts`)

- ✅ Migrar `background.*` para usar `brand.primary` e `neutral` tokens
- ✅ Migrar `mood.*` para usar `semantic` e `brand` tokens
- ✅ Migrar `legacyAccent.*` para usar `brand` tokens equivalentes
- ✅ Melhorar documentação JSDoc com exemplos de migração

### Performance

- ✅ Memoizar lista de affirmations em `AffirmationsScreenRedesign.tsx`
- ✅ Memoizar `QUICK_CHIPS` em `ChatInputArea.tsx`
- ✅ Adicionar `React.memo` em componentes que renderizam frequentemente

### Documentação

- ✅ Adicionar JSDoc completo em exports de compatibilidade
- ✅ Adicionar exemplos de uso nos type exports

## ✅ Validação

- [x] TypeScript: 0 erros (`npm run typecheck`)
- [x] ESLint: 0 erros (`npm run lint`)
- [x] Quality Gate: ALL PASS (`npm run quality-gate`)
- [x] Cores hardcoded: 0 (exceto tokens.ts)
- [x] console.log: 0 (exceto logger.ts)

## 🔗 Relacionado

- Continuação de #67
- Relacionado a #65 (correções TypeScript)

## 📸 Screenshots

_N/A - Mudanças internas de código_

## 🧪 Testes

- [x] Quality gate passou
- [x] TypeScript compila sem erros
- [x] ESLint sem warnings
- [ ] Testes manuais em dev (fazer após merge)

## 📚 Checklist

- [x] Código segue padrões do projeto
- [x] Documentação atualizada
- [x] Sem breaking changes
- [x] Quality gate passou
- [ ] Review necessário antes de merge
```

**Comandos GitHub CLI** (se tiver `gh` instalado):

```bash
# Criar PR
gh pr create \
  --title "refactor: Migrar cores hardcoded para tokens e otimizar performance" \
  --body-file <(cat <<'EOF'
[colar descrição acima]
EOF
) \
  --base main \
  --head cursor/erros-typescript-e-flashlist-be25

# Ou atualizar PR existente (#67)
gh pr edit 67 --body-file <(cat <<'EOF'
[colar descrição atualizada]
EOF
)
```

**Ou via interface web**:

1. Acessar: https://github.com/LionGab/NossaMaternidade/pull/67
2. Clicar em "Edit" na descrição
3. Colar descrição acima
4. Salvar

---

## 🚀 Fase 4: Build e Deploy para TestFlight

### 4.1: Pré-requisitos (Verificar)

```bash
# Verificar se todos os gates anteriores passaram
npm run diagnose:production

# Verificar secrets
npm run validate-secrets

# Verificar env vars
npm run check-env
```

**Checklist de Gates**:

- [ ] G-1 (Secrets): ✅ PASS
- [ ] G0 (Diagnose): ✅ PASS
- [ ] G1 (Quality): ✅ PASS
- [ ] G2 (Auth): ✅ PASS (testar manualmente)
- [ ] G3 (RLS): ✅ PASS (`npm run verify-backend`)
- [ ] G4 (RevenueCat): ✅ PASS (configurado manualmente)
- [ ] G5 (NathIA): ✅ PASS (`npm run test:gemini`)

### 4.2: Build Production iOS

```bash
# Build para produção (auto-incrementa versão)
npm run build:prod:ios

# Ou diretamente com EAS
npx eas build --platform ios --profile production --auto-submit
```

**O que acontece**:

1. ✅ Quality gate roda automaticamente
2. ✅ Build number incrementa (ex: 1.0.0 → 1.0.1)
3. ✅ Build compila na nuvem EAS (20-40 min)
4. ✅ .ipa gerado e assinado
5. ✅ Upload automático para App Store Connect (se `--auto-submit`)

**Monitorar build**:

- Dashboard: https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade/builds
- Ou via CLI: `npx eas build:list --platform ios --limit 1`

### 4.3: Aguardar Processamento da Apple

**Tempos estimados**:

- Build EAS: 20-40 minutos
- Processamento Apple: 5-10 minutos
- **Total**: ~30-50 minutos

**Status do build**:

1. `in-progress` → Build rodando no EAS
2. `finished` → Build completo, enviado para Apple
3. `processing` → Apple processando
4. `ready-to-submit` → Pronto para TestFlight ✅

**Verificar status**:

```bash
# Via CLI
npx eas build:list --platform ios --limit 1

# Ou no dashboard
# https://expo.dev/accounts/nossa-maternidade/projects/nossamaternidade/builds
```

### 4.4: Configurar TestFlight (App Store Connect)

**Acessar**: https://appstoreconnect.apple.com/apps/6756980888

**Passos**:

1. **Navegar para TestFlight**
   - Aba "TestFlight" no menu superior

2. **Selecionar Build**
   - Escolher build mais recente com status "Ready to Submit"

3. **Preencher Test Information**

   ```
   What to Test:

   # Nossa Maternidade - Beta Interno v1.0.X

   Testando melhorias de código e performance:
   - Migração completa de cores hardcoded para tokens
   - Otimizações de performance (memoização, listas)
   - Melhorias de tipagem TypeScript
   - Correções de acessibilidade

   Funcionalidades principais:
   - Autenticação (Email, Google, Apple)
   - NathIA (assistente IA)
   - Ciclo (rastreador menstrual)
   - Comunidade (feed social)
   - Meus Cuidados
   - Premium/IAP

   Foco desta versão:
   - Performance melhorada
   - Design system consistente
   - Zero erros TypeScript
   ```

4. **Adicionar Testadores Internos**
   - Seção "Internal Testing"
   - Adicionar emails dos testadores
   - Build será disponibilizado automaticamente

5. **Salvar e Ativar**
   - Clicar em "Save" e "Start Testing"

### 4.5: Submeter para TestFlight (se não usou --auto-submit)

```bash
# Submeter build mais recente
npm run submit:prod:ios

# Ou diretamente
npx eas submit --platform ios --latest
```

**O que acontece**:

- ✅ Build é enviado para App Store Connect
- ✅ Aparece em TestFlight após processamento
- ✅ Testadores recebem notificação (se configurado)

---

## 📊 Checklist Final Completo

### Código

- [ ] Cores hardcoded migradas em `tokens.ts`
- [ ] Lista de affirmations otimizada
- [ ] QUICK_CHIPS memoizado
- [ ] React.memo adicionado onde necessário
- [ ] Documentação JSDoc melhorada
- [ ] TypeScript: 0 erros
- [ ] ESLint: 0 erros
- [ ] Quality Gate: PASS

### GitHub

- [ ] Commits feitos com mensagens descritivas
- [ ] Branch pushed para remote
- [ ] PR criada/atualizada com descrição completa
- [ ] PR revisada e aprovada
- [ ] PR mergeada para `main`

### Build

- [ ] Gates G0-G5: PASS
- [ ] Build production iniciado
- [ ] Build completado com sucesso
- [ ] Build processado pela Apple
- [ ] Build aparece em TestFlight

### TestFlight

- [ ] Test Information preenchida
- [ ] Testadores internos adicionados
- [ ] Build ativado para testes
- [ ] Notificações enviadas (se configurado)

---

## 🆘 Troubleshooting

### Build falha no EAS

```bash
# Ver logs detalhados
npx eas build:view [BUILD_ID]

# Verificar erros comuns
npm run check-env
npm run validate-secrets
npm run quality-gate
```

### Build não aparece no TestFlight

- Aguardar 5-10 min após "finished"
- Verificar se `--auto-submit` foi usado
- Verificar App Store Connect → TestFlight → Builds

### Erros de TypeScript após mudanças

```bash
# Regenerar tipos se necessário
npm run generate-types

# Verificar erros específicos
npm run typecheck 2>&1 | grep "error TS"
```

### Cores não aparecem corretamente

- Verificar se tokens foram importados corretamente
- Verificar dark mode (se aplicável)
- Verificar se `useThemeColors()` está sendo usado onde necessário

---

## 📚 Referências

- [TestFlight Gates v1](./docs/release/TESTFLIGHT_GATES_v1.md)
- [Build Quick Guide](./docs/release/BUILD_QUICK_GUIDE.md)
- [Design System](./docs/DESIGN_SYSTEM_CALM_FEMTECH.md)
- [Quality Gate Script](./scripts/quality-gate.sh)

---

## ✅ Status Final

**Última atualização**: 2026-01-20  
**Branch**: `cursor/erros-typescript-e-flashlist-be25`  
**PR**: #67  
**Build**: _aguardando_  
**TestFlight**: _aguardando build_

---

**Próximos passos após completar este plano**:

1. Monitorar feedback dos testadores
2. Corrigir bugs encontrados
3. Preparar próximo build com correções
4. Planejar release para App Store
