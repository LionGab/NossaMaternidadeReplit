# Instruções para Code Review

## Padrões de Código

- Usar async/await ao invés de Promise.then
- React Hooks preferencialmente (sem class components)
- ESLint rules obrigatórias

## Foco em Verificação

- Segurança (inputs, validações)
- Performance (re-renders desnecessários, loops)
- Type safety (TypeScript)
- Testes unitários
- Documentação de funções críticas
