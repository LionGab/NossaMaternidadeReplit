# Agentes Claude Code - Nossa Maternidade

> Arquitetura de agentes especializados para desenvolvimento do app.

---

## Visao Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                       AGENTES DE FRONTEND                        │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │              frontend-architect (opus/cyan)                │   │
│  │           Orquestra subagentes de UI/UX                   │   │
│  └───────────────────────┬───────────────────────────────────┘   │
│                          │                                        │
│    ┌─────────────────────┼─────────────────────┐                 │
│    │                     │                     │                 │
│    ▼                     ▼                     ▼                 │
│ ┌──────────┐      ┌──────────┐         ┌──────────┐             │
│ │component-│      │animation-│         │responsive│             │
│ │ builder  │      │specialist│         │ -layout  │             │
│ │ (green)  │      │(magenta) │         │ (blue)   │             │
│ └──────────┘      └──────────┘         └──────────┘             │
│                                                                   │
│    ┌─────────────────────┬─────────────────────┐                 │
│    │                     │                     │                 │
│    ▼                     ▼                     ▼                 │
│ ┌──────────┐      ┌──────────┐         ┌──────────┐             │
│ │accessibi-│      │  theme-  │         │design-ui │             │
│ │lity-audit│      │ migrator │         │(coordena)│             │
│ │ (yellow) │      │  (red)   │         │ (cyan)   │             │
│ └──────────┘      └──────────┘         └──────────┘             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     OUTROS AGENTES                               │
│                                                                   │
│  mobile-deployer    database         type-checker                │
│  mobile-debugger    performance      nathia-expert               │
│  nm-release-operator code-reviewer                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agentes de Frontend Design

### `frontend-architect` 🏗️

**Cor**: Cyan | **Modelo**: Opus (mais capaz)

**Quando usar**:

- Criar novas telas ou features visuais
- Refatorar UI existente
- Planejar arquitetura de componentes
- Fluxos de onboarding/wizards

**Capacidades**:

- Orquestra todos os subagentes de frontend
- Planeja arvore de componentes
- Define padrao de execucao
- Faz revisao de integracao

```
"Cria tela de perfil" → frontend-architect
```

---

### `component-builder` 🧱

**Cor**: Green | **Modelo**: Sonnet

**Quando usar**:

- Criar novos componentes React Native
- Refatorar componentes existentes
- Extrair subcomponentes
- Criar variantes de componentes

**Especialidades**:

- Padrao de props TypeScript
- Design system compliance
- Composicao de componentes
- Pressable com feedback

```
"Cria um StatsCard" → component-builder
```

---

### `animation-specialist` 🎬

**Cor**: Magenta | **Modelo**: Sonnet

**Quando usar**:

- Animacoes de entrada/saida
- Micro-interacoes (press, hover)
- Gestures (swipe, drag, pinch)
- Loading states e skeletons
- Otimizar animacoes para 60fps

**Especialidades**:

- Reanimated v4 (NUNCA Animated do RN)
- Gesture Handler
- Worklets e UI thread
- Tokens de animacao

```
"Animacao de fade in suave" → animation-specialist
```

---

### `accessibility-auditor` ♿

**Cor**: Yellow | **Modelo**: Sonnet

**Quando usar**:

- Auditar componentes/telas
- Verificar contraste (WCAG AAA = 7:1)
- Garantir tap targets >= 44pt
- Revisar labels e roles
- Testar VoiceOver/TalkBack

**Especialidades**:

- WCAG AAA compliance
- Screen readers
- Focus management
- Semantica de roles

```
"Os botoes estao acessiveis?" → accessibility-auditor
```

---

### `responsive-layout` 📐

**Cor**: Blue | **Modelo**: Sonnet

**Quando usar**:

- Safe Areas (notch, home indicator)
- Layouts responsivos
- Adaptar para tablets
- KeyboardAvoidingView
- Problemas de scroll/overflow

**Especialidades**:

- SafeAreaView do react-native-safe-area-context
- Breakpoints para devices
- Flexbox patterns
- Keyboard handling

```
"Botao atras do home indicator" → responsive-layout
```

---

### `theme-migrator` 🎨

**Cor**: Red | **Modelo**: Sonnet

**Quando usar**:

- Migrar cores hardcoded (#xxx)
- Converter inline styles para tokens
- Corrigir dark mode quebrado
- Atualizar componentes antigos

**Especialidades**:

- Mapeamento hardcoded → tokens
- useTheme() patterns
- Scan automatico de violacoes
- Migration incremental

```
"Tem #FFFFFF no codigo" → theme-migrator
```

---

### `design-ui` 🎯

**Cor**: Cyan | **Modelo**: Sonnet

**Quando usar**:

- Consultas rapidas sobre design system
- Duvidas sobre tokens e cores
- Revisoes gerais de compliance
- Verificacoes simples

**Nota**: Para tarefas especificas, prefira os subagentes acima.

```
"Qual cor usar para CTA?" → design-ui
```

---

## Outros Agentes

| Agente                | Responsabilidade          |
| --------------------- | ------------------------- |
| `mobile-deployer`     | Builds e deploy EAS       |
| `mobile-debugger`     | Debug de erros RN         |
| `database`            | Supabase, migrations, RLS |
| `type-checker`        | Erros TypeScript          |
| `performance`         | Otimizacao de performance |
| `code-reviewer`       | Revisao de codigo         |
| `nathia-expert`       | IA/NathIA personality     |
| `nm-release-operator` | Release gates             |

---

## Como Usar

### Chamada Direta

Os agentes sao ativados automaticamente via descricao. Exemplos:

```
"Cria uma tela de perfil"
→ Claude usa frontend-architect

"O botao esta travando na animacao"
→ Claude usa animation-specialist

"Verifica acessibilidade do card"
→ Claude usa accessibility-auditor
```

### Orquestracao

Para tarefas complexas, `frontend-architect` coordena os subagentes:

```
"Implementa tela de ciclo com animacoes e accessibility"
→ frontend-architect planeja
→ Delega para component-builder, animation-specialist, accessibility-auditor
→ Integra e revisa
```

---

## Design System Quick Reference

```typescript
// Imports essenciais
import { useTheme } from "@/hooks/useTheme";
import { Tokens } from "@/theme/tokens";

// Cores dinamicas (dark mode)
const { surface, text, brand, semantic, border } = useTheme();

// Tokens estaticos
Tokens.spacing.lg; // 16
Tokens.radius["2xl"]; // 24
Tokens.typography.titleMedium;
Tokens.shadows.md;
Tokens.accessibility.minTapTarget; // 44
```

---

## Regras Inviolaveis

1. **Zero cores hardcoded** - Usar `Tokens.*` ou `useTheme()`
2. **Tap targets >= 44pt** - Sempre
3. **Contraste WCAG AAA** - 7:1 para texto normal
4. **Reanimated v4** - Nunca `Animated` do RN
5. **FlashList/FlatList** - Nunca `ScrollView + map()`
6. **TypeScript strict** - Zero `any`

---

_Ultima atualizacao: Janeiro 2026_
