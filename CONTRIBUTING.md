# Contributing to Nossa Maternidade

Obrigado pelo seu interesse em contribuir com o Nossa Maternidade! 💜

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou Bun
- Expo CLI
- Git configurado

### Setup do Projeto

```bash
# Clone o repositório
git clone https://github.com/LionGab/NossaMaternidade.git
cd NossaMaternidade

# Instale as dependências
npm install

# Configure as variáveis de ambiente (copie .env.example para .env)
cp .env.example .env

# Execute os testes
npm test

# Inicie o desenvolvimento
npm start
```

## 📝 Padrões de Código

### TypeScript

- **100% TypeScript strict mode** - zero `any`, zero `@ts-ignore`
- Use tipos explícitos quando necessário
- Prefira interfaces sobre types para objetos

### Logging

- **NUNCA** use `console.log`
- Use `logger.*` de `src/utils/logger.ts`:
  ```typescript
  import { logger } from "@/utils/logger";
  logger.info("Mensagem", "Contexto");
  logger.error("Erro", "Contexto", error);
  ```

### Estilização

- **Cores**: Use `Tokens` + `useThemeColors()` - sem hex/rgba hardcoded
- **Estilização**: Use NativeWind (`className`) e `cn()` utility
- **Tokens**: Importe de `src/theme/tokens.ts`

### Acessibilidade

- Tap targets mínimo **44pt**
- Contraste alto (WCAG AA+)
- `accessibilityLabel`/`accessibilityRole` em elementos interativos

### Navegação e Performance

- Listas grandes: use `FlashList`/`FlatList`, não `ScrollView + map`
- Respeite safe area: `SafeAreaView` de `react-native-safe-area-context`
- Animações: use `useOptimizedAnimation` hook, respeite `useReducedMotion`

## 🔧 Comandos Úteis

```bash
# Qualidade
npm run quality-gate        # Roda todos os checks (obrigatório antes de PR)
npm run typecheck           # TypeScript check
npm run lint                # ESLint
npm run lint:fix            # Auto-fix ESLint
npm run test                # Testes
npm run test:watch          # Testes em modo watch

# Builds
npm run build:preview       # Build preview
npm run build:prod          # Build de produção (após quality-gate)
```

## 🌳 Git Workflow

### Branches

- `main` - produção
- `dev` - desenvolvimento
- `feature/nome-da-feature` - novas features
- `fix/nome-do-fix` - correções
- `copilot/*` - branches do GitHub Copilot

### Commits

Use commits descritivos e concisos:

```
feat: adiciona componente PremiumCard
fix: corrige animação em FloatingBubbles
docs: atualiza CONTRIBUTING.md
refactor: melhora performance do onboarding
```

## 🐛 Antes de Reportar um Bug

Sempre sincronize e valide antes de abrir uma issue:

```bash
git pull origin main && npm run typecheck
```

**Checklist minimo:**

- [ ] Executei `git pull origin main` antes de reportar
- [ ] Executei `npm run typecheck` e o erro persiste
- [ ] Branch atual: **\_\_\_\_**
- [ ] Ultimo commit: **\_\_\_\_**

> **Por que isso importa?** Erros de TypeScript podem ja ter sido corrigidos em commits recentes. Sincronizar evita reports duplicados.

## ✅ Checklist Antes de PR

- [ ] `npm run quality-gate` passa sem erros
- [ ] Todos os testes passam
- [ ] Código documentado (se necessário)
- [ ] Sem `console.log` (use `logger`)
- [ ] Acessibilidade respeitada (44pt tap targets)
- [ ] Cores usando Tokens
- [ ] TypeScript strict (zero `any`)

## 🔐 Segurança

- Nunca commite secrets/keys
- Nunca commite `.env` ou arquivos com credenciais
- Use `.env.example` como template
- Supabase sempre com RLS habilitado

## 📚 Recursos

- [Documentação do Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Reanimated v4](https://docs.swmansion.com/react-native-reanimated/)

## 💡 Precisa de Ajuda?

- Abra uma issue no GitHub
- Consulte a documentação em `docs/`
- Verifique `claude.md` e `docs/AI_GOVERNANCE.md` para regras de governança

---

Feito com 💜 pela equipe Nossa Maternidade
