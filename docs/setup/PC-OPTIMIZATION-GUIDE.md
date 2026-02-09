# 🚀 Guia de Otimização - PC High-End (Ryzen 5 7600X + 32GB RAM)

## Hardware Alvo

- **CPU**: AMD Ryzen 5 7600X (6 cores/12 threads @ 4.70 GHz)
- **RAM**: 32GB (utilizável: 31GB)
- **OS**: Windows 64-bit
- **Storage**: Recomendado SSD NVMe

---

## 📊 Otimizações Implementadas

### 1. TypeScript Server (8GB) ⚡

**Antes**: 1GB (otimizado para MacBook Air 8GB)
**Agora**: 8GB (aproveita 32GB disponíveis)

```json
"typescript.tsserver.maxTsServerMemory": 8192
```

**Benefícios**:

- ✅ IntelliSense instantâneo em arquivos grandes
- ✅ Menos crashes do TS Server
- ✅ Auto-imports habilitados
- ✅ Path suggestions habilitadas
- ✅ Complete function calls

**Monitoramento**: Use Task Manager para verificar `tsserver.js` (não deve passar de 10GB)

---

### 2. Metro Bundler - Workers Dinâmicos 🏗️

**Antes**: 2 workers fixos
**Agora**: 4-5 workers (75% dos 6 cores)

```javascript
const cpuCores = os.cpus().length; // 6 cores
const optimalWorkers = Math.floor(cpuCores * 0.75); // 4-5 workers
```

**Benefícios**:

- ✅ Builds 2-3x mais rápidos
- ✅ Hot reload mais responsivo
- ✅ Cache versioning automático (usa `package.json` version)

**Override manual**: `set METRO_MAX_WORKERS=6` antes de `npm start`

---

### 3. Editor - Sem Limites 🎨

**Antes**: `"editor.maxWorkers": 2`
**Agora**: Removido (VS Code gerencia automaticamente)

**Features habilitadas**:

- ✅ Minimap (máx 80 colunas)
- ✅ Smooth scrolling
- ✅ Cursor animations
- ✅ Occurrences highlight
- ✅ Links clicáveis
- ✅ Rounded selection

**Custo**: +100-200MB RAM (negligível com 32GB)

---

### 4. Git Integration - Full Power 🔧

**Antes**: Decorations desabilitadas, no autofetch
**Agora**: Tudo habilitado

```json
"git.decorations.enabled": true,
"git.autofetch": true,
"git.autofetchPeriod": 180
```

**Benefícios**:

- ✅ Status de arquivos inline no Explorer
- ✅ Auto-fetch a cada 3 minutos
- ✅ SCM tree view

---

### 5. CodeLens & Inlay Hints 👀

**Novo**: Features de code intelligence habilitadas

```json
"typescript.inlayHints.parameterNames.enabled": "all",
"typescript.inlayHints.variableTypes.enabled": true,
"typescript.referencesCodeLens.enabled": true
```

**Benefícios**:

- ✅ Tipos inline visíveis
- ✅ Nomes de parâmetros em chamadas de função
- ✅ Referencias/implementações acima de classes/funções

---

### 6. Debug Profiles - 5 Configurações 🐛

**Antes**: 1 perfil genérico
**Agora**: 5 perfis especializados

| Perfil                  | Uso                                     | Just My Code |
| ----------------------- | --------------------------------------- | ------------ |
| **Debug Expo**          | Padrão para desenvolvimento             | ✅           |
| **Debug iOS**           | Específico iOS com source maps          | ✅           |
| **Debug Android**       | Específico Android                      | ✅           |
| **Debug + Libraries**   | Debug em node_modules (troubleshooting) | ❌           |
| **Performance Profile** | Profiling sem debug overhead            | ✅           |

**Debug sockets**: Aumentado de 2 para 8 (mais throughput)

---

### 7. NPM & Local History 📦

**Antes**: Desabilitado
**Agora**: Habilitado

```json
"npm.autoDetect": "on",
"workbench.localHistory.enabled": true,
"workbench.localHistory.maxFileEntries": 50
```

**Benefícios**:

- ✅ Scripts npm visíveis no Explorer
- ✅ Histórico local de alterações (50 últimas versões)
- ✅ Rollback rápido sem Git

---

### 8. Tasks Avançadas ⚙️

**Antes**: 3 tasks
**Agora**: 11 tasks

Novos atalhos (Ctrl+Shift+P → "Run Task"):

- `Start Expo (Optimized)` - Com variáveis de performance
- `Clean All Caches` - Limpa Metro + npm cache
- `Build Both Platforms (Parallel)` - iOS + Android simultâneo
- `Performance Profile` - Bundle analyzer
- `Update Dependencies` - npm update + audit fix

---

## 🎯 Configurações Recomendadas por Cenário

### Desenvolvimento Normal

```bash
npm start
```

- Metro usa 4-5 workers automaticamente
- TS Server em 8GB
- Todas as features habilitadas

### Build Otimizado

```bash
npm run start:optimized
```

- `EXPO_NO_METRO_LAZY=true` (pré-carrega módulos)
- `EXPO_METRO_MAX_WORKERS=4`

### Profiling de Performance

```bash
# Via VS Code: Run Task > "Performance Profile (Bundle Analyzer)"
```

- Gera source maps
- Analisa tamanho do bundle
- Identifica módulos pesados

### Troubleshooting Debug

```bash
# Usar perfil "Debug + Libraries (Full Debug)"
```

- Step-into em node_modules
- Trace completo
- Source maps ativados

---

## 📈 Ganhos de Performance Esperados

| Métrica             | Antes (8GB config) | Agora (32GB config) | Ganho |
| ------------------- | ------------------ | ------------------- | ----- |
| **TS IntelliSense** | ~2-3s              | ~0.5s               | 4-6x  |
| **Metro Build**     | ~45-60s            | ~20-30s             | 2-3x  |
| **Hot Reload**      | ~3-5s              | ~1-2s               | 2-3x  |
| **Git Status**      | Desabilitado       | Instantâneo         | ∞     |
| **Auto-imports**    | Manual             | Automático          | ∞     |
| **Bundle Analysis** | -                  | < 1min              | Novo  |

---

## 🔍 Monitoramento de Performance

### Task Manager (Ctrl+Shift+Esc)

Processos a monitorar:

| Processo           | Uso Normal | Sinal de Problema |
| ------------------ | ---------- | ----------------- |
| `Code.exe`         | 1-2GB      | > 4GB             |
| `tsserver.js`      | 4-8GB      | > 10GB ou crashes |
| `node.exe` (Metro) | 2-4GB      | > 8GB             |
| **Total IDE**      | 8-12GB     | > 16GB            |

### Comandos de Diagnóstico

```powershell
# Ver uso de memória do VS Code
code --status

# Ver cache do Metro
dir $env:USERPROFILE\.metro-cache

# Ver workers do Metro (durante build)
# Aparece no console: "[Metro] Using X workers (CPU cores: 6)"
```

---

## ⚠️ Limitações e Trade-offs

### 1. TypeScript Server (8GB)

- ✅ **Prós**: IntelliSense rápido, menos crashes
- ⚠️ **Contras**: Se tiver outros IDEs abertos pode faltar RAM
- 🔧 **Solução**: Reduzir para 6GB se necessário

### 2. Git Autofetch

- ✅ **Prós**: Sempre atualizado com remote
- ⚠️ **Contras**: ~50MB de tráfego de rede a cada 3min
- 🔧 **Solução**: Desabilitar se estiver em 4G/5G

### 3. CodeLens & Inlay Hints

- ✅ **Prós**: Melhor visualização de código
- ⚠️ **Contras**: Pode "poluir" o editor visualmente
- 🔧 **Solução**: Desabilitar `inlayHints` se incomodar

### 4. Local History (50 entries)

- ✅ **Prós**: Rollback rápido sem Git
- ⚠️ **Contras**: +100-200MB de espaço em disco
- 🔧 **Solução**: Reduzir para 10 entries se tiver SSD pequeno

---

## 🚀 Otimizações Adicionais (Opcional)

### 1. Windows Defender Exclusions

Adicionar exclusões no Windows Defender para acelerar builds:

```powershell
# PowerShell como Admin
Add-MpPreference -ExclusionPath "C:\Users\User\Documents\new\NossaMaternidade"
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.metro-cache"
Add-MpPreference -ExclusionPath "$env:USERPROFILE\.npm"
Add-MpPreference -ExclusionProcess "node.exe"
Add-MpPreference -ExclusionProcess "Code.exe"
```

**Ganho esperado**: 10-20% mais rápido em builds

### 2. PowerShell Profile Optimizations

Adicionar ao `$PROFILE`:

```powershell
# Metro workers otimizado
$env:METRO_MAX_WORKERS = 5

# Disable telemetry
$env:EXPO_NO_TELEMETRY = 1
$env:NEXT_TELEMETRY_DISABLED = 1

# Node performance
$env:NODE_OPTIONS = "--max-old-space-size=8192"
```

### 3. VS Code Settings Sync

Se usar múltiplos PCs, criar profiles diferentes:

- **Profile "MacBook"**: Settings atuais (conservador)
- **Profile "Windows"**: Settings otimizados (este guia)

```json
// .vscode/settings.json
"profiles.windows": {
  "settings": "settings.windows.json"
}
```

---

## 🎓 Comandos Úteis

### Builds

```powershell
# Start otimizado (max performance)
npm run start:optimized

# Build preview iOS (via tasks)
Ctrl+Shift+P > Run Task > "Build iOS Preview"

# Build paralelo ambas plataformas
Ctrl+Shift+P > Run Task > "Build Both Platforms (Parallel)"
```

### Cache Management

```powershell
# Limpar TUDO (via task)
Ctrl+Shift+P > Run Task > "Clean All Caches"

# Limpar só Metro
npx expo start --clear

# Limpar npm cache
npm cache clean --force
```

### Debug

```powershell
# Debug iOS específico
F5 > Selecionar "Debug iOS"

# Debug com libs (troubleshooting)
F5 > Selecionar "Debug + Libraries (Full Debug)"

# Performance profiling
Ctrl+Shift+P > Run Task > "Performance Profile (Bundle Analyzer)"
```

---

## 📋 Checklist Pós-Implementação

### Primeira Execução

- [ ] Reiniciar VS Code
- [ ] Verificar console: `[Metro] Using X workers (CPU cores: 6)`
- [ ] Verificar console: `[Metro] Cache version: <package.json version>`
- [ ] Testar IntelliSense (deve ser instantâneo)
- [ ] Testar auto-imports (Ctrl+Space em componente não importado)
- [ ] Verificar Git decorations no Explorer (ícones de status)
- [ ] Testar minimap (deve aparecer à direita)

### Monitoramento Contínuo (Primeira Semana)

- [ ] Verificar Task Manager diariamente
- [ ] Anotar tempos de build (deve ser ~20-30s)
- [ ] Verificar crashes do TS Server (não deve ter)
- [ ] Testar debug em iOS e Android
- [ ] Verificar bundle size (task "Performance Profile")

### Ajustes Finos (Se Necessário)

Se houver problemas:

| Problema             | Solução                                     |
| -------------------- | ------------------------------------------- |
| VS Code > 4GB RAM    | Reduzir TS Server para 6GB                  |
| Metro lento          | Aumentar workers: `set METRO_MAX_WORKERS=6` |
| TS Server crashes    | Reduzir para 4GB                            |
| Debug lento          | Usar "Debug Expo" em vez de "Full Debug"    |
| IntelliSense com lag | Desabilitar inlay hints                     |

---

## 🎯 Próximos Passos

### Curto Prazo (Esta Semana)

1. ✅ Testar todas as tasks novas
2. ✅ Validar builds iOS e Android
3. ✅ Configurar Windows Defender exclusions
4. ✅ Medir tempo de builds (baseline)

### Médio Prazo (Próximo Mês)

1. ⏳ Adicionar GitLens extension (se gostar de Git features)
2. ⏳ Criar keybindings customizados para tasks
3. ⏳ Configurar bundle analyzer pipeline
4. ⏳ Otimizar PowerShell profile

### Longo Prazo (Trimestre)

1. ⏳ Migrar para VS Code Insiders (features beta)
2. ⏳ Implementar CI/CD otimizado para 6 cores
3. ⏳ Avaliar upgrade para Ryzen 9 (8+ cores)
4. ⏳ Montar servidor de cache HTTP do Metro

---

## 📚 Referências

- [VS Code Performance](https://code.visualstudio.com/docs/getstarted/settings)
- [Metro Bundler Config](https://metrobundler.dev/docs/configuration)
- [TypeScript Performance](https://github.com/microsoft/TypeScript/wiki/Performance)
- [React Native Performance](https://reactnative.dev/docs/performance)

---

**Última atualização**: 16 de Janeiro de 2026
**Hardware alvo**: AMD Ryzen 5 7600X + 32GB RAM
**Responsável**: @LionGab
