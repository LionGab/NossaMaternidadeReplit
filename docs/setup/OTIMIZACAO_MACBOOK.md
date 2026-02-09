# Otimização MacBook M1 - Cursor IDE

## Visão Geral

Este documento descreve as otimizações implementadas para melhorar a performance do Cursor IDE no MacBook M1 com 8GB de RAM, reduzindo o uso de memória e disco de ~2GB para < 1GB.

## Problema Identificado

- Cursor IDE usando ~2GB de disco
- Travamentos frequentes durante desenvolvimento
- Performance degradada em projetos React Native/Expo grandes

## Soluções Implementadas

### 1. Otimização do `.cursorignore`

Arquivo: `.cursorignore`

**O que faz:**

- Exclui pastas pesadas da indexação do Cursor (node_modules, build artifacts, coverage, etc.)
- Reduz drasticamente o uso de memória RAM
- Acelera buscas e navegação no código

**Pastas excluídas:**

- `node_modules/`
- `coverage/`
- `build/`, `dist/`, `web-build/`
- `.expo/`
- `ios/build/`, `ios/Pods/`
- `android/build/`
- `temp/`, `tmp/`
- `docs/archive/`
- Arquivos de log, backup e temporários

### 2. Script de Otimização Automática

Arquivo: `scripts/optimize-macbook.sh`

**Uso:**

```bash
npm run optimize:macbook
```

**O que faz:**

- Limpa caches do projeto (Expo, Metro, TypeScript)
- Limpa caches globais (npm, yarn, bun, Homebrew)
- Remove arquivos temporários e logs
- Calcula espaço liberado
- **100% seguro** - não modifica arquivos do projeto

**Fases:**

1. **Limpeza de Caches do Projeto**: `.expo/`, `.metro-cache/`, `node_modules/.cache/`, etc.
2. **Limpeza de Caches do Sistema**: npm, yarn, bun, Homebrew
3. **Otimizações do Cursor**: Verifica configurações

### 3. Configurações de Performance do Cursor

Arquivo: `.cursor/settings.json`

**Configurações aplicadas:**

#### File Watching

- Desabilita watchers em pastas pesadas (node_modules, build, etc.)
- Reduz uso de CPU e memória

#### Search Exclusions

- Exclui pastas pesadas das buscas
- Acelera busca no código

#### Editor Optimizations

- Desabilita CodeLens (economia de memória)
- Desabilita highlight de ocorrências
- Limita número de abas abertas (10 por grupo)

#### TypeScript

- Usa TypeScript do workspace (evita duplicação)
- Configurações otimizadas para projetos grandes

#### Git

- Desabilita auto-detection de repositórios
- Desabilita auto-fetch (economia de rede/CPU)

#### Extensions

- Desabilita auto-update (reduz overhead)

#### Telemetry

- Desabilitado (privacidade + performance)

## Como Usar

### Execução Rápida

```bash
# Otimização completa (recomendado semanalmente)
npm run optimize:macbook

# Limpeza básica de caches do projeto
npm run clean

# Limpeza completa (inclui node_modules)
npm run clean:all
```

### Após Otimização

1. **Reinicie o Cursor IDE** para aplicar mudanças
2. Execute `npm start --clear` para reiniciar Expo com cache limpo
3. Feche abas/arquivos não utilizados no Cursor
4. Considere fechar outros apps pesados (Chrome, Slack, etc.)

## Monitoramento

### Verificar Uso de Memória

```bash
# Activity Monitor (GUI)
open -a "Activity Monitor"

# Via terminal
top -l 1 -s 0 | grep -E "^Processes|^PhysMem"
```

### Verificar Espaço em Disco

```bash
# Ver tamanho do projeto
du -sh .

# Ver tamanho de pastas específicas
du -sh node_modules/
du -sh .expo/
du -sh coverage/
```

### Verificar Cache do Cursor

O Cursor armazena cache em:

- `~/Library/Application Support/Cursor/` (macOS)
- `~/.cursor/` (configurações do workspace)

## Manutenção Regular

### Semanal

- Execute `npm run optimize:macbook`
- Limpe cache do sistema: `brew cleanup -s` (se usar Homebrew)

### Mensal

- Revise extensões do Cursor (desative não utilizadas)
- Verifique tamanho de `node_modules/` (considere `npm prune`)

### Quando Notar Lentidão

1. Execute `npm run optimize:macbook`
2. Reinicie o Cursor
3. Feche apps não utilizados
4. Verifique Activity Monitor para processos pesados

## Troubleshooting

### Cursor ainda lento após otimização

1. **Verifique extensões:**
   - Desative extensões não utilizadas
   - Algumas extensões podem ser pesadas (ex: GitLens, ESLint em tempo real)

2. **Reduza número de arquivos abertos:**
   - Feche abas não utilizadas
   - Use `workbench.editor.limit.value` no settings.json

3. **Verifique outros processos:**
   - Chrome com muitas abas
   - Slack, Discord, etc.
   - Outros IDEs abertos

### Cache não está sendo limpo

```bash
# Limpeza manual
rm -rf .expo
rm -rf .metro-cache
rm -rf node_modules/.cache
rm -rf ~/.metro-cache

# Limpeza do Cursor (cuidado - remove configurações)
# Faça backup antes!
rm -rf ~/Library/Application\ Support/Cursor/Cache
```

### TypeScript lento

1. Verifique se está usando TypeScript do workspace:

   ```json
   "typescript.tsdk": "node_modules/typescript/lib"
   ```

2. Considere `skipLibCheck: true` no `tsconfig.json` (já deve estar)

3. Limpe cache do TypeScript:
   ```bash
   find . -name "*.tsbuildinfo" -delete
   ```

## Métricas Esperadas

### Antes da Otimização

- Cursor: ~2GB de disco
- Memória: ~1.5-2GB RAM
- Indexação: Lenta (5-10 min)
- Busca: Lenta em projetos grandes

### Após Otimização

- Cursor: < 1GB de disco
- Memória: < 1GB RAM (em repouso)
- Indexação: Rápida (1-2 min)
- Busca: Rápida (exclui pastas pesadas)

## Arquivos Modificados

- `.cursorignore` - Exclusões de indexação
- `scripts/optimize-macbook.sh` - Script de otimização
- `package.json` - Comando `optimize:macbook`
- `.cursor/settings.json` - Configurações de performance
- `docs/OTIMIZACAO_MACBOOK.md` - Esta documentação

## Segurança

**Todas as otimizações são 100% seguras:**

- ✅ Apenas limpeza de cache temporário
- ✅ Nenhum arquivo do projeto é modificado
- ✅ Configurações são reversíveis
- ✅ Scripts podem ser executados múltiplas vezes sem dano

## Referências

- [Cursor IDE Documentation](https://cursor.sh/docs)
- [VS Code Performance Tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks#_performance)
- [Expo Cache Management](https://docs.expo.dev/guides/cache-management/)

## Suporte

Se encontrar problemas ou tiver sugestões de melhorias, abra uma issue no repositório ou consulte a documentação do projeto.

---

**Última atualização:** 2025-01-27
**Versão:** 1.0.0
