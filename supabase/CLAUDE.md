# Nossa Maternidade — Regras detalhadas (supabase/)

## Segurança e RLS

- RLS obrigatório em todas as tabelas; políticas mínimas de leitura/escrita devem ser explícitas.
- Nunca expor keys sensíveis; operações privadas via Edge Functions/Service Role fora do app cliente.
- Não armazenar segredos em código; use vars de ambiente/Secrets do Supabase/EAS.

## Migrations e schema

- Use migrations versionadas; não altere schema manualmente fora de migrações.
- Revisar compatibilidade antes de `drop/alter`. Evitar operações destrutivas sem plano de migração seguro.
- Gerar tipos TS via script do projeto (`npm run generate-types` ou equivalente) após mudanças de schema.

## Edge Functions

- Funções em `supabase/functions/` (ex.: `ai`, `transcribe`, `upload-image`, `notifications`, `delete-account`, `export-data`, `analytics`, `elevenlabs-tts`, `moderate-content`, `webhook`).
- Deploy com `npx supabase functions deploy <nome>` ou script do projeto.
- Logar com parcimônia (sem vazar PII/secrets); seguir formato `{ data, error }`.

## Accessos e segredos

- Nunca commit de `.env`, chaves ou arquivos `.pem/.key`.
- Usar `EXPO_PUBLIC_` somente para valores seguros no cliente; demais ficam no backend/Edge Functions.
- Webhooks (RevenueCat etc.) devem validar assinatura e não logar payload sensível.

## Padrões de API

- Respostas `{ data, error }`; valide input; sanitize conteúdo (moderação onde aplicável).
- Evitar `any` e supressões; preferir tipos gerados do Supabase.

## Operação e testes

- Antes de mudanças críticas: rodar `npm run quality-gate` no app e testes de edge se existirem.
- Para testes locais de funções, usar CLI do Supabase conforme docs do projeto.

## LGPD e privacidade

- Usar fluxos dedicados para delete/export de dados de usuário.
- Minimizar coleta e retenção; aplicar políticas de acesso estritas em tabelas com PII.
