# MacBook 2020 - Checklist Diário

> Referência rápida para desenvolvimento sem travamentos

---

## ✅ Morning Checklist

```bash
# 1. ANTES de abrir Cursor
□ Fechar Chrome/Slack/Spotify/Mail
□ Reiniciar Mac (se >3 dias sem restart)
□ Verificar disco: df -h (>10GB livre = ok)

# 2. Abrir projeto
□ Cursor APENAS (sem outros apps)
□ Verificar RAM: Activity Monitor → Cursor < 2.5GB = ok
□ Se swap >2GB: sudo purge (limpa cache)

# 3. Git sync
□ git pull origin main
□ git status (verificar branch correta)
```

---

## 🔨 Dev Session Checklist

```bash
# Editar código
□ Salvar frequentemente (Cmd+S)
□ Cursor responde em <1s = ok
□ Se lag >2s: verificar RAM

# Testar mudanças
□ npm test -- MyComponent.test.ts
□ Testes passam = ok para commit

# Antes de commit
□ npm run typecheck (esperar 1-2min)
□ Se erros: fix first
□ git add . && git commit -m "..."
```

---

## 🚀 Build Checklist

```bash
# NUNCA faça build local
□ ❌ npm run ios
□ ❌ npm run android

# SEMPRE use cloud
□ ✅ npm run build:dev:ios
□ ✅ npm run eas:build:list
□ ✅ Aguardar 10-15min (ir tomar café)
```

---

## ⚠️ Sinais de Problema

### RAM Warning

```bash
# Verificar
Activity Monitor → Memory tab:

🟢 OK: Cursor 1.5-2.5GB, swap <2GB
🟡 Atenção: Cursor >3GB, swap 2-4GB
🔴 Crítico: Cursor >4GB, swap >4GB
```

**Se 🟡 Atenção**:
```bash
# Quick fix
killall "Google Chrome"
```

**Se 🔴 Crítico**:
```bash
# Nuclear option
killall Cursor
pkill -f node
sudo purge
# Reabrir Cursor
```

### CPU Warning

```bash
# Verificar
Activity Monitor → CPU tab:

🟢 OK: Cursor <30%, system_idle >50%
🟡 Atenção: Cursor 50-80%
🔴 Crítico: Cursor >80% por >2min
```

**Se 🟡 ou 🔴**:
```bash
# Matar processo pesado
pkill -f tsserver  # Restart TS server
# Ou restart Cursor
```

---

## 🔧 Quick Fixes

### "Cursor congelou"

```bash
killall Cursor
rm -rf ~/Library/Caches/Cursor
open -a Cursor
```

### "TypeScript lento demais"

```bash
# Verificar config
grep maxTsServerMemory .vscode/settings.json
# Deve ser 2048 (MacBook 2020)

# Se errado:
bash scripts/setup-macbook-2020.sh
```

### "npm install travando"

```bash
# Ctrl+C, depois:
npm install --legacy-peer-deps --no-audit
```

### "Metro não inicia"

```bash
rm -rf .expo node_modules/.cache
npm start:clear
```

---

## 📊 Performance Baseline

### Tempos Esperados (MacBook 2020)

| Comando | Tempo Normal | Preocupar Se |
|---------|--------------|--------------|
| `npm install` | 5-10min | >15min |
| `npm run typecheck` | 90-180s | >5min |
| `npm run quality-gate` | 3-5min | >8min |
| `npm test` | 20-40s | >2min |
| Abrir projeto Cursor | 20-40s | >2min |
| Edit → save → format | 1-2s | >5s |

**Se ultrapassar "Preocupar Se"**: Rodar script otimização ou reiniciar Mac.

---

## 🛑 Red Flags (Parar e Investigar)

```bash
□ Cursor >4GB RAM por >5min
□ Swap disk >6GB
□ Ventilador 100% por >10min
□ Disco <5GB livre
□ Edição lag >3s constantemente
```

**Se qualquer item acima**: 
1. Salvar trabalho (git commit)
2. Reiniciar Mac
3. Aplicar otimizações: `bash scripts/setup-macbook-2020.sh`
4. Se persistir: considerar upgrade hardware

---

## 💡 Pro Tips

### Economia de RAM

```bash
# Use terminal commands vs Cursor UI quando possível
git log --oneline -10  # vs Git panel
rg "searchterm" src/   # vs Cursor search
```

### Economia de Bateria

```bash
# Reduzir brightness
brightness 50  # Se tiver instalado

# Fechar abas invisíveis Chrome
# Desabilitar Slack auto-launch
```

### Backup Sanity

```bash
# Diário (automático via Time Machine)
# OU manual:
cp -r ~/Projects/nossa-maternidade ~/Desktop/backup-$(date +%Y%m%d)
```

---

## 🎯 Golden Rules

1. **Uma coisa de cada vez**  
   Editando? Sem Chrome.  
   Rodando tests? Sem Slack.
   
2. **Cloud > Local**  
   Builds sempre cloud.  
   Typecheck pode ser cloud (via Cloud Agent).
   
3. **Salvar frequentemente**  
   Cmd+S a cada mudança.  
   Commit small changes.
   
4. **Reiniciar diariamente**  
   Memory leaks acumulam.  
   Restart noturno = dia produtivo.
   
5. **Monitor RAM religiosamente**  
   Activity Monitor sempre visível.  
   Se >80% RAM: close something.

---

## 📅 Manutenção Semanal

```bash
# Sábado de manhã (30min)

# 1. Limpar caches
npm run clean:all
rm -rf ~/Library/Caches/Expo
rm -rf ~/Library/Developer/Xcode/DerivedData

# 2. Limpar disco
# System Settings → Storage → Manage
# Delete old downloads, caches

# 3. Reinstalar deps limpo
npm ci

# 4. Verificar performance
npm run typecheck  # Comparar com baseline

# 5. Backup
# Time Machine ou manual
```

---

## 🆘 Emergency Contacts

### Se nada funciona

1. **Reiniciar Mac** (resolve 80% dos problemas)
2. **Rodar otimizações**: `bash scripts/setup-macbook-2020.sh`
3. **Limpar tudo**: `npm run clean:all && npm ci`
4. **Documentar issue**: Criar arquivo `ISSUE_YYYY-MM-DD.md` com:
   - Sintomas
   - RAM/CPU usage (Activity Monitor screenshot)
   - Últimos comandos executados
   - Logs relevantes

### Recursos

- **Este projeto**: `MACBOOK_2020_SETUP.md`
- **Cursor docs**: https://cursor.sh/docs
- **Expo troubleshooting**: https://docs.expo.dev/troubleshooting
- **GitHub Cloud Agents**: (documentação oficial)

---

**Última atualização**: 2026-02-11  
**Válido para**: MacBook Air/Pro 2020, 8-16GB RAM  
**Revisão recomendada**: Mensal (ajustar baselines conforme macOS updates)
