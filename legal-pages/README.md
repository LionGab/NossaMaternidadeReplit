# Páginas Legais — Nossa Maternidade

Este diretório contém páginas estáticas para publicação antes da submissão nas lojas:

- `/privacidade` — Política de Privacidade (LGPD)
- `/termos` — Termos de Uso
- `/ai-disclaimer` — Aviso sobre uso de IA (NathIA)

## Publicação com excelência (recomendado)

### Opção A — Vercel (simples e estável)

1. Crie um projeto na Vercel e conecte este repositório.
2. Em **Project Settings → General → Root Directory**, selecione `legal-pages/`.
3. Deploy.
4. Em **Domains**, adicione `nossamaternidade.com.br` (e opcionalmente `www.nossamaternidade.com.br`).
5. Configure o DNS no Registro.br conforme a Vercel instruir (ela mostra exatamente quais registros criar).

Notas:

- O arquivo `vercel.json` já cria rewrites para rotas sem `.html`.
- SSL/HTTPS é automático.

### Opção B — Cloudflare Pages (CDN excelente)

1. Crie um projeto no Cloudflare Pages apontando o **Root Directory** para `legal-pages/`.
2. Configure o domínio customizado.
3. O arquivo `_redirects` já está pronto para rotas limpas.

## Conteúdo e contato

- Email LGPD/privacidade: `privacidade@nossamaternidade.com.br`
- Caso você queira mudar o “Responsável pelo tratamento” (ex.: adicionar CNPJ/endereço), edite os três arquivos HTML.
