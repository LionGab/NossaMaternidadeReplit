# 🧹 Guia de Limpeza - Liberar Memória e Espaço

**Data:** 10 Jan 2026
**Contexto:** Sistema com 8GB RAM, 7.21GB usados, 3.48GB swap (alta pressão de memória)

---

## 📊 Análise de Espaço

### Diretórios Grandes Encontrados

| Diretório       | Tamanho    | Arquivos | Remover?   | Prioridade  |
| --------------- | ---------- | -------- | ---------- | ----------- |
| `coverage/`     | **14 MB**  | 296      | ✅ **SIM** | 🔴 **ALTA** |
| `docs/`         | 23 MB      | ~279     | ⚠️ Parcial | 🟡 Média    |
| `node_modules/` | ~500MB-1GB | Muitos   | ❌ Não     | -           |

---

## 🎯 Recomendações de Limpeza

### ✅ REMOVER AGORA (Libera ~14-20 MB)

#### 1. Coverage Reports (14 MB, 296 arquivos)

**Por que remover:**

- ✅ Gerado automaticamente (`npm test`)
- ✅ Já está no `.gitignore`
- ✅ Pode ser regenerado quando necessário

**Como remover:**

```bash
rm -rf coverage/
```

**Ou via npm:**

```bash
npm run clean  # Se tiver script configurado
```

---

#### 2. Documentos Temporários/Arquivados (Estimado: 5-10 MB)

**Remover arquivos antigos/sessões:**

```bash
# Sessões antigas (podem ser arquivadas)
rm -f SESSION_STATUS.md
rm -f RESUMO_CORRECOES.md  # Se já foi aplicado
rm -f RESUMO_FINAL_STATUS.md  # Se já foi processado
rm -f STATUS_FINAL_LANCAMENTO.md  # Se já foi lançado
rm -f SUPABASE_BLOCKERS_*.md  # Se já foram resolvidos
```

**Ou mover para archive:**

```bash
mkdir -p archive/docs-old
mv SESSION_STATUS.md RESUMO_*.md STATUS_*.md SUPABASE_BLOCKERS_*.md archive/docs-old/
```

---

### ⚠️ CONSIDERAR REMOVER (Se não precisar)

#### 3. Relatórios de Auditoria Antigos (docs/\_reports/)

**Arquivos grandes:**

- `docs/AUDIT_A11Y_DEEP_REPORT.md` (236 KB) - **O maior!**
- `docs/_reports/*.md` (vários relatórios)

**Ação:**

```bash
# Se já foram processados, arquivar:
mkdir -p archive/audits
mv docs/AUDIT_A11Y_DEEP_REPORT.md docs/_reports/ archive/audits/
```

---

#### 4. Documentos de Setup Windows (Se você só usa macOS)

**Arquivos:**

- `SETUP_WINDOWS_COMPLETO.md`
- `SETUP_WINDOWS_REDESIGN.md`
- `COMANDOS_WINDOWS.md`
- `docs/SETUP_WINDOWS.md`

**Ação:**

```bash
mkdir -p archive/windows-docs
mv SETUP_WINDOWS*.md COMANDOS_WINDOWS.md docs/SETUP_WINDOWS.md archive/windows-docs/
```

---

### ❌ NÃO REMOVER (Importantes)

- `README.md` - Documentação principal
- `docs/FRONTEND_BEST_PRACTICES_2026.md` - Referência ativa
- `docs/PLANO_LANCAMENTO_*.md` - Em uso
- `package.json`, `tsconfig.json` - Essenciais
- `src/` - Código fonte
- `ios/`, `android/` - Builds nativos

---

## 🚀 Script de Limpeza Rápida

```bash
#!/bin/bash
# Limpeza rápida - remove apenas o seguro

echo "🧹 Limpando arquivos temporários..."

# 1. Coverage (pode regenerar)
rm -rf coverage/
echo "✅ Removido: coverage/ (14 MB)"

# 2. Node modules cache (se existir)
rm -rf .npm
rm -rf node_modules/.cache
echo "✅ Removido: caches npm"

# 3. Build artifacts antigos
find . -name "*.ipa" -type f -mtime +30 -delete 2>/dev/null
find . -name "*.apk" -type f -mtime +30 -delete 2>/dev/null
echo "✅ Removido: build artifacts antigos (>30 dias)"

# 4. Logs temporários
find . -name "*.log" -type f -mtime +7 -delete 2>/dev/null
echo "✅ Removido: logs antigos (>7 dias)"

echo ""
echo "✨ Limpeza concluída!"
du -sh . 2>/dev/null
```

**Salvar como:** `scripts/quick-clean.sh`
**Executar:** `bash scripts/quick-clean.sh`

---

## 📋 Checklist de Limpeza Manual

### Prioridade Alta (Fazer Agora)

- [ ] Remover `coverage/` (14 MB)
- [ ] Limpar caches npm/yarn
- [ ] Remover `.ipa` antigos (se houver)

### Prioridade Média (Se precisar de mais espaço)

- [ ] Arquivar relatórios de auditoria antigos
- [ ] Arquivar documentos de sessões antigas
- [ ] Arquivar docs Windows (se só usa macOS)

### Prioridade Baixa (Opcional)

- [ ] Limpar logs antigos
- [ ] Compactar `archive/`
- [ ] Review de `docs/` para duplicatas

---

## 💡 Dicas Adicionais

### Para Liberar Mais Espaço

1. **Limpar Xcode DerivedData:**

   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*
   ```

   (Pode liberar 1-5 GB!)

2. **Limpar Caches Homebrew:**

   ```bash
   brew cleanup --prune=all
   ```

3. **Limpar Caches CocoaPods:**

   ```bash
   pod cache clean --all
   ```

4. **Verificar espaço em disco:**
   ```bash
   du -sh ~/Library/Caches/*
   ```

---

## ⚠️ Atenção

**NUNCA remova sem backup:**

- `node_modules/` (reinstala com `npm install`)
- `ios/`, `android/` (regenera com `npx expo prebuild`)
- Arquivos em `src/`, `supabase/`
- `.git/`

---

## 📊 Resultado Esperado

Após limpeza recomendada:

- **Espaço liberado:** ~15-25 MB (docs + coverage)
- **Arquivos removidos:** ~300-400 arquivos
- **Impacto na memória:** Baixo (arquivos em disco não afetam RAM diretamente)

**Para reduzir uso de RAM:**

- Fechar abas/pastas desnecessárias no Cursor
- Fechar processos pesados (CleanMyMac usa 361 MB)
- Considerar aumentar swap ou RAM física

---

**Última atualização:** 10 Jan 2026
