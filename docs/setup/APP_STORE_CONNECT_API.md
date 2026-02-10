# App Store Connect API – Referência

## Endpoint: listar apps

```http
GET https://api.appstoreconnect.apple.com/v1/apps
```

Retorna a lista de apps da sua conta (com paginação). Usado pelo EAS Submit e por ferramentas que precisam do **App ID** (ex.: `6756980888` para Nossa Maternidade).

## Autenticação

A API usa **JWT (ES256)**. Não usa usuário/senha.

1. **Key ID** – ID da chave (ex.: `E7IV510UXU7D`)
2. **Issuer ID** – UUID em **Users and Access → Integrations → Keys** (canto da página)
3. **Arquivo .p8** – Chave privada baixada ao criar a key (só pode baixar uma vez)

Onde obter: [App Store Connect → Users and Access → Integrations → Keys](https://appstoreconnect.apple.com/access/api).

## Formato do JWT

- **Header:** `{ "alg": "ES256", "kid": "<KEY_ID>" }`
- **Payload:** `{ "iss": "<ISSUER_ID>", "iat": <timestamp>, "exp": <timestamp+20min> }`
- **Assinatura:** ES256 com o conteúdo do arquivo `.p8`

Request:

```http
GET https://api.appstoreconnect.apple.com/v1/apps
Authorization: Bearer <JWT>
```

## No projeto

- **GitHub Actions:** o secret `APPLE_ASC_API_KEY_JSON` deve ter `keyId`, `issuerId` e `privateKey` (conteúdo do .p8). O workflow escreve o .p8 em `/tmp/AuthKey.p8` e exporta `EXPO_ASC_API_KEY_PATH`, `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID` para o EAS Submit.
- **EAS Submit:** usa as variáveis `EXPO_ASC_*` ou o arquivo .p8 para falar com a API (upload, etc.).
- **App ID deste app:** `6756980888` (usado em URLs do TestFlight e na API).

## Testar a API localmente

Script no repositório: `scripts/appstore-connect-api.mjs`. Ele gera o JWT e chama `GET /v1/apps`.

```bash
# Com JSON da API Key (não commitar; mesmo formato do secret APPLE_ASC_API_KEY_JSON)
APPLE_ASC_API_KEY_JSON='{"keyId":"...","issuerId":"...","privateKey":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"}' node scripts/appstore-connect-api.mjs
```

Ou use as variáveis que o EAS Submit usa (após preparar o .p8 como no workflow):

```bash
export EXPO_ASC_API_KEY_PATH=/caminho/para/AuthKey.p8
export EXPO_ASC_KEY_ID=SEU_KEY_ID
export EXPO_ASC_ISSUER_ID=SEU_ISSUER_UUID
node scripts/appstore-connect-api.mjs
```

## Expirar builds em massa

Script no repositório: `scripts/release/expire-asc-builds.mjs` (atalho: `npm run asc:expire-builds -- ...`).

Dry run (não altera nada):

```bash
npm run asc:expire-builds -- --dry-run
```

Expirar todas as builds ativas `VALID`:

```bash
npm run asc:expire-builds
```

Expirar apenas uma versão específica:

```bash
npm run asc:expire-builds -- --version 1.0.1
```

Expirar build numbers específicos:

```bash
npm run asc:expire-builds -- --build-number 110,109,108
```

Notas:

- O script usa `attributes.expired=true` via API oficial da Apple.
- Por padrão, ele ignora builds fora de `processingState=VALID`.
- Para incluir estados não `VALID`, use `--include-non-valid`.
