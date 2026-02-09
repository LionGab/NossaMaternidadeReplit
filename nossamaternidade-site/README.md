# Nossa Maternidade - Site Institucional

Site institucional do app Nossa Maternidade com landing page, suporte e páginas legais.

## 📁 Estrutura

```
nossamaternidade-site/
├── index.html          # Landing page principal
├── suporte.html        # Central de ajuda e FAQs
├── privacidade.html    # Política de Privacidade (LGPD)
├── termos.html         # Termos de Uso
├── styles.css          # CSS global
├── vercel.json         # Configuração de deploy
└── README.md           # Este arquivo
```

## 🚀 Deploy no Vercel

### Opção 1: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd nossamaternidade-site
vercel

# Deploy para produção
vercel --prod
```

### Opção 2: Deploy via GitHub

1. Crie um repositório no GitHub
2. Faça push destes arquivos
3. Conecte ao Vercel em [vercel.com/new](https://vercel.com/new)
4. Selecione o repositório
5. Deploy automático!

## 🌐 Configuração de Domínio

Após o deploy, configure o domínio `nossamaternidade.com.br`:

1. No painel do Vercel, vá em **Settings > Domains**
2. Adicione `nossamaternidade.com.br`
3. Configure os DNS no seu registrador:
   - **Tipo A:** `76.76.21.21`
   - **Tipo CNAME (www):** `cname.vercel-dns.com`

## ✅ Checklist Pré-Deploy

- [ ] Substituir `[Nome da Empresa]` na privacidade.html
- [ ] Substituir `[XX.XXX.XXX/0001-XX]` (CNPJ) na privacidade.html
- [ ] Substituir `[Endereço]` na privacidade.html
- [ ] Substituir `[Nome do DPO]` na privacidade.html
- [ ] Substituir `[Cidade/Estado]` nos termos.html
- [ ] Adicionar imagens reais (screenshot do app, foto da Nathália)
- [ ] Adicionar links reais das stores (App Store e Play Store)
- [ ] Testar em mobile e desktop

## 🎨 Customização

### Cores (em styles.css)

```css
--rosa-primario: #d4a5a5; /* Cor principal */
--rosa-claro: #f5e6e8; /* Background suave */
--verde-menta: #a8c5b5; /* Cor de destaque */
--nude: #f9f4f0; /* Background geral */
```

### Fontes

O site usa Google Fonts:

- **Display:** Cormorant Garamond (títulos elegantes)
- **Body:** DM Sans (texto legível)

## 📱 URLs Finais

- **Landing:** https://nossamaternidade.com.br
- **Suporte:** https://nossamaternidade.com.br/suporte
- **Privacidade:** https://nossamaternidade.com.br/privacidade
- **Termos:** https://nossamaternidade.com.br/termos

## 🔒 Para Submissão nas Stores

As URLs de privacidade e termos são **obrigatórias** para aprovação:

### App Store Connect

- Privacy Policy URL: `https://nossamaternidade.com.br/privacidade`
- Terms of Service URL: `https://nossamaternidade.com.br/termos`

### Google Play Console

- Privacy Policy URL: `https://nossamaternidade.com.br/privacidade`

## 📞 Contato

- Suporte: suporte@nossamaternidade.com.br
- Privacidade: privacidade@nossamaternidade.com.br
- Legal: legal@nossamaternidade.com.br

---

Desenvolvido para o app Nossa Maternidade 🤱
