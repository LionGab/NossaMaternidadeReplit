# 🚀 Guia Rápido: Usar Cursor para Modernizar NossaMaternidade

## Atalhos Essenciais

| Ação                         | Mac     | Windows/Linux |
| ---------------------------- | ------- | ------------- |
| **Edit Inline** (seleção)    | `Cmd+K` | `Ctrl+K`      |
| **Chat Lateral**             | `Cmd+L` | `Ctrl+L`      |
| **Composer** (multi-arquivo) | `Cmd+I` | `Ctrl+I`      |
| **Aceitar Sugestão**         | `Tab`   | `Tab`         |
| **Próxima Sugestão**         | `Cmd+>` | `Ctrl+>`      |
| **Rejeitar**                 | `Esc`   | `Esc`         |

---

## Quick Win #1: Habilitar Nova Arquitetura (5 min)

### Passo a Passo:

1. **Abra** `app.config.js`
2. **Pressione** `Cmd+K` (Mac) ou `Ctrl+K` (Windows)
3. **Digite** este prompt:

```
Adicione newArchEnabled: true na seção expo deste arquivo, logo após a propriedade name
```

4. **Aceite** a sugestão (`Tab` ou `Cmd+Enter`)
5. **Teste** no terminal:

```bash
npx expo prebuild --clean
npx expo run:android  # ou run:ios
```

### Resultado Esperado:

```javascript
module.exports = ({ config }) => {
  return {
    ...config,
    name: "Nossa Maternidade",
    expo: {
      newArchEnabled: true, // ← Adicionado aqui
      // ... resto da config
    },
  };
};
```

---

## Quick Win #2: Instalar React Compiler (10 min)

### Passo 1: Instalar Dependência

```bash
npm install babel-plugin-react-compiler
```

### Passo 2: Configurar Babel

1. **Abra** `babel.config.js`
2. **Pressione** `Cmd+K`
3. **Digite**:

```
Adicione 'babel-plugin-react-compiler' aos plugins do Babel, antes do plugin react-native-reanimated/plugin
```

### Resultado Esperado:

```javascript
plugins: [
  // ... outros plugins
  "babel-plugin-react-compiler",  // ← Adicionado aqui
  "react-native-reanimated/plugin",  // ← Deve ser o último
],
```

---

## Quick Win #3: Migrar FlatList → FlashList (15 min por arquivo)

### Passo 1: Instalar FlashList

```bash
npm install @shopify/flash-list
```

### Passo 2: Migrar Arquivo Prioritário

**Exemplo: Migrar `src/screens/CommunityScreen.tsx`**

1. **Abra** o arquivo
2. **Selecione** todo o componente (`Cmd+A`)
3. **Pressione** `Cmd+K`
4. **Digite**:

```
Substitua FlatList por FlashList do @shopify/flash-list:
1. Importe FlashList de @shopify/flash-list
2. Substitua FlatList por FlashList mantendo todas as props
3. Adicione estimatedItemSize={200} para otimização
4. Mantenha todas as outras props existentes (data, renderItem, keyExtractor, etc)
```

### Exemplo de Transformação:

**Antes:**

```tsx
import { FlatList } from "react-native";

<FlatList data={posts} renderItem={renderPost} keyExtractor={(item) => item.id} />;
```

**Depois:**

```tsx
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={posts}
  renderItem={renderPost}
  keyExtractor={(item) => item.id}
  estimatedItemSize={200}
/>;
```

### Arquivos Prioritários para Migrar:

1. ✅ `src/screens/CommunityScreen.tsx` - Lista de posts
2. ✅ `src/screens/HomeScreen.tsx` - Feed principal
3. ✅ `src/screens/CycleTrackerScreen.tsx` - Histórico
4. ✅ `src/components/community/PostCard.tsx` - Cards

---

## Quick Win #4: Dark Mode Automático (20 min)

### Passo a Passo:

1. **Abra** `app.config.js`
2. **Pressione** `Cmd+K`
3. **Digite**:

```
Altere userInterfaceStyle de "light" para "automatic" para habilitar dark mode automático baseado nas preferências do sistema
```

### Resultado:

```javascript
userInterfaceStyle: "automatic",  // ← Era "light"
```

---

## Quick Win #5: Adicionar Acessibilidade (15 min por componente)

### Método 1: Chat Lateral (Recomendado)

1. **Abra** o componente (ex: `src/components/ui/Button.tsx`)
2. **Pressione** `Cmd+L` (abre chat)
3. **Digite**:

```
Analise este componente e adicione props de acessibilidade React Native apropriadas:
- accessible={true}
- accessibilityRole="button" (ou role apropriado)
- accessibilityLabel="Texto descritivo"
- accessibilityHint="Ação que será executada"
- accessibilityState={{ disabled: isDisabled }} (se aplicável)

Considere usuários de VoiceOver (iOS) e TalkBack (Android)
```

### Método 2: Edit Inline

1. **Selecione** o componente JSX
2. **Pressione** `Cmd+K`
3. **Digite**:

```
Adicione props de acessibilidade: accessible, accessibilityRole, accessibilityLabel, accessibilityHint
```

### Componentes Prioritários:

- ✅ Botões principais (`Button.tsx`, `AppButton.tsx`)
- ✅ Cards interativos (`PostCard.tsx`, `FeatureCard.tsx`)
- ✅ Inputs (`Input.tsx`, `EmailInput.tsx`)
- ✅ Telas de onboarding

---

## Exemplos Avançados com Composer (Cmd+I)

### Exemplo 1: Criar Serviço de IA

**Prompt para Composer:**

```
Crie um serviço de chatbot para perguntas sobre gravidez:

ARQUIVO: src/services/pregnancyAI.ts
- Cliente OpenAI configurado com variável EXPO_PUBLIC_OPENAI_API_KEY
- Função askQuestion(question: string, week: number): Promise<string>
- System prompt que considera semana gestacional
- Sempre inclui disclaimer médico: "Esta informação é apenas educativa. Consulte seu médico."
- Tratamento de erros e timeout de 30s
- Rate limiting básico

ARQUIVO: src/types/ai.ts
- Tipo PregnancyQuestion com question, week, userId
- Tipo AIResponse com answer, sources, disclaimer

Adicione variável EXPO_PUBLIC_OPENAI_API_KEY ao .env.example
```

### Exemplo 2: Migrar Componente de Classe para Hooks

**Prompt:**

```
Migre este class component para functional component:
1. Use useState para state
2. Use useEffect para componentDidMount/componentDidUpdate
3. Adicione TypeScript types explícitos
4. Use TanStack Query se houver chamadas de API
5. Adicione React.memo se o componente renderiza frequentemente
6. Mantenha toda a lógica existente
```

---

## Dicas Pro de Cursor

### 1. Usar @-mentions no Chat

```
@src/api/supabase.ts Como migro este código para usar a Nova Arquitetura?
```

### 2. Gerar Testes Automáticos

**No Chat (`Cmd+L`):**

```
Gere testes Jest completos para @src/components/ui/Button.tsx:
1. Testes de renderização
2. Testes de interação (onPress)
3. Testes de acessibilidade (roles, labels)
4. Edge cases (loading, disabled states)
5. Use React Native Testing Library e @testing-library/user-event
```

### 3. Refatoração Multi-Arquivo

**No Composer (`Cmd+I`):**

```
Refatore todos os componentes de botão para usar o novo design system:

1. @src/components/ui/Button.tsx - Atualizar para usar tokens de @src/theme/tokens.ts
2. @src/components/ui/AppButton.tsx - Mesma atualização
3. @src/components/ui/IconButton.tsx - Mesma atualização
4. Substitua cores hardcoded por Tokens.primary[500], etc.
5. Adicione suporte a dark mode usando useThemeColors()
```

---

## Workflow Recomendado

### Hoje (30 minutos):

1. ✅ Habilitar Nova Arquitetura (`Cmd+K` em `app.config.js`)
2. ✅ Instalar React Compiler (`npm install` + `Cmd+K` em `babel.config.js`)
3. ✅ Testar build básico

### Amanhã (1 hora):

1. ✅ Instalar FlashList
2. ✅ Migrar 1-2 listas prioritárias
3. ✅ Adicionar acessibilidade a 3-5 componentes principais

### Esta Semana:

1. ✅ Dark mode automático
2. ✅ Migrar mais listas para FlashList
3. ✅ Configurar EAS Update

---

## Troubleshooting

### Cursor não está sugerindo código?

- Verifique se selecionou o código corretamente
- Tente ser mais específico no prompt
- Use `Cmd+L` (Chat) para perguntas mais complexas

### Sugestão não está correta?

- Pressione `Esc` para rejeitar
- Refine o prompt e tente novamente
- Use `Cmd+>` para ver alternativas

### Quer ajuda com componente específico?

Compartilhe o código e eu ajudo a criar o prompt perfeito! 🚀

---

**Última atualização**: 2026-01-12
