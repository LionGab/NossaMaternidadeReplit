# Build Android

Trigger Android build com quality gate completo e regras de contexto.

## Fluxo Obrigatório

### 1. Verificar Contexto (Regra 70%)

```bash
# Verificar uso de contexto
# Se >= 70%: criar checkpoint + /compact
```

### 2. Entrevista Obrigatória

Antes de qualquer ação, perguntar:

1. **Profile**: development / preview / production?
2. **Auto-submit**: Se production, submeter automaticamente ao Google Play?
3. **Branch**: Em qual branch está? Qual objetivo?

### 3. Mostrar Evidência P0

Após entrevista, mostrar:

```
📋 P0 Checklist que será verificado:
1. Nenhum console.log em src/
2. Copy correto: "Quando você começou a tentar?"
3. Nenhuma cor hardcoded (#xxx, rgba)
```

### 4. Validar Copy/UI P0

**ANTES** do quality-gate:

- Verificar itens P0 do build-standards.mdc
- Se violar: INTERROMPER e listar arquivo:linha

### 5. Quality Gate

```bash
npm run quality-gate
```

### 6. Iniciar Build

```bash
# Preview (APK para testes)
npx eas build --platform android --profile preview

# Production (AAB para Google Play)
npx eas build --platform android --profile production
```

### 7. Persistir Resultado

- Criar checkpoint: `docs/builds/YYYY-MM-DD-android-{profile}.md`
- Atualizar: `docs/builds/NOTES.md` (3 bullets + links)
- Se erro: salvar log em `docs/builds/logs/`

## Anti-Log-Poluição

**NUNCA** colar logs completos no chat.
**SEMPRE**: trecho mínimo (erro + ~20 linhas) + link do log completo.

## Pré-requisitos

- EAS CLI autenticado (`npx eas login`)
- Keystore configurado (EAS gerencia automaticamente)
- `app.config.js` com package correto

## Profiles Disponíveis

| Profile     | Output    | Uso             |
| ----------- | --------- | --------------- |
| development | APK Debug | Dev local       |
| preview     | APK       | Testes internos |
| production  | AAB       | Google Play     |

## Troubleshooting

Se falhar:

1. Verificar logs: `npx eas build:list`
2. Verificar keystore: `npx eas credentials --platform android`
3. Limpar cache: `npx expo prebuild --clean`
