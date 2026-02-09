# Nossa Maternidade - Setup de Producao

> Documento de referencia para configuracao de lojas e monetizacao.
> Atualizado em: 03/01/2026

---

## Identificadores do App

| Plataforma          | Identificador                 |
| ------------------- | ----------------------------- |
| **iOS Bundle ID**   | `br.com.nossamaternidade.app` |
| **Android Package** | `com.nossamaternidade.app`    |

---

## Google Cloud - Service Account

| Campo                     | Valor                                                                        |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Project ID**            | `nossa-maternidade-e1aa5`                                                    |
| **Project Number**        | `117705962617874124818`                                                      |
| **Service Account Name**  | `revenuecat-service-account`                                                 |
| **Service Account Email** | `revenuecat-service-account@nossa-maternidade-e1aa5.iam.gserviceaccount.com` |
| **JSON Key File**         | `nossa-maternidade-e1aa5-639ee3ab217c.json`                                  |
| **Data de Criacao**       | 03/01/2026                                                                   |
| **Status**                | ATIVA                                                                        |

### Seguranca do JSON Key

- **NUNCA** commitar no git
- **NUNCA** compartilhar publicamente
- Guardar em local seguro (password manager, vault)
- Renomear para: `nossa-maternidade-service-account.json`

---

## Google Play Console

| Campo              | Valor                           |
| ------------------ | ------------------------------- |
| **Developer ID**   | `5390773732388254763`           |
| **Developer Name** | Gabriel Sfreddo Johner Vesz     |
| **Email**          | contato@primeliontecnologia.com |
| **App ID**         | `4973509270196575912`           |

### Produtos de Assinatura (a criar)

| Product ID                  | Preco    | Periodo | Trial             |
| --------------------------- | -------- | ------- | ----------------- |
| `nossa_maternidade_monthly` | R$ 19,99 | Mensal  | 7 dias (opcional) |
| `nossa_maternidade_yearly`  | R$ 79,99 | Anual   | 7 dias (opcional) |

---

## RevenueCat

### Configuracao Pendente

1. Criar projeto "Nossa Maternidade"
2. Conectar Google Play:
   - Upload do JSON key
   - Selecionar produtos
3. Conectar App Store (quando disponivel)
4. Mapear entitlements:
   - `premium` -> ambos produtos
5. Copiar API keys para `.env`

### Variaveis de Ambiente

```bash
# RevenueCat (ja configuradas no .env.local)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=<chave_ios>
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=<chave_android>
```

---

## Checklist de Lancamento

### Google Play

- [x] App criado no Google Play Console
- [x] Perfil de Pagamentos configurado (Primeli Tecnologia)
- [x] Service Account criado no Google Cloud
- [x] JSON key gerado e baixado
- [ ] JSON key salvo e renomeado localmente
- [ ] Build Android completado
- [ ] AAB uploaded para Google Play
- [ ] Produtos de assinatura criados
- [ ] Service Account vinculado ao Google Play
- [ ] RevenueCat configurado e conectado

### App Store (iOS)

- [ ] App criado no App Store Connect
- [ ] Bundle ID registrado
- [ ] Produtos de assinatura criados (mesmos IDs)
- [ ] RevenueCat conectado

---

## Comandos Uteis

### Builds

```bash
# Preview (teste interno)
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Production (lojas)
eas build --platform android --profile production
eas build --platform ios --profile production
```

### Verificacao

```bash
# Quality gate antes de build/PR
npm run quality-gate

# Listar builds recentes
eas build:list --platform android --limit 5
```

---

## Proximos Passos

1. **Aguardar build Android completar**
2. **Download do AAB** do EAS
3. **Upload AAB** no Google Play Console (Internal Testing)
4. **Criar produtos de assinatura** no Google Play
5. **Configurar RevenueCat** com JSON key + produtos
6. **Testar fluxo de compra** com sandbox
7. **Repetir para iOS** quando App Store estiver configurado

---

## Contatos

- **Desenvolvedor:** Gabriel (Lion)
- **Email:** eugabrielmktd@gmail.com
- **Empresa:** Primeli Tecnologia
- **Email Empresa:** contato@primeliontecnologia.com
