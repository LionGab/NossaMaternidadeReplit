# Setup MacBook 2020 - Nossa Maternidade

> Guia honesto e funcional para desenvolvimento com hardware limitado

---

## ✅ O QUE FUNCIONA BEM

1. **Edição de código** no Cursor
2. **Git operations** (commit, push, pull)
3. **Testes unitários** (Jest) - roda local
4. **Quality gates** (typecheck, lint) - pode demorar 2-3min

---

## ⚠️ O QUE É PROBLEMÁTICO

1. **Metro bundler** + simulador iOS/Android simultaneamente
   - **Solução**: Use EAS cloud builds (`npm run build:dev:ios`)
   
2. **TypeScript Server** travando
   - **Solução**: Aplique `settings.macbook-2020.json`
   
3. **npm install** travando
   - **Solução**: Use `npm install --legacy-peer-deps --no-audit`

---

## ❌ O QUE NÃO FUNCIONA

1. **Builds locais iOS** com Xcode
   - MacBook 2020 + Xcode 15+ + simulador = kernel panic
   - **Solução**: SEMPRE use EAS cloud builds

2. **Rodar 3+ ferramentas simultaneamente**
   - Cursor + Metro + Simulador + Chrome DevTools = swap infinito
   - **Solução**: Uma ferramenta de cada vez

---

## 🔧 Setup Obrigatório

### 1. Aplicar Configurações Otimizadas

```bash
# Backup configuração atual
cp .vscode/settings.json .vscode/settings.json.backup

# Mesclar configurações (manual ou usar jq)
# Copie as configs de settings.macbook-2020.json para settings.json
```

### 2. Limpar Pastas Desnecessárias

Essas pastas duplicam arquivos para outras IDEs (não usa no Cursor):

```bash
# BACKUP PRIMEIRO
mkdir -p ~/Desktop/nm-backup
cp -r .agent .codebuddy .codex .continue .gemini .kiro .opencode .qoder .roo .trae .windsurf ~/Desktop/nm-backup/

# Remove duplicatas (libera ~50MB + reduz file watchers)
rm -rf .agent .codebuddy .codex .continue .gemini .kiro .opencode .qoder .roo .trae .windsurf
```

**Mantenha apenas**: `.claude/` (Cursor) e `.vscode/`

### 3. Otimizar Node.js

```bash
# Adicione ao ~/.zshrc ou ~/.bash_profile
export NODE_OPTIONS="--max-old-space-size=2048"
export EXPO_NO_METRO_LAZY=true
export EXPO_METRO_MAX_WORKERS=2
```

Depois: `source ~/.zshrc`

### 4. Git Config para Performance

```bash
# Reduz operações de rede
git config --global fetch.parallel 2
git config --global core.preloadindex true
git config --global core.fscache true
```

---

## 📱 Workflow Recomendado

### Development (Dia a Dia)

```bash
# 1. Abrir Cursor (APENAS Cursor, sem browser/Slack/etc.)
open -a Cursor

# 2. Editar código normalmente
# Claude Code roda REMOTO - não trava

# 3. Testar mudanças
npm test -- --watch

# 4. Commit
git add .
git commit -m "feat: alguma coisa"
git push
```

### Testing (Cloud Agent faz isso)

```bash
# Quality gate (2-3min no MacBook 2020)
npm run quality-gate

# Se der timeout:
npm run typecheck # Roda apenas TS (1-2min)
npm run lint # Roda apenas ESLint (30s)
```

### Builds (SEMPRE cloud)

```bash
# Development build (testar em device físico)
npm run build:dev:ios

# Production build (TestFlight/App Store)
npm run build:prod:ios

# Monitora build
npm run eas:build:list
```

**NUNCA**: `npm run ios` (build local) - vai travar

---

## 🚨 Troubleshooting MacBook 2020

### TypeScript Server "Out of Memory"

```bash
# Kill processo
pkill -f tsserver

# Reabrir Cursor (TS server reinicia com limit correto)
```

### Metro Bundler Travando

```bash
# Limpar cache
npm run start:clear

# Se persistir, matar processos Node
pkill -f node
pkill -f expo
```

### Cursor Consumindo 4GB+ RAM

```bash
# Verificar processos
ps aux | grep -E "Cursor|node|expo" | awk '{print $2, $3, $4, $11}'

# Force quit + reabrir
killall Cursor
```

### Swap Disk Alto (>2GB)

```bash
# Verificar uso
sysctl vm.swapusage

# Fechar tudo e:
sudo purge # Limpa file cache (requer senha)
```

---

## 🎯 Regras de Ouro

1. **Uma coisa de cada vez**
   - Editando código? Sem Chrome/Slack/Spotify
   - Rodando Metro? Fechar tudo exceto Terminal + Cursor
   - Build rodando? Ir tomar café, voltar em 10min

2. **Cloud > Local**
   - Builds: SEMPRE EAS cloud
   - Testes: Locais são ok (Jest é leve)
   - Simulador: Apenas para protótipos rápidos

3. **Activity Monitor é seu amigo**
   - `Cmd+Space` → "Activity Monitor"
   - Ordenar por "Memory"
   - Se Cursor > 3GB → quit + reopen

4. **Reinicie diariamente**
   - macOS acumula memory leaks
   - Restart noturno = manhã produtiva

---

## 📊 Expectativas Realistas

| Tarefa | MacBook 2020 | Desktop 32GB |
|--------|--------------|--------------|
| Abrir projeto | 30-60s | 5-10s |
| Typecheck | 90-180s | 20-30s |
| Quality gate | 3-5min | 1min |
| npm install | 5-10min | 1-2min |
| Metro start | 60-90s | 15-30s |
| Build local iOS | ❌ Não tente | ✅ 15-20min |
| EAS cloud build | ✅ 10-15min | ✅ 10-15min |

---

## 🔄 Manutenção Semanal

```bash
# Limpar caches (sábado de manhã)
npm run clean:all
npm run clean:ios
rm -rf ~/Library/Caches/Expo
rm -rf ~/Library/Developer/Xcode/DerivedData

# Reinstalar deps limpo
npm ci
```

---

## 💡 Considerações Finais

**Hardware é limitante, mas não impeditivo**:
- Você PODE desenvolver profissionalmente
- Workflow é diferente (mais cloud-based)
- Paciência é virtude (comandos demoram mais)

**Quando atualizar hardware**:
- Se passar >30min/dia esperando builds/typechecks
- Se reiniciar Cursor >3x/dia por travamento
- Se swap disk constante >5GB

**Até lá**:
- Siga este guia religiosamente
- Aceite que alguns comandos demoram
- Use cloud agents a seu favor

---

**Última atualização**: 2026-02-11
