## Resumo

<!-- Descreva o que esta PR faz em 2-3 frases -->

## Tipo de Mudança

- [ ] `feat` — Nova feature
- [ ] `fix` — Correção de bug
- [ ] `docs` — Documentação
- [ ] `refactor` — Refatoração
- [ ] `perf` — Performance
- [ ] `test` — Testes
- [ ] `chore` — Manutenção

## Mudanças

<!-- Liste as principais mudanças -->

-
-

## Screenshots (se UI)

<!-- Adicione screenshots antes/depois se aplicável -->

## Checklist de Governança

### Investigação

- [ ] Li os arquivos relacionados antes de modificar
- [ ] Verifiquei se já existe solução similar no codebase
- [ ] Segui os padrões existentes

### Qualidade

- [ ] `npm run quality-gate` passou
- [ ] Zero `any` / `@ts-ignore` sem justificativa
- [ ] Zero `console.log` (usando `logger.*`)

### Design System (se UI)

- [ ] Usando tokens de `src/theme/tokens.ts`
- [ ] Zero cores hardcoded
- [ ] NativeWind para estilos (sem `StyleSheet.create`)

### Acessibilidade (se UI)

- [ ] Tap targets >= 44pt
- [ ] `accessibilityLabel` em elementos interativos
- [ ] Contraste adequado

### Performance (se listas)

- [ ] Usando `FlashList` ou `FlatList` (nunca `ScrollView + map`)
- [ ] Componentes memoizados (`useCallback`, `useMemo`, `memo`)
- [ ] `keyExtractor` estável

### Documentação

- [ ] Decisões importantes documentadas
- [ ] Atualizado `claude.md` se mudou regras
- [ ] Atualizado `CHANGELOG.md` com mudanças

## Como Testar

<!-- Passos para testar esta PR -->

1.
2.
3.

## Deploy Notes

<!-- Preencha se houver ações necessárias pós-merge -->

### Supabase Secrets (se aplicável)

<!-- Exemplo:
```
ALLOWED_ORIGINS=https://app.nossamaternidade.com,https://admin.nossamaternidade.com
```
-->

### Deploy de Edge Functions (se aplicável)

<!-- Exemplo:
```bash
npx supabase functions deploy community-feed
```
-->

### Outras Ações Pós-Deploy

<!-- Migrações, seeds, configurações, etc. -->

## Notas para Revisores

<!-- Contexto adicional, pontos de atenção, trade-offs -->

---

<!--
Lembre-se:
- Commits atômicos e descritivos
- Diffs focados (<250 linhas por arquivo)
- Spec/retrospectiva se feature complexa
-->
