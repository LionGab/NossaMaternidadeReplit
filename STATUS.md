# STATUS.md — NossaMaternidade

> Última atualização: 2026-01-27
> Responsável: Lion + AI

---

## 📊 Estado Atual

| Métrica       | Valor             |
| ------------- | ----------------- |
| Expo SDK      | 54                |
| React Native  | 0.81              |
| TypeScript    | Strict ✅         |
| Testes        | ~20 arquivos      |
| Build iOS     | ❓ Não verificado |
| Build Android | ❓ Não verificado |

---

## ✅ Features Prontas

### Core

- [x] Estrutura de pastas (src/api, components, hooks, screens, state, utils)
- [x] TypeScript strict mode
- [x] Design system (Tokens, useThemeColors)
- [x] Logger centralizado
- [x] Navegação (React Navigation 7)
- [x] Zustand stores separados por feature

### Screens

- [x] Auth (login, registro)
- [x] Onboarding (28 arquivos)
- [x] Home
- [x] Comunidade
- [x] NathIA (assistente)
- [x] Mundo da Nath
- [x] Meus Cuidados (care)
- [x] Profile
- [x] Premium
- [x] Admin

### Infra

- [x] CI/CD (GitHub Actions)
- [x] ESLint + Prettier
- [x] Jest configurado
- [x] Supabase configurado
- [x] RevenueCat configurado
- [x] EAS configurado

---

## ⏳ Pendente / Em Progresso

### Crítico para Produção

- [ ] Verificar build iOS (sem erros)
- [ ] Verificar build Android (sem erros)
- [ ] Remover store.ts deprecated (deadline: 1 Abril 2026)
- [ ] Criar QUICKSTART.md (referenciado mas não existe)
- [ ] Corrigir nome no package.json ("template-app-53" → "nossa-maternidade")

### Testes

- [ ] Aumentar cobertura de testes
- [ ] Testes E2E

### Polimento

- [ ] Consolidar arquivos de contexto AI (múltiplos: .cursorrules, .windsurfrules, claude.md)
- [ ] Verificar consistência SDK 54 vs 55

---

## 🐛 Bugs Conhecidos

| Bug                        | Severidade | Status |
| -------------------------- | ---------- | ------ |
| (nenhum documentado ainda) | -          | -      |

---

## 🚀 Próximos Passos (Priorizado)

1. **Verificar builds** — `eas build --platform ios --profile preview`
2. **Rodar quality-gate** — `npm run quality-gate`
3. **Corrigir package.json name**
4. **Criar QUICKSTART.md**
5. **Remover store.ts e migrar imports**

---

## 📝 Sessões de Desenvolvimento

### 2026-01-27

- Diagnóstico inicial do projeto
- Criado STATUS.md
- Identificados problemas de fragmentação

---

_Atualizar este arquivo a cada sessão de desenvolvimento._
