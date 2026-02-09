# Sistema de Grid 8pt

**Status:** Implementado (Fase 2)
**Versão:** 1.0.0
**Data:** Dezembro 2024

---

## 📐 O que é Grid 8pt?

Sistema de espaçamento onde **todos os valores são múltiplos de 8px** (ou 4px para casos especiais). Isso garante:

- ✅ Consistência visual em todo o app
- ✅ Alinhamento perfeito entre elementos
- ✅ Escalabilidade para diferentes tamanhos de tela
- ✅ Facilita handoff design → desenvolvimento

---

## 🎯 Valores do Sistema

### Escala Base (design-system.ts)

```typescript
SPACING = {
  xs: 4, // 0.5 × 8pt - Micro espaçamentos
  sm: 8, // 1 × 8pt   - Tight spacing
  md: 12, // 1.5 × 8pt - Normal spacing
  lg: 16, // 2 × 8pt   - Relaxed spacing
  xl: 20, // 2.5 × 8pt - Loose spacing
  "2xl": 24, // 3 × 8pt   - Extra loose
  "3xl": 32, // 4 × 8pt   - Section spacing
  "4xl": 40, // 5 × 8pt   - Large sections
  "5xl": 48, // 6 × 8pt   - Extra large
  "6xl": 64, // 8 × 8pt   - Hero spacing
  "7xl": 80, // 10 × 8pt  - Huge spacing
  "8xl": 96, // 12 × 8pt  - Maximum spacing
};
```

---

## 🛠️ Como Usar

### Opção 1: Hook useSpacing (Recomendado)

```tsx
import { useSpacing } from "@/hooks/useSpacing";

function MyComponent() {
  const s = useSpacing();

  return (
    <View
      style={{
        padding: s.lg, // 16px
        marginBottom: s["2xl"], // 24px
        gap: s.md, // 12px
      }}
    >
      <Text>Content</Text>
    </View>
  );
}
```

### Opção 2: Import Direto

```tsx
import { SPACING } from "@/theme/design-system";

const styles = {
  container: {
    paddingHorizontal: SPACING["2xl"], // 24px
    paddingVertical: SPACING.lg, // 16px
  },
};
```

### Opção 3: Padrões Pré-definidos

```tsx
import { SPACING_PATTERNS } from '@/hooks/useSpacing';

<Card padding={SPACING_PATTERNS.cardPadding.medium}>
  {/* 16px padding */}
</Card>

<ScrollView contentContainerStyle={{
  paddingHorizontal: SPACING_PATTERNS.screenPadding.horizontal
}}>
  {/* 24px horizontal padding */}
</ScrollView>
```

---

## 📋 Guia de Uso por Contexto

### Telas (Screen Padding)

```tsx
// Horizontal padding padrão
paddingHorizontal: 24px (2xl)

// Vertical spacing entre sections
marginBottom: 16px (lg) ou 24px (2xl)
```

### Cards

```tsx
// Small cards (list items)
padding: 12px (md)

// Medium cards (features)
padding: 16px (lg)

// Large cards (hero sections)
padding: 24px (2xl)
```

### Botões

```tsx
// Small button
paddingVertical: 8px (sm)
paddingHorizontal: 12px (md)

// Medium button
paddingVertical: 12px (md)
paddingHorizontal: 16px (lg)

// Large button
paddingVertical: 16px (lg)
paddingHorizontal: 24px (2xl)
```

### Stack Layout (Vertical)

```tsx
// Tight spacing (dentro de cards)
gap: 8px (sm)

// Normal spacing (lista de itens)
gap: 12px (md)

// Relaxed spacing (seções)
gap: 16px (lg) ou 24px (2xl)
```

### Inline Layout (Horizontal)

```tsx
// Icon + Text
gap: 4px (xs) ou 8px (sm)

// Botões lado a lado
gap: 8px (sm) ou 12px (md)
```

---

## ✅ Exemplos Práticos

### Tela com Grid 8pt

```tsx
import { useSpacing } from "@/hooks/useSpacing";

export function ExampleScreen() {
  const s = useSpacing();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + s.lg,
        paddingBottom: s["6xl"],
        paddingHorizontal: s["2xl"],
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: s["3xl"] }}>
        <Text variant="h1">Título</Text>
      </View>

      {/* Card Grid */}
      <View style={{ gap: s.lg }}>
        <Card padding={s.lg}>
          <Text>Card 1</Text>
        </Card>
        <Card padding={s.lg}>
          <Text>Card 2</Text>
        </Card>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          marginTop: s["3xl"],
          gap: s.md,
        }}
      >
        <Button>Primary Action</Button>
        <Button variant="outline">Secondary</Button>
      </View>
    </ScrollView>
  );
}
```

### Card com Grid 8pt

```tsx
<Card padding={s.lg}>
  {/* Icon + Title */}
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: s.sm,
      marginBottom: s.md,
    }}
  >
    <Icon name="heart" size={24} />
    <Text variant="h3">Título</Text>
  </View>

  {/* Description */}
  <Text style={{ marginBottom: s.lg }}>Descrição do card</Text>

  {/* Actions */}
  <View
    style={{
      flexDirection: "row",
      gap: s.sm,
    }}
  >
    <Button size="sm">Action 1</Button>
    <Button size="sm" variant="outline">
      Action 2
    </Button>
  </View>
</Card>
```

---

## 🚫 O que EVITAR

### ❌ Valores Arbitrários

```tsx
// NÃO FAZER
padding: 15px  // Não é múltiplo de 8
margin: 18px   // Não é múltiplo de 8
gap: 10px      // Não é múltiplo de 8

// FAZER
padding: 16px  // 2 × 8pt (lg)
margin: 16px   // 2 × 8pt (lg)
gap: 12px      // 1.5 × 8pt (md)
```

### ❌ Hardcoded Numbers

```tsx
// NÃO FAZER
<View style={{ padding: 24 }}>

// FAZER
const s = useSpacing();
<View style={{ padding: s["2xl"] }}>
```

### ❌ Misturar Sistemas

```tsx
// NÃO FAZER
paddingTop: 20px     // Custom
paddingBottom: s.lg  // Grid 8pt
// Inconsistente!

// FAZER
paddingVertical: s.xl  // 20px (2.5 × 8pt)
// Consistente com sistema
```

---

## 🎨 Integração com Tailwind

O sistema SPACING já está configurado no `tailwind.config.js`:

```tsx
// Usar classes Tailwind com grid 8pt
<View className="p-4">   {/* 16px = SPACING.lg */}
<View className="px-6">  {/* 24px = SPACING["2xl"] */}
<View className="gap-3"> {/* 12px = SPACING.md */}
```

**Mapeamento Tailwind → Grid 8pt:**

- `p-1` = 4px = xs
- `p-2` = 8px = sm
- `p-3` = 12px = md
- `p-4` = 16px = lg
- `p-5` = 20px = xl
- `p-6` = 24px = 2xl
- `p-8` = 32px = 3xl

---

## 📊 Status de Implementação

### ✅ Implementado

- [x] Sistema SPACING no design-system.ts
- [x] Hook useSpacing com helpers
- [x] Padrões pré-definidos (SPACING_PATTERNS)
- [x] Documentação completa
- [x] Integração Tailwind

### 📍 Aplicação Gradual (Ongoing)

- Novas telas devem usar o sistema
- Telas existentes: migração gradual
- Componentes da biblioteca já usam grid 8pt

### 🎯 Próximos Passos

1. Migrar telas principais gradualmente
2. Adicionar linter rule para detectar valores fora do grid
3. Criar Storybook com exemplos visuais

---

## 🔍 Troubleshooting

### "Meu layout quebrou ao aplicar grid 8pt"

Use valores próximos:

- Se tinha 15px → use 16px (lg)
- Se tinha 18px → use 20px (xl) ou 16px (lg)
- Se tinha 10px → use 12px (md) ou 8px (sm)

### "Preciso de um valor específico"

Use multiplicador:

```tsx
const s = useSpacing();
s.get("lg", 1.5); // 16 × 1.5 = 24px
```

Ou crie valor responsivo:

```tsx
s.responsive("md", screenWidth);
```

---

## 📚 Referências

- [Material Design 8dp Grid](https://material.io/design/layout/spacing-methods.html)
- [Apple HIG Spacing](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Design System SPACING](../src/theme/design-system.ts)
- [Hook useSpacing](../src/hooks/useSpacing.ts)

---

**Última atualização:** Dezembro 2024
**Autor:** Lion (Claude Code)
**Versão:** 1.0.0
