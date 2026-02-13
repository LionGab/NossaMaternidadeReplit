# Otimização de Memória — Nossa Maternidade

Guia rápido para reduzir uso de RAM durante o desenvolvimento.

---

## Comandos Rápidos

| Comando                      | Descrição                                 |
| ---------------------------- | ----------------------------------------- |
| `npm run reduce:ram`         | Limpeza geral (sem sudo) + opção de purge |
| `npm run clean:ram-no-sudo`  | Limpeza segura, sem senha                 |
| `npm run optimize:emergency` | Limpeza agressiva (para emergências)      |
| `npm run optimize:cursor`    | Limpa cache do Cursor IDE                 |
| `npm run start:memory`       | Expo com 2 workers (menos RAM)            |
| `npm run monitor:ram`        | Ver uso atual de memória                  |

---

## Fluxo Recomendado (8GB RAM)

1. **Antes de desenvolver**

   ```bash
   npm run reduce:ram
   npm run start:memory   # em vez de npm start
   ```

2. **Quando o sistema travar**

   ```bash
   npm run optimize:emergency
   # Reinicie o Cursor
   ```

3. **Monitorar uso**
   ```bash
   npm run monitor:ram
   # ou em background:
   npm run monitor:macos:memory:daemon
   ```

---

## O que cada script faz

### `reduce:ram`

- Limpa caches do projeto (Metro, Expo, node_modules/.cache)
- Para processos Expo em execução
- Limpa npm, Metro global
- Lista processos pesados (Chrome, Cursor Helper)
- Opcional: purge do sistema (macOS, requer sudo)

### `start:memory`

- Roda Expo com `METRO_MAX_WORKERS=2` (padrão usa ~75% dos cores)
- Reduz ~500MB–1GB de RAM do Metro

### `optimize:emergency`

- Para Expo/Metro
- Limpa todos os caches
- Purge do sistema (sudo)
- Use quando o Mac estiver travando

### `optimize:cursor`

- Limpa cache do Cursor (Cache, CachedData, Code Cache)
- Limpa caches do projeto
- **Reinicie o Cursor** depois para liberar ~2GB

---

## Dicas para 8GB RAM

1. **Mantenha aberto apenas**: Cursor + Terminal + Expo + Simulador (quando testar)
2. **Feche**: Chrome, Slack, Discord quando não usar
3. **Use** `npm run start:memory` em vez de `npm start`
4. **Reinicie o Cursor** a cada 2–3 horas de uso intenso
5. **Feche o Simulador** quando não estiver testando (~400MB)

---

## Variáveis de ambiente

Para forçar menos workers no Metro em qualquer comando:

```bash
METRO_MAX_WORKERS=2 npm start
METRO_MAX_WORKERS=1 npm start   # mínimo (mais lento)
```
