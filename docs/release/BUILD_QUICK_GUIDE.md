# 🚀 Guia Rápido de Build - iOS

## Build para TestFlight (Recomendado)

```bash
# Build automático (não precisa selecionar dispositivos)
npm run build:preview:ios:testflight
# ou
npx eas build --platform ios --profile ios_testflight
```

**Vantagens:**

- ✅ Não precisa selecionar dispositivos
- ✅ Vai direto para TestFlight
- ✅ Qualquer testador pode instalar

---

## Build Ad Hoc (Preview - Atual)

```bash
# Build para instalação direta em dispositivos específicos
npm run build:preview:ios
# ou
npx eas build --platform ios --profile preview
```

**Quando usar:**

- Para testar em dispositivos específicos
- Para distribuição interna limitada
- Para testes antes do TestFlight

**⚠️ IMPORTANTE:** Precisa selecionar dispositivos durante o build.

---

## Como Continuar o Build Atual

### Se estiver no processo de seleção de dispositivos:

1. **Pressione Espaço** para selecionar/desselecionar dispositivos
2. **Pressione Enter** para confirmar e continuar
3. O build continuará automaticamente

### Se quiser cancelar e usar TestFlight:

1. **Pressione Ctrl+C** para cancelar
2. Execute:
   ```bash
   npx eas build --platform ios --profile ios_testflight
   ```

---

## Profiles Disponíveis

| Profile          | Distribuição           | Dispositivos          | Uso           |
| ---------------- | ---------------------- | --------------------- | ------------- |
| `preview`        | Internal (Ad Hoc)      | ✅ Precisa selecionar | Testes locais |
| `ios_testflight` | App Store (TestFlight) | ❌ Não precisa        | TestFlight    |
| `production`     | App Store (Store)      | ❌ Não precisa        | Produção      |

---

## Dois Targets Detectados

É normal ter dois targets:

1. **NossaMaternidade** (app principal)
   - Bundle ID: `br.com.nossamaternidade.app`

2. **Nossa Maternidade** (extensão ExtensionKit)
   - Bundle ID: `br.com.nossamaternidade.app.Nossa-Maternidade`

**Não se preocupe:** O EAS gerencia ambos automaticamente.

---

## Próximos Passos Após Build

1. **Aguardar build completar** (~15-30 min)
2. **Download automático** ou via EAS Dashboard
3. **Instalar:**
   - **Ad Hoc:** Via link de download ou TestFlight
   - **TestFlight:** Via App Store Connect → TestFlight

---

**Última atualização:** Janeiro 2026
