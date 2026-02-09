# Scripts de Otimização macOS

Scripts para otimizar o MacBook Air M1 (8GB RAM) para desenvolvimento com Cursor IDE.

## Scripts Disponíveis

### `memory-optimization.sh`

Limpa caches e otimiza uso de memória.

```bash
bash scripts/macos/memory-optimization.sh
```

### `system-optimization.sh`

Aplica otimizações do sistema macOS (animações, Spotlight, energia).

```bash
bash scripts/macos/system-optimization.sh
```

**⚠️ Requer sudo para algumas otimizações**

### `cleanup-cache.sh`

Limpeza completa de caches (Cursor, Node, Metro, Expo).

```bash
bash scripts/macos/cleanup-cache.sh
```

### `monitor-memory.sh`

Monitora uso de memória e alerta quando alto.

**Uso único:**

```bash
bash scripts/macos/monitor-memory.sh
```

**Modo daemon (contínuo):**

```bash
bash scripts/macos/monitor-memory.sh --daemon
```

### `monitor-system.sh`

Monitora sistema completo (memória, Cursor, disco) e otimiza automaticamente.

```bash
bash scripts/macos/monitor-system.sh
```

Logs salvos em: `~/.cursor-optimization.log`

### `optimize-dns.sh`

Otimiza DNS usando Cloudflare (1.1.1.1).

```bash
bash scripts/macos/optimize-dns.sh
```

**⚠️ Requer sudo para limpar cache DNS**

## Execução Automática

Para executar monitoramento automaticamente, configure um Launch Agent:

```bash
# Copiar template
cp scripts/macos/com.nossamaternidade.optimization.plist ~/Library/LaunchAgents/

# Carregar
launchctl load ~/Library/LaunchAgents/com.nossamaternidade.optimization.plist
```

## Recomendações

- Execute `memory-optimization.sh` diariamente ao final do dia
- Execute `monitor-system.sh` a cada hora (via Launch Agent)
- Execute `cleanup-cache.sh` semanalmente
- Execute `system-optimization.sh` uma vez (após instalação)
