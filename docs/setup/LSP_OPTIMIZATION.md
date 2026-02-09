# Otimização de LSPs - Nossa Maternidade

## Resumo

Este documento descreve a configuração otimizada de Language Server Protocols (LSPs) para o projeto Nossa Maternidade, focando em performance e economia de memória no MacBook M1 8GB RAM.

## LSPs Essenciais (Sempre Ativos)

### 1. TypeScript LSP (CRÍTICO)

**Status:** ✅ Configurado e validado

**Configuração:**

- **Strict Mode:** Habilitado em `tsconfig.json` (`"strict": true`)
- **Verificações adicionais:**
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noImplicitReturns: true`
  - `noFallthroughCasesInSwitch: true`

**Validação:**

```bash
npm run typecheck  # ou bun run typecheck
```

**Cobertura:**

- `src/**/*.ts` e `src/**/*.tsx` (React Native)
- `scripts/**/*.js` e `scripts/**/*.mjs` (Node.js)
- `supabase/functions/**/*.ts` (Deno/Edge Functions)

### 2. ESLint LSP (ESSENCIAL)

**Status:** ✅ Integrado via `expo lint`

**Configuração:**

- Regras definidas em `eslint.config.js`
- Bloqueia `console.log` (força uso de `logger.*`)
- Valida padrões React/React Native
- TypeScript strict mode enforcement

**Validação:**

```bash
npm run lint  # ou bun run lint
```

### 3. Tailwind CSS LSP (ESSENCIAL)

**Status:** ✅ Necessário para NativeWind

**Funcionalidade:**

- Autocomplete de classes Tailwind
- Validação de classes em `className` props
- Suporte para `cn()` helper function

**Configuração recomendada (VS Code/Cursor):**

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"],
    ["className\\s*[:=]\\s*['\"`]([^'\"`]*)['\"`]"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## LSPs Desnecessários (Pode Desativar)

Estes LSPs aparecem no terminal mas **não são necessários** para este projeto Expo Managed:

### ❌ Swift/Objective-C (`swift-lsp`, `clangd-lsp`)

- **Por quê:** Código nativo iOS raramente editado em Expo Managed
- **Quando usar:** Apenas se editar `ios/` diretamente
- **Ação:** Pode ignorar/desativar

### ❌ Java/Kotlin (`jdtls-lsp`)

- **Por quê:** Código nativo Android raramente editado em Expo Managed
- **Quando usar:** Apenas se editar `android/` diretamente
- **Ação:** Pode ignorar/desativar

### ❌ Python (`pyright-lsp`)

- **Por quê:** Não há scripts Python críticos no projeto
- **Ação:** Pode ignorar/desativar

### ❌ C# (`csharp-lsp`)

- **Por quê:** Não usado no stack React Native
- **Ação:** Pode ignorar/desativar

### ❌ Go (`gopls-lsp`)

- **Por quê:** Não usado no projeto
- **Ação:** Pode ignorar/desativar

### ❌ Rust (`rust-analyzer-lsp`)

- **Por quê:** Não usado no projeto
- **Ação:** Pode ignorar/desativar

### ❌ Lua (`lua-lsp`)

- **Por quê:** Não usado no projeto
- **Ação:** Pode ignorar/desativar

## Configuração Manual (VS Code/Cursor)

Se você quiser desativar LSPs desnecessários manualmente:

### Opção 1: Via Settings UI

1. Abra Settings (Cmd+,)
2. Busque por cada LSP (ex: "swift", "java", "python")
3. Desative as extensões correspondentes

### Opção 2: Via settings.json

Crie/edite `.vscode/settings.json` no workspace:

```json
{
  "swift.enable": false,
  "clangd.enable": false,
  "java.enable": false,
  "kotlin.enable": false,
  "python.enable": false,
  "csharp.enable": false,
  "go.enable": false,
  "rust.enable": false,
  "lua.enable": false,

  "typescript.enable": true,
  "eslint.enable": true,
  "tailwindCSS.enable": true
}
```

## Performance Tips

### Limitar Arquivos Monitorados

Adicione ao `settings.json`:

```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.expo/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/ios/Pods/**": true,
    "**/android/.gradle/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.expo": true,
    "**/dist": true,
    "**/build": true
  }
}
```

### TypeScript Memory Limit

```json
{
  "typescript.tsserver.maxTsServerMemory": 4096
}
```

## Validação

Para verificar se tudo está funcionando:

```bash
# 1. TypeScript strict mode
npm run typecheck

# 2. ESLint
npm run lint

# 3. Quality gate completo
npm run quality-gate
```

## Conclusão

**Foque 100% no TypeScript LSP.** Os outros são ruído para este repositório React Native/Expo.

Se o Cursor ou VS Code sugerir instalar extensões para C#, Java ou Swift, você pode **recusar com segurança** para este workspace.
