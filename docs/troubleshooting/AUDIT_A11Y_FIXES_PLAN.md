# Plano de Correções de Acessibilidade - Nossa Maternidade

> **Data:** 29/12/2025
> **Versão da Auditoria:** 1.1
> **Última Atualização:** 29/12/2025 23:54
> **Total de Issues:** 407 (de 477 originais)

## ✅ PROGRESSO ALCANÇADO

| Métrica     | Antes | Depois | Melhoria             |
| ----------- | ----- | ------ | -------------------- |
| **BLOCKER** | 125   | 57     | **-68 issues (54%)** |
| **Labels**  | 36%   | 51%    | **+15%**             |
| **Imagens** | 11%   | 64%    | **+53%**             |
| **Inputs**  | 31%   | 54%    | **+23%**             |

### Arquivos Corrigidos ✅

- `screens/LoginScreenRedesign.tsx` - 8 issues
- `screens/NotificationPreferencesScreen.tsx` - 6 issues
- `screens/PaywallScreenRedesign.tsx` - 4 issues
- `screens/MundoDaNathScreen.tsx` - 5 issues (parcial)
- `screens/MyCareScreen.tsx` - imagens e pressables
- `screens/NewPostScreen.tsx` - 4 issues
- `screens/PostDetailScreen.tsx` - 3 issues
- `screens/RestSoundsScreen.tsx` - close, tabs, sounds
- `screens/auth/AuthLandingScreen.tsx` - imagens e links
- `screens/onboarding/*` - todas as imagens
- `components/login/SocialButton.tsx` - a11y completo
- `components/paywall/CTAButton.tsx` - a11y completo
- `components/ui/Input.tsx` - TextInput e trailing icon
- `components/ui/Card.tsx` - Pressable wrappers
- `components/AnimatedSplashScreen.tsx` - logo
- `navigation/MainTabNavigator.tsx` - NathIA avatar

---

## Sumário Executivo Atual

| Severidade      | Quantidade | % do Total |
| --------------- | ---------- | ---------- |
| 🔴 BLOCKER (P0) | 57         | 14%        |
| 🟠 MAJOR (P1)   | 38         | 9%         |
| 🟡 MINOR (P2)   | 312        | 77%        |

### Métricas de Cobertura Atual

| Métrica               | Atual | Meta | Gap     |
| --------------------- | ----- | ---- | ------- |
| Interativos com Label | 51%   | 80%  | -29%    |
| Interativos com Role  | 87%   | 70%  | ✅ +17% |
| Imagens Tratadas      | 64%   | 90%  | -26%    |
| Inputs com Label      | 54%   | 95%  | -41%    |

---

## Fase 1: BLOCKERs Críticos (P0)

**Objetivo:** Resolver todos os 125 BLOCKERs
**Critério WCAG:** Conformidade Nível A/AA

### 1.1 P0-NAME-001: Elementos Interativos sem Nome (92 issues)

**Problema:** Elementos com `onPress` sem `accessibilityLabel` ou `<Text>` descendente.

#### Arquivos Prioritários (Top 10 por quantidade de issues)

| Arquivo                                     | Issues | Componentes Afetados                           |
| ------------------------------------------- | ------ | ---------------------------------------------- |
| `screens/NotificationPreferencesScreen.tsx` | 6      | Pressable, Switch                              |
| `screens/LoginScreenRedesign.tsx`           | 8      | Pressable, SocialButton, CTAButton, EmailInput |
| `screens/MundoDaNathScreen.tsx`             | 5      | Pressable                                      |
| `screens/NewPostScreen.tsx`                 | 4      | Pressable, Switch                              |
| `screens/PaywallScreenRedesign.tsx`         | 4      | Pressable, CTAButton                           |
| `screens/RestSoundsScreen.tsx`              | 3      | Pressable                                      |
| `screens/PostDetailScreen.tsx`              | 3      | Pressable                                      |
| `components/community/PostCard.tsx`         | 4      | Pressable                                      |
| `components/ui/IconButton.tsx`              | 2      | Pressable                                      |
| `screens/CommunityScreen.tsx`               | 5      | Pressable                                      |

#### Padrão de Correção

```tsx
// ❌ ANTES
<Pressable onPress={handleClose} style={styles.closeBtn}>
  <Ionicons name="close" size={24} />
</Pressable>

// ✅ DEPOIS
<Pressable
  onPress={handleClose}
  style={styles.closeBtn}
  accessibilityLabel="Fechar"
  accessibilityRole="button"
>
  <Ionicons name="close" size={24} />
</Pressable>
```

#### Componentes Custom que Precisam de Props A11y

| Componente     | Arquivo                            | Ação                                                |
| -------------- | ---------------------------------- | --------------------------------------------------- |
| `CTAButton`    | `components/ui/CTAButton.tsx`      | Adicionar `accessibilityLabel={label}` internamente |
| `SocialButton` | `components/auth/SocialButton.tsx` | Adicionar label baseado no `type`                   |
| `EmailInput`   | `components/auth/EmailInput.tsx`   | Adicionar `accessibilityLabel="Email"`              |
| `IconButton`   | `components/ui/IconButton.tsx`     | Exigir `accessibilityLabel` como prop required      |

#### Script de Auto-fix Sugerido

```bash
# Padrão regex para encontrar Pressables sem a11y
grep -rn "Pressable.*onPress" --include="*.tsx" src/ | grep -v "accessibilityLabel"
```

---

### 1.2 P0-IMAGE-001: Imagens sem Alternativa (32 issues)

**Problema:** `<Image>` sem `accessibilityLabel` e não marcada como decorativa.

#### Imagens que Precisam de Label (Informativas)

| Arquivo                           | Linha | Contexto          | Label Sugerido                |
| --------------------------------- | ----- | ----------------- | ----------------------------- |
| `screens/MyCareScreen.tsx`        | 265   | Avatar Nathalia   | "Foto de Nathalia Valente"    |
| `screens/MyCareScreen.tsx`        | 652   | Logo Mães Valente | "Logo Mães Valente"           |
| `screens/MundoDaNathScreen.tsx`   | 122   | Avatar Nathalia   | "Foto de Nathalia"            |
| `screens/MundoDaNathScreen.tsx`   | 275   | Post media        | Descrição dinâmica            |
| `screens/MundoDaNathScreen.tsx`   | 394   | Avatar grande     | "Nathalia Valente"            |
| `screens/LoginScreenRedesign.tsx` | 320   | Logo app          | "Logo Nossa Maternidade"      |
| `screens/NewPostScreen.tsx`       | 126   | Media preview     | "Preview do conteúdo anexado" |

#### Imagens Decorativas (Marcar com `accessible={false}`)

| Arquivo                 | Linha | Contexto                            |
| ----------------------- | ----- | ----------------------------------- |
| Backgrounds             | -     | Todos gradientes/padrões            |
| Divisores               | -     | Linhas decorativas                  |
| Ícones dentro de botões | -     | Já cobertos pelo label do botão pai |

#### Padrão de Correção

```tsx
// Imagem informativa
<Image
  source={{ uri: avatarUrl }}
  accessibilityLabel="Foto de perfil de Nathalia Valente"
  style={styles.avatar}
/>

// Imagem decorativa
<Image
  source={require('./pattern.png')}
  accessible={false}
  style={styles.background}
/>
```

---

### 1.3 P0-INPUT-001: Inputs sem Label (9 issues)

**Problema:** `<TextInput>` sem `accessibilityLabel`.

#### Inputs Identificados

| Arquivo                          | Linha | Placeholder                            | Label Necessário                |
| -------------------------------- | ----- | -------------------------------------- | ------------------------------- |
| `screens/AssistantScreen.tsx`    | -     | "Digite sua mensagem..."               | "Campo de mensagem para NathIA" |
| `screens/NewPostScreen.tsx`      | -     | "O que você gostaria de compartilhar?" | "Conteúdo do post"              |
| `screens/PostDetailScreen.tsx`   | -     | "Escreva um comentário..."             | "Campo de comentário"           |
| `components/auth/EmailInput.tsx` | -     | "seu@email.com"                        | "Endereço de email"             |
| `screens/ProfileScreen.tsx`      | -     | Vários                                 | Baseado no campo                |

#### Padrão de Correção

```tsx
// ❌ ANTES
<TextInput
  placeholder="Digite sua mensagem..."
  value={message}
  onChangeText={setMessage}
/>

// ✅ DEPOIS
<TextInput
  placeholder="Digite sua mensagem..."
  value={message}
  onChangeText={setMessage}
  accessibilityLabel="Campo de mensagem para conversar com NathIA"
/>
```

---

### 1.4 P0-TARGET-WCAG-001: Tap Targets < 24px (3 issues)

**Problema:** Áreas de toque menores que 24x24px (WCAG 2.5.8 AA).

#### Issues Identificadas

| Arquivo              | Linha | Tamanho Atual | Correção                                |
| -------------------- | ----- | ------------- | --------------------------------------- |
| (ver relatório JSON) | -     | -             | Aumentar para min 24x24 ou usar hitSlop |

#### Padrão de Correção

```tsx
// ✅ Opção 1: Aumentar tamanho
<Pressable style={{ minWidth: 44, minHeight: 44 }}>

// ✅ Opção 2: Usar hitSlop
<Pressable hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
```

---

## Fase 2: MAJORs Importantes (P1)

**Objetivo:** Resolver os 40 MAJORs
**Critério:** WCAG A + iOS HIG

### 2.1 P1-STATE-001/002: Estados não Sincronizados (64 issues)

**Problema:** `disabled`, `selected`, `checked` sem `accessibilityState`.

#### Padrão de Correção

```tsx
// ❌ ANTES
<Pressable disabled={loading}>

// ✅ DEPOIS
<Pressable
  disabled={loading}
  accessibilityState={{ disabled: loading }}
>

// Para seleção
<Pressable
  selected={isSelected}
  accessibilityState={{ selected: isSelected }}
  accessibilityRole="button"
>
```

### 2.2 P1-MODAL-001: Modais sem Contenção de Foco (6 issues)

**Problema:** `<Modal>` sem `accessibilityViewIsModal`.

#### Padrão de Correção

```tsx
// ✅ Adicionar para iOS
<Modal
  visible={visible}
  accessibilityViewIsModal={true}
>
```

### 2.3 P1-ROLE-001: Views Interativas sem Role (4 issues)

**Problema:** `<View onPress>` sem `role="button"`.

#### Padrão de Correção

```tsx
// ❌ ANTES
<Animated.View onPress={handlePress}>

// ✅ DEPOIS (melhor trocar por Pressable)
<Pressable accessibilityRole="button">
```

---

## Fase 3: MINORs - Best Practices (P2)

**Objetivo:** Resolver 312 MINORs progressivamente
**Critério:** WCAG AAA / Best Practices

### 3.1 P2-MOTION-001: Animações sem Reduced Motion (267 issues)

**Problema:** Componentes animados sem verificar `useReducedMotion`.

#### Arquivos com Mais Animações

| Arquivo                | Issues | Prioridade  |
| ---------------------- | ------ | ----------- |
| Todos com `Animated.*` | 267    | Baixa (AAA) |

#### Padrão de Correção

```tsx
import { useReducedMotion } from "react-native-reanimated";

function AnimatedComponent() {
  const reducedMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: reducedMotion ? 1 : withTiming(opacity.value),
    transform: reducedMotion ? [] : [{ scale: withSpring(scale.value) }],
  }));

  return <Animated.View style={animatedStyle} />;
}
```

### 3.2 P2-HINT-001: Ações Complexas sem Hint

**Problema:** Elementos com múltiplas ações sem `accessibilityHint`.

#### Padrão de Correção

```tsx
<Pressable
  onPress={handlePress}
  onLongPress={handleLongPress}
  accessibilityLabel="Post de Maria"
  accessibilityHint="Toque para ver detalhes, segure para mais opções"
>
```

---

## Cronograma de Implementação

### Sprint 1: BLOCKERs Core (Estimativa: 3 dias)

| Dia | Tarefa                       | Arquivos                                 |
| --- | ---------------------------- | ---------------------------------------- |
| 1   | Labels em Screens principais | LoginScreen, PaywallScreen, MyCareScreen |
| 2   | Labels em Community e Posts  | CommunityScreen, PostCard, NewPostScreen |
| 3   | Imagens e Inputs             | Todos os arquivos com Image/TextInput    |

### Sprint 2: Componentes Base (Estimativa: 2 dias)

| Dia | Tarefa                        | Arquivos                            |
| --- | ----------------------------- | ----------------------------------- |
| 4   | Atualizar componentes UI base | CTAButton, IconButton, SocialButton |
| 5   | Estados e Modais              | Todos com disabled/selected, Modal  |

### Sprint 3: MAJORs e Refino (Estimativa: 2 dias)

| Dia | Tarefa                   | Arquivos                          |
| --- | ------------------------ | --------------------------------- |
| 6   | Estados de sincronização | Switches, Pressables com disabled |
| 7   | Testes e validação       | Executar auditoria novamente      |

### Sprint 4: MINORs (Ongoing)

- Implementar `useReducedMotion` progressivamente
- Adicionar hints em interações complexas
- Melhorar semântica de live regions

---

## Métricas de Sucesso

### Thresholds Mínimos para CI

```javascript
const THRESHOLDS = {
  labelCoverage: 80, // Atualmente: 36%
  roleCoverage: 70, // Atualmente: 85% ✅
  imagesHandled: 90, // Atualmente: 11%
  inputsWithLabel: 95, // Atualmente: 31%
  maxNewMajors: 5,
};
```

### Metas por Fase

| Fase          | Meta Labels | Meta Imagens | Meta Inputs |
| ------------- | ----------- | ------------ | ----------- |
| Após Sprint 1 | 60%         | 50%          | 70%         |
| Após Sprint 2 | 80%         | 80%          | 90%         |
| Após Sprint 3 | 85%         | 90%          | 95%         |

---

## Comandos Úteis

```bash
# Executar auditoria
npm run audit:a11y

# Atualizar baseline após correções
npm run audit:a11y:baseline

# Verificar contra baseline (CI)
npm run audit:a11y:check

# Executar com relatório CI
npm run audit:a11y:ci
```

---

## Referências

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)

---

## Apêndice A: Regras de Auditoria

| RuleId               | WCAG  | Severidade | Categoria | Descrição                          |
| -------------------- | ----- | ---------- | --------- | ---------------------------------- |
| P0-NAME-001          | 4.1.2 | BLOCKER    | NAME      | Interativo sem nome acessível      |
| P0-IMAGE-001         | 1.1.1 | BLOCKER    | IMAGE     | Imagem sem alternativa             |
| P0-INPUT-001         | 3.3.2 | BLOCKER    | FORM      | Input sem label                    |
| P0-TARGET-WCAG-001   | 2.5.8 | BLOCKER    | TARGET    | Target < 24px                      |
| P1-TARGET-HIG-001    | HIG   | MAJOR      | TARGET    | Target < 44pt                      |
| P1-ROLE-001          | 4.1.2 | MAJOR      | ROLE      | View interativa sem role           |
| P1-STATE-001         | 4.1.2 | MAJOR      | STATE     | disabled sem accessibilityState    |
| P1-STATE-002         | 4.1.2 | MAJOR      | STATE     | selected/checked sem state         |
| P1-MODAL-001         | 2.4.3 | MAJOR      | MODAL     | Modal sem accessibilityViewIsModal |
| P1-CONTRAST-A        | HIG   | MAJOR      | CONTRAST  | Cor hardcoded                      |
| P1-LABEL-IN-NAME-001 | 2.5.3 | MAJOR      | NAME      | Label não contém texto visível     |
| P2-MOTION-001        | 2.3.3 | MINOR      | MOTION    | Animação sem reduced motion        |
| P2-HINT-001          | 1.3.1 | MINOR      | NAME      | Ação complexa sem hint             |
| P2-STATUS-001        | 4.1.3 | MINOR      | STATE     | Status sem live region             |

---

## Apêndice B: Fingerprints do Baseline Inicial

Ver arquivo `docs/a11y-baseline.json` para lista completa de fingerprints.

Total de 477 findings registrados no baseline inicial.
