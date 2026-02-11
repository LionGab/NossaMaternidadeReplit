# 🚀 Guia Rápido: Otimização de RAM (10 fev 2026)

**MacBook M1 8GB | Swap reduzido de 3,6 GB → 1,4 GB**

---

## ⚡ Ação Rápida (Agora!)

```bash
# 1. Limpar MCP servers órfãos (~300-400 MB)
npm run ram:quick-clean

# 2. Limpar memória comprimida (requer senha)
sudo purge

# 3. Verificar swap (meta: < 1 GB)
sysctl vm.swapusage
```

---

## 📚 Documentação Completa

- **[RESUMO_OTIMIZACAO_RAM.md](RESUMO_OTIMIZACAO_RAM.md)** ⭐ Comece aqui! Resumo executivo
- **[RELATORIO_OTIMIZACAO_RAM_2026-02-10.md](RELATORIO_OTIMIZACAO_RAM_2026-02-10.md)** - Diagnóstico detalhado
- **[OTIMIZACAO_RAM_M1_8GB.md](OTIMIZACAO_RAM_M1_8GB.md)** - Guia completo original
- **[aliases-ram-optimization.sh](aliases-ram-optimization.sh)** - Aliases úteis

---

## 🎯 Rotina Diária

### Manhã

```bash
sysctl vm.swapusage  # Se > 1 GB: npm run ram:quick-clean && sudo purge
```

### Durante o Dia (a cada 2-3h)

```bash
sudo purge
```

---

## 🔧 Scripts Criados

| Comando                        | Função                  |
| ------------------------------ | ----------------------- |
| `npm run ram:quick-clean`      | Mata MCP servers órfãos |
| `npm run optimize:macos:cache` | Limpa caches do projeto |

---

**Status**: ✅ Otimizado (swap 1,4 GB)  
**Última atualização**: 10 fev 2026, 23:56
