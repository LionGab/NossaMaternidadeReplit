# Workflows - Nossa Maternidade

> Workflows comuns para desenvolvimento com Claude Code

---

## 🔄 Workflow Padrão (Agentic)

```
Explore → Plan → Implement → Verify → Commit
```

### 1. Explore (Plan Mode)

```bash
# Entrar em Plan Mode: Shift+Tab 2x
# Claude lê arquivos e responde perguntas SEM fazer mudanças
```

**Perguntas típicas:**

- "Como funciona o sistema de auth?"
- "Onde está implementado o ciclo menstrual?"
- "Quais stores Zustand existem?"

### 2. Plan

Peça um plano detalhado antes de implementar:

```
Quero adicionar [feature X]. Quais arquivos precisam mudar?
Qual é o fluxo? Crie um plano.
```

### 3. Implement

Volte ao modo normal e implemente:

```
Implemente o plano. Escreva testes para os handlers principais.
Rode os testes e corrija falhas.
```

### 4. Verify

```bash
npm run quality-gate   # OBRIGATÓRIO
npm test -- path/to/file.test.ts  # Testes específicos
npm start              # Verificar UI no simulador
```

### 5. Commit

```bash
git add -A
git commit -m "feat: add [feature description]"
git push origin main
```

---

## 🐛 Debug Workflow

### Erro de Build

```bash
# 1. Limpar caches
npm run clean && npm install

# 2. Verificar ambiente
npm run check-env

# 3. Quality gate
npm run quality-gate

# 4. Se persistir, limpar Metro
npm start:clear
```

### Erro de TypeScript

```bash
# 1. Verificar tipos
npm run typecheck

# 2. Se schema mudou
npm run generate-types

# 3. Lint com auto-fix
npm run lint:fix
```

### Erro de Runtime (App crashando)

```bash
# 1. Ver logs do Metro
npm start

# 2. Para iOS Simulator
# Cmd+D → Debug JS Remotely

# 3. Para Android Emulator
# adb logcat *:E
```

**Usar subagent:**

```
use subagent mobile-debugger to investigate [error message]
```

---

## 🚀 Deploy Workflow

### TestFlight (iOS)

```bash
# 1. Quality gate
npm run quality-gate

# 2. Build production
npm run build:prod:ios        # ou :win no Windows

# 3. Submit para App Store Connect
npm run submit:prod:ios

# 4. Ir ao App Store Connect e liberar para TestFlight
```

### Play Store (Android)

```bash
# 1. Quality gate
npm run quality-gate

# 2. Build production
npm run build:prod:android

# 3. Submit para Google Play Console
npm run submit:prod:android
```

**Usar subagent:**

```
use subagent mobile-deployer to build and submit iOS production
```

---

## 🗄️ Database Workflow

### Criar Migration

```bash
# 1. Criar migration vazia
npx supabase migration new nome_da_migration

# 2. Editar arquivo em supabase/migrations/

# 3. Aplicar localmente (se tiver Supabase local)
npx supabase db reset

# 4. Push para produção
npx supabase db push
```

### Atualizar Types

```bash
# Após qualquer mudança no schema
npm run generate-types

# Verifica se tipos estão corretos
npm run typecheck
```

### Verificar RLS

```bash
npm run verify-backend
```

**Usar subagent:**

```
use subagent database to create migration for [feature]
```

---

## 🤖 AI/NathIA Workflow

### Atualizar Prompt

1. Editar `src/ai/nathiaPrompt.ts`
2. Testar localmente:

```bash
npm run test:gemini
```

3. Deploy edge function:

```bash
npx supabase functions deploy ai
```

### Testar Chat

```bash
# Via curl
curl -X POST https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/ai \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Olá"}]}'
```

**Usar subagent:**

```
use subagent nathia-expert to review prompt changes
```

---

## 🎨 Component Workflow

### Criar Novo Componente

```bash
# Estrutura esperada
src/components/
├── ui/              # Átomos (Button, Input, Card)
├── shared/          # Compartilhados entre screens
└── [Feature]/       # Específicos de feature
```

**Template:**

```typescript
import { View, Text, Pressable } from "react-native";
import { cn } from "@/utils/cn";
import { Tokens } from "@/theme/tokens";

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  return (
    <Pressable
      onPress={onPress}
      className="p-4 rounded-lg bg-primary-50"
      accessibilityLabel={title}
      accessibilityRole="button"
      style={{ minHeight: 44 }} // Tap target
    >
      <Text className="text-primary-900">{title}</Text>
    </Pressable>
  );
}
```

**Usar subagent:**

```
use subagent component-builder to create [component name] following our patterns
```

---

## 🧪 Test Workflow

### Rodar Testes

```bash
# Todos os testes
npm test

# Watch mode (recomendado durante dev)
npm test -- --watch

# Arquivo específico (mais rápido)
npm test -- path/to/file.test.ts

# Coverage
npm run test:coverage
```

### Estrutura de Teste

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, fireEvent } from "@testing-library/react-native";
import { MyComponent } from "../MyComponent";

describe("MyComponent", () => {
  it("renders title", () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText("Test")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <MyComponent title="Test" onPress={onPress} />
    );
    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## ♿ Accessibility Workflow

### Auditoria

```bash
# Rodar audit (se configurado)
npm run a11y:audit
```

**Usar subagent:**

```
use subagent accessibility-auditor to review [component/screen]
```

### Checklist Rápido

- [ ] `accessibilityLabel` em todos elementos interativos
- [ ] `accessibilityRole` apropriado (button, link, image, etc.)
- [ ] Tap targets >= 44pt
- [ ] Contraste >= 4.5:1 (texto normal) ou >= 3:1 (texto grande)
- [ ] Imagens têm texto alternativo

---

## 📱 Premium/IAP Workflow

### Testar Compras

1. **iOS Sandbox**: Usar conta sandbox no App Store Connect
2. **Android**: Usar license testers no Google Play Console

### Verificar Status

```typescript
import { usePremiumStore } from "@/state/premium-store";

const isPremium = usePremiumStore((s) => s.isPremium);
const checkPremium = usePremiumStore((s) => s.checkPremiumStatus);

// Forçar refresh
await checkPremium();
```

### Debug RevenueCat

```typescript
import Purchases from "react-native-purchases";

// Ver ofertas disponíveis
const offerings = await Purchases.getOfferings();
console.log(offerings);

// Ver status atual
const customerInfo = await Purchases.getCustomerInfo();
console.log(customerInfo.entitlements);
```

---

## 🔐 Security Workflow

### Checklist de Segurança

- [ ] Nunca commitar `.env` ou secrets
- [ ] Usar `EXPO_PUBLIC_` apenas para vars públicas
- [ ] RLS habilitado em todas tabelas
- [ ] Validar inputs no backend
- [ ] Sanitizar outputs (XSS)

### Validar Ambiente

```bash
npm run check-env
```

### Scan de Secrets

```bash
# Antes de commit
git diff --cached | grep -E "(api_key|secret|password|token)" || echo "OK"
```

---

## 🔄 Context Management (Claude Code)

### Quando usar `/clear`

- Entre tarefas não relacionadas
- Após 2+ correções no mesmo problema
- Contexto poluído com tentativas falhas

### Quando usar `/compact`

- Contexto grande mas ainda relevante
- Quer manter decisões importantes

### Quando usar Subagents

- Investigação que lê muitos arquivos
- Tarefas isoladas (review, audit)
- Manter contexto principal limpo

```
use subagent [agent-name] to [task description]
```

### Agents Disponíveis

| Agent                   | Uso                 |
| ----------------------- | ------------------- |
| `mobile-deployer`       | Builds e deploy     |
| `mobile-debugger`       | Debug iOS/Android   |
| `type-checker`          | Erros TypeScript    |
| `code-reviewer`         | Review de código    |
| `performance`           | Otimização          |
| `accessibility-auditor` | WCAG audit          |
| `component-builder`     | Criar componentes   |
| `database`              | Supabase/migrations |
| `nathia-expert`         | AI/NathIA           |

---

_Última atualização: 2026-01-24_
