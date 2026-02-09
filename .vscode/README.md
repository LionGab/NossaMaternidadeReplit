# Configurações do Workspace

Este diretório contém configurações otimizadas para o projeto **Nossa Maternidade**.

## 📁 Arquivos

- **`settings.json`** - Configurações do workspace (editor, formatação, performance)
- **`extensions.json`** - Extensões recomendadas (instalação automática)

## 🚀 Extensões Essenciais

O Cursor/VS Code deve sugerir instalar automaticamente ao abrir o projeto. Se não acontecer:

### Instalação Manual

```bash
# Via terminal
cursor --install-extension dbaeumer.vscode-eslint
cursor --install-extension esbenp.prettier-vscode
cursor --install-extension bradlc.vscode-tailwindcss
cursor --install-extension eamodio.gitlens
cursor --install-extension expo.vscode-expo-tools
```

### Via UI

1. Abra Command Palette (`Cmd/Ctrl + Shift + P`)
2. Digite: `Extensions: Show Recommended Extensions`
3. Clique em "Install All"

## ⚙️ Configurações Principais

### Performance

- **File Watchers** otimizados (exclui `node_modules`, `.expo`, builds)
- **Search** exclui arquivos desnecessários
- **Git autofetch** desabilitado (melhor performance)

### Formatação

- **Prettier** como formatador padrão
- **ESLint** com auto-fix no save
- **Format on save** habilitado

### TypeScript

- Usa TypeScript do `node_modules` (versão do projeto)
- Import paths configurados (`@/*`)
- Auto-imports habilitados

### GitLens

- Configurado de forma otimizada
- CodeLens habilitado (histórico inline)
- Features pesadas desabilitadas

## 🔧 Personalização

Para ajustar configurações pessoais sem afetar o projeto:

1. Abra User Settings (`Cmd/Ctrl + ,`)
2. Procure pela configuração desejada
3. Ajuste apenas para seu usuário

**Nota**: Configurações do workspace (`.vscode/settings.json`) têm prioridade sobre User Settings.

## 📝 Status Bar Otimizado

O status bar foi configurado para mostrar apenas o essencial:

✅ **Mantido:**

- GitLens (histórico de commits)
- Problems (erros/warnings)
- Workspace Name
- Notifications

❌ **Removido:**

- Remote Host (não usado)
- Git Graph (duplicado)
- Empacotador React Native (não usado)
- Source Control redundante

## 🐛 Troubleshooting

### Extensões não instalam automaticamente

1. Verifique se `.vscode/extensions.json` existe
2. Reinicie o Cursor/VS Code
3. Abra Command Palette → `Developer: Reload Window`

### Prettier não formata

1. Verifique se `prettier` está instalado: `npm list prettier`
2. Verifique se há `.prettierrc` ou configuração no `package.json`
3. Reinicie o editor

### ESLint não funciona

1. Verifique se `eslint` está instalado: `npm list eslint`
2. Verifique se `eslint.config.js` existe
3. Abra Output → ESLint para ver erros

## 📚 Referências

- [CLAUDE.md](../CLAUDE.md) - Regras do projeto
- [docs/CURSOR_SETUP_DO_ZERO.md](../docs/CURSOR_SETUP_DO_ZERO.md) - Setup completo
