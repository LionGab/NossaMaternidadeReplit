# Skills Ativos — Nossa Maternidade

> Memória longa do projeto. Skills que evitam bugs recorrentes e mantêm padrões.

---

## Design Tokens

### Objetivo

Garantir uso correto do design system, evitando cores hardcoded.

### Gatilhos

- Criando/modificando componentes visuais
- Estilizando qualquer elemento
- Definindo cores, espaçamentos, bordas

### Regras

1. **Nunca usar cores hardcoded**

   ```typescript
   // RUIM
   backgroundColor: "#E8F4FD";
   color: "rgb(255, 182, 193)";

   // BOM
   backgroundColor: brand.primary[50];
   color: brand.accent[300];
   ```

2. **Sempre usar tokens de `src/theme/tokens.ts`**
   - `brand.primary` — Azul pastel (estrutura)
   - `brand.accent` — Rosa vibrante (CTAs, destaques)
   - `brand.secondary` — Lilás suave (apoio)
   - `neutral` — Cinzas para texto/backgrounds
   - `spacing` — Espaçamentos (8pt grid)
   - `radius` — Border radius padronizados

3. **Usar hooks de tema**

   ```typescript
   const { colors } = useThemeColors();
   ```

4. **Estilizar com NativeWind + `cn()`**
   ```typescript
   className={cn("p-4 rounded-lg", isDark && "bg-neutral-800")}
   ```

### Checklist

- [ ] Zero hex/rgb/rgba hardcoded
- [ ] Usando tokens de `src/theme/tokens.ts`
- [ ] `useThemeColors()` para cores dinâmicas
- [ ] NativeWind para classes utilitárias

---

## Acessibilidade Mobile

### Objetivo

Garantir app acessível para todos os usuários.

### Gatilhos

- Criando botões, links, inputs
- Qualquer elemento interativo
- Formulários e navegação

### Regras

1. **Tap target mínimo 44pt**

   ```typescript
   // RUIM
   <TouchableOpacity style={{ padding: 4 }}>

   // BOM
   <TouchableOpacity style={{ minHeight: 44, minWidth: 44 }}>
   ```

2. **Labels em elementos interativos**

   ```typescript
   accessibilityLabel = "Botão de enviar mensagem";
   accessibilityRole = "button";
   accessibilityHint = "Toque duas vezes para enviar";
   ```

3. **Contraste mínimo**
   - Texto normal: 4.5:1
   - Texto grande: 3:1
   - WCAG AAA: 7:1 (preferido)

### Checklist

- [ ] Tap targets >= 44pt
- [ ] `accessibilityLabel` em interativos
- [ ] `accessibilityRole` definido
- [ ] Contraste verificado

---

## Zustand Patterns

### Objetivo

Evitar re-renders desnecessários e manter stores previsíveis.

### Gatilhos

- Criando/modificando stores
- Consumindo state em componentes

### Regras

1. **Seletores específicos (nunca desestruturar objeto)**

   ```typescript
   // RUIM - re-render em qualquer mudança do store
   const { user, isLoading } = useAppStore();

   // BOM - re-render só quando user/isLoading mudam
   const user = useAppStore((s) => s.user);
   const isLoading = useAppStore((s) => s.isLoading);
   ```

2. **Actions separadas do state**

   ```typescript
   // No store
   interface UserStore {
     user: User | null; // State
     setUser: (u: User) => void; // Action
   }
   ```

3. **Persistência com AsyncStorage**
   ```typescript
   persist(
     (set) => ({ ... }),
     { name: 'store-name', storage: createJSONStorage(() => AsyncStorage) }
   )
   ```

### Checklist

- [ ] Seletores específicos (não desestruturar)
- [ ] Actions com nomes claros
- [ ] Persistência quando necessário

---

## Logger Usage

### Objetivo

Evitar `console.log` em produção, garantir logs estruturados.

### Gatilhos

- Qualquer necessidade de logging
- Debug, erros, warnings

### Regras

1. **Nunca `console.log`**

   ```typescript
   // RUIM
   console.log("user:", user);

   // BOM
   logger.debug("User loaded", { userId: user.id });
   ```

2. **Usar logger de `src/utils/logger.ts`**

   ```typescript
   import { logger } from "../utils/logger";

   logger.debug("message", { context });
   logger.info("message", { context });
   logger.warn("message", { context });
   logger.error("message", { error, context });
   ```

3. **Sempre incluir contexto**
   ```typescript
   logger.error("Failed to fetch user", {
     userId,
     error: error.message,
     screen: "HomeScreen",
   });
   ```

### Checklist

- [ ] Zero `console.log`
- [ ] Usando `logger.*`
- [ ] Contexto incluído em logs

---

## Commit Convention

### Objetivo

Manter histórico git limpo e informativo.

### Formato

```
type(scope): mensagem curta

Corpo opcional explicando o porquê.

🤖 Generated with Claude Code
```

### Tipos

- `feat` — Nova feature
- `fix` — Correção de bug
- `docs` — Documentação
- `style` — Formatação (não afeta código)
- `refactor` — Refatoração sem mudança de comportamento
- `perf` — Melhoria de performance
- `test` — Testes
- `chore` — Manutenção, deps, configs

### Exemplos

```
feat(auth): add Google OAuth login
fix(cycle): correct ovulation date calculation
docs(readme): update quickstart section
refactor(store): migrate to Zustand v5 syntax
```

### Checklist

- [ ] Tipo correto
- [ ] Escopo quando aplicável
- [ ] Mensagem em inglês ou português consistente
- [ ] Commits atômicos (1 mudança lógica por commit)

---

## Anti-Padrões Globais

### 1. Modificar sem investigar

**Problema**: Criar código que conflita com padrões existentes
**Solução**: Sempre ler arquivos relacionados antes de modificar

### 2. `any` type

**Problema**: Perde type safety
**Solução**: Tipar corretamente ou usar `unknown` + type guard

### 3. Listas com ScrollView + map

**Problema**: Performance ruim com muitos itens
**Solução**: Usar `FlatList` ou `FlashList`

### 4. Cores hardcoded

**Problema**: Inconsistência visual, dark mode quebrado
**Solução**: Usar tokens de `src/theme/tokens.ts`

### 5. Deps novas sem aprovação

**Problema**: Bundle bloat, manutenção
**Solução**: Justificar necessidade, avaliar alternativas

---

## Referências Rápidas

| Preciso de...   | Use...                    |
| --------------- | ------------------------- |
| Cores           | `src/theme/tokens.ts`     |
| Logging         | `src/utils/logger.ts`     |
| State global    | `src/state/store.ts`      |
| Navegação types | `src/types/navigation.ts` |
| Componentes UI  | `src/components/ui/`      |
| Hooks           | `src/hooks/`              |

---

## Histórico

| Data       | Mudança                         |
| ---------- | ------------------------------- |
| 2025-01-04 | Criação inicial com skills base |
