## 📝 Descrição

Descrição clara das mudanças implementadas (2–3 frases).

## 🎯 Issue Relacionada

Closes #(número da issue)

## 🔄 Tipo de Mudança

- [ ] 🐛 Bug fix
- [ ] ✨ Nova feature
- [ ] 🔧 Melhoria
- [ ] 📚 Documentação
- [ ] 🎨 UI/UX
- [ ] ⚡ Performance
- [ ] 🔒 Segurança

## Mudanças Principais

-
-

## ✅ Checklist P0 (Obrigatório)

- [ ] Zero `console.log` (usar `logger.*`)
- [ ] Zero `any` types (usar `unknown` + guards)
- [ ] Zero cores hardcoded (usar `Tokens.*` ou `useThemeColors()`)
- [ ] `npm run quality-gate` passou

## ✅ Checklist de Quality Gate

- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Testado em iOS
- [ ] Testado em Android
- [ ] CLAUDE.md seguido (se aplicável)

## 🧪 Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Design / Acessibilidade / Performance (se aplicável)

- Tokens usados: `src/theme/tokens.ts`
- Tap targets >= 44pt
- Listas: `FlashList`/`FlatList`

## 📸 Screenshots/GIFs

(Adicione se houver mudanças visuais)

## 📋 Notas Adicionais

Contexto, trade-offs, pontos de atenção.

## 📚 Antes de Merge

- [ ] Consultar [AGENTS.md](./.agents/AGENTS.md) para fluxo de agentes (se aplicável)
- [ ] Build iOS testado (se mudou código nativo ou config)

---

<!--
Lembre-se:
- Commits atômicos e descritivos
- Diffs focados (<250 linhas por arquivo)
- Spec/retrospectiva se feature complexa
-->
