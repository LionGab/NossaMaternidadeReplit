# Extensões Cursor — MacBook Air 2020 (8GB RAM)

> Configuração assertiva e minimalista para desenvolvimento com Expo/React Native neste projeto.

---

## Extensões Recomendadas (apenas 3)

### 1. ESLint (`dbaeumer.vscode-eslint`)

**Obrigatório** — O projeto usa regras ESLint estritas definidas em `.cursorrules` e `package.json`.

**Por que precisa**:

- Quality gate (`npm run quality-gate`) depende do ESLint
- Feedback em tempo real sobre violações (ex.: `console.log` em `src/`)
- Auto-fix de problemas comuns

### 2. Prettier (`esbenp.prettier-vscode`)

**Obrigatório** — Formatador oficial do projeto com plugin Tailwind.

**Por que precisa**:

- Scripts `npm run format` e `npm run format:check` usam Prettier
- Plugin `prettier-plugin-tailwindcss` ordena classes automaticamente
- Mantém consistência de código

**Configuração**: `.vscode/settings.json` já define como formatador padrão.

### 3. Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

**Recomendado** — Autocomplete e lint para classes NativeWind 4.

**Por que precisa**:

- O projeto usa NativeWind 4 (Tailwind para React Native)
- Autocomplete de classes `className="..."`
- Validação de classes inválidas
- Preview de cores inline

---

## O Que NÃO Instalar

### React Native Tools ❌

- **Motivo**: Muito pesada (>100MB), consome muita memória
- **Alternativa**: Use comandos no terminal (`npm start`, `npm run ios`, etc.)

### GitLens ❌

- **Motivo**: Pesada, muitas features que você não precisa para este projeto
- **Alternativa**: Git nativo do Cursor é suficiente

### Error Lens ❌

- **Motivo**: Decora todas as linhas com erro, consome memória em projetos grandes
- **Alternativa**: Use o painel "Problems" do Cursor

### Segundo Formatador ❌

- **Motivo**: Conflito com Prettier, uso duplicado de memória
- **Regra**: Mantenha **apenas** Prettier habilitado

### Múltiplas Extensões de Tema/Ícones ❌

- **Motivo**: Cada tema carrega assets extras
- **Regra**: Escolha um tema e desabilite todos os outros

---

## Configurações de Desempenho

O arquivo `.vscode/settings.json` já está configurado com:

### TypeScript

```json
"typescript.tsserver.maxTsServerMemory": 1024
```

**Limite de 1GB** para o TypeScript server (ideal para 8GB RAM).

### Editor

```json
"editor.minimap.enabled": false
```

**Minimap desabilitado** — reduz uso de GPU e memória.

### File Watchers

Pastas excluídas:

- `node_modules`
- `.expo`
- `build`
- `ios/build`
- `android/build`

**Por que**: Reduz I/O e uso de memória do file watcher.

---

## Como Instalar

### Opção 1: Via Cursor UI

1. Abra Cursor
2. Cmd+Shift+X (Extensions)
3. Busque por:
   - `ESLint`
   - `Prettier - Code formatter`
   - `Tailwind CSS IntelliSense`
4. Clique em "Install" em cada uma

### Opção 2: Via Linha de Comando

```bash
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
```

### Opção 3: Aceitar Recomendações

Quando abrir o projeto, o Cursor mostrará um pop-up:

> "This workspace has extension recommendations."

Clique em **"Install All"**.

---

## Verificar Instalação

Execute o script de verificação:

```bash
bash scripts/setup/setup-cursor-mac.sh
```

O script verifica:

- ✅ Extensões instaladas
- ✅ Configurações de memória
- ✅ File watchers
- ✅ Dependências do projeto

---

## Troubleshooting

### "TypeScript server is out of memory"

1. Feche outros projetos no Cursor
2. Verifique que `typescript.tsserver.maxTsServerMemory: 1024` está em `.vscode/settings.json`
3. Reinicie o Cursor

### "Prettier not formatting"

1. Verifique que Prettier está instalado: `npm list prettier`
2. Abra Command Palette: Cmd+Shift+P
3. Execute: "Format Document With..." → Prettier
4. Em Settings, defina Prettier como formatador padrão

### "Tailwind classes not autocompleting"

1. Verifique que `tailwind.config.js` existe na raiz
2. Reinicie o Cursor
3. Abra um arquivo `.tsx` e teste `className="bg-|"` (cursor no |)

---

## Monitorar Uso de Memória

### Activity Monitor (macOS)

1. Abra "Activity Monitor"
2. Busque por "Cursor"
3. Monitore "Memory" — ideal: <2GB para o Cursor Helper

### Extension Monitor (Cursor)

1. Cmd+Shift+P
2. "Developer: Open Extension Monitor"
3. Ordene por "Activation Time" ou "Memory"
4. Desabilite extensões pesadas (>50MB)

---

## Resumo

| Item             | Ação                                          |
| ---------------- | --------------------------------------------- |
| **Instalar**     | ESLint, Prettier, Tailwind CSS IntelliSense   |
| **Não instalar** | React Native Tools, GitLens, Error Lens       |
| **Configurar**   | TS memory limit (1024), minimap off, watchers |
| **Verificar**    | `bash scripts/setup/setup-cursor-mac.sh`      |

---

**Última atualização**: 2026-02-11  
**Hardware alvo**: MacBook Air 2020, 8GB RAM  
**Cursor versão**: Requer versão com suporte a MCP e remote servers
