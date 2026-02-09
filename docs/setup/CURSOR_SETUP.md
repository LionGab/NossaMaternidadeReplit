# 🎨 Configuração do Cursor - Layout Fixo & Performance

## ✅ Configurações Aplicadas

### 📁 Arquivos Criados

1. **`.vscode/settings.json`** - Configurações principais do workspace
2. **`.cursor/settings.json`** - Configurações específicas do Cursor AI
3. **`.vscode/extensions.json`** - Extensões recomendadas
4. **`.vscode/launch.json`** - Configuração de debug
5. **`.vscode/tasks.json`** - Tarefas rápidas (Quality Gate, TypeCheck, Lint)
6. **`.cursorrules`** - Regras do Cursor AI

## 🎯 Layout Fixo Configurado

### Painéis

- **Sidebar**: Esquerda (fixa)
- **Terminal**: Inferior (fixo)
- **Explorer**: Sempre visível
- **Activity Bar**: Visível

### Editor

- **Tabs**: Múltiplos arquivos visíveis
- **Preview**: Desabilitado (abre arquivos direto)
- **Minimap**: Habilitado (otimizado)
- **Font**: SF Mono (macOS nativo)

## ⚡ Otimizações de Performance (8GB RAM)

### Memória

- TypeScript Server: Máx 2GB
- Limite de arquivos grandes: 4GB
- Watchers excluídos: node_modules, .expo, dist, build

### Indexação

- Auto-imports desabilitados (economiza RAM)
- Busca otimizada (sem symlinks)
- File watchers limitados

## 🎨 Aparência Visual

### Tema

- **Color Theme**: Default Dark Modern
- **Icon Theme**: VS Seti
- **Font**: SF Mono (13px, line-height 1.6)
- **Ligatures**: Habilitadas
- **Smooth Scrolling**: Ativado

### Editor

- Bracket pair colorization
- Indentation guides
- Highlight active indentation
- Smooth cursor animation

## 🚀 Comandos Rápidos

### Via Command Palette (Cmd+Shift+P)

- `Tasks: Run Task` → Quality Gate / TypeCheck / Lint

### Via Terminal Integrado

- `npm run quality-gate` - Validação completa
- `npm run typecheck` - Verificação TypeScript
- `npm run lint` - Linter

## 🔧 Personalização

### Alterar Tema

1. Cmd+Shift+P → "Preferences: Color Theme"
2. Escolha seu tema favorito

### Alterar Font

Edite `.vscode/settings.json`:

```json
"editor.fontFamily": "'Sua Font Aqui', monospace"
```

### Ajustar Layout

Edite `.vscode/settings.json`:

```json
"workbench.sideBar.location": "right", // ou "left"
"workbench.panel.defaultLocation": "right" // ou "bottom"
```

## 📊 Monitoramento de Performance

### Verificar Uso de Memória

1. Abra Command Palette (Cmd+Shift+P)
2. Digite "Developer: Show Running Extensions"
3. Verifique processos pesados

### Limpar Cache

```bash
npm run clean
```

## 🐛 Troubleshooting

### Cursor Travando

1. Verifique uso de memória (Activity Monitor)
2. Feche abas não utilizadas
3. Reinicie o Cursor
4. Execute: `npm run clean:ram-safe`

### TypeScript Lento

1. Verifique `.vscode/settings.json` → `typescript.tsserver.maxTsServerMemory`
2. Reduza se necessário (padrão: 2048MB)

### Layout Não Aplicado

1. Feche e reabra o Cursor
2. Verifique se arquivos estão na raiz do projeto
3. Reload Window: Cmd+Shift+P → "Developer: Reload Window"

## ✨ Dicas

- Use **Cmd+B** para toggle sidebar
- Use **Cmd+J** para toggle terminal
- Use \*\*Cmd+\*\* para split editor
- Use **Cmd+K Cmd+S** para ver todos os atalhos

## 📝 Notas

- Configurações são específicas do workspace
- Não afetam outros projetos
- Podem ser versionadas no Git (recomendado)
