# Configurar URLs no App Store Connect

## 🚨 BLOQUEADOR CRÍTICO

**Status atual**: URLs apontam para `example.com`
**Problema**: Apple **REJEITA automaticamente** apps com URLs placeholder
**Urgência**: 🔴 ALTA

---

## 📋 URLs Necessárias

| Tipo                        | Obrigatório | Uso                         |
| --------------------------- | ----------- | --------------------------- |
| **URL de Suporte**          | ✅ SIM      | Usuários reportam problemas |
| **URL de Marketing**        | ❌ Opcional | Landing page do app         |
| **Política de Privacidade** | ✅ SIM      | Requerida para IAP          |
| **Termos de Uso**           | ✅ SIM      | Requerida para IAP          |

---

## 🎯 OPÇÃO 1: Usar Site Existente (RECOMENDADO)

Vi no git status: `nossamaternidade-site/`

Se esse site estiver deployado, use:

```
✅ URL de Suporte:
   https://nossamaternidade.com.br/suporte
   ou
   https://www.nossamaternidade.com.br/contato

✅ URL de Marketing:
   https://nossamaternidade.com.br

✅ Política de Privacidade:
   https://nossamaternidade.com.br/privacidade

✅ Termos de Uso:
   https://nossamaternidade.com.br/termos
```

**Ação**: Me confirme se o site está no ar e qual URL usar.

---

## 🎯 OPÇÃO 2: Criar Landing Page Simples (1 hora)

Se o site NÃO estiver deployado, podemos:

1. **Deploy rápido no Vercel** (5 minutos)
   - Usar `nossamaternidade-site/` existente
   - Deploy gratuito: https://vercel.com

2. **Criar páginas mínimas** (30 minutos)
   - Home (marketing)
   - Suporte/Contato
   - Privacidade
   - Termos

3. **Usar domínio Vercel** (temporário)
   - Ex: `nossamaternidade.vercel.app`
   - Migrar para domínio próprio depois

---

## 🎯 OPÇÃO 3: Usar Email Temporário (NÃO RECOMENDADO)

Se **absolutamente urgente**:

```
URL de Suporte (temporária):
  mailto:nath@nossamaternidade.com.br

⚠️ Funciona mas é mal visto pela Apple
⚠️ Use apenas se estritamente necessário
```

---

## 📋 PASSO A PASSO: Atualizar no App Store Connect

### 1. Acessar Informações do App

1. Acesse: https://appstoreconnect.apple.com/
2. Login: `nath@nossamaternidade.com.br`
3. Clique no app: **Nossa Maternidade**
4. Navegue: **Informações do App**

### 2. Atualizar URLs

Localize e atualize:

```
┌──────────────────────────────────────────┐
│  Informações do App                      │
├──────────────────────────────────────────┤
│  URL de Suporte:                         │
│  https://nossamaternidade.com.br/suporte │
│                                          │
│  URL de Marketing (opcional):            │
│  https://nossamaternidade.com.br         │
│                                          │
│  Política de Privacidade:                │
│  https://nossamaternidade.com.br/...     │
│                                          │
│  [Salvar]                                │
└──────────────────────────────────────────┘
```

### 3. Salvar e Verificar

1. Clique em **Salvar**
2. Verifique que os links funcionam (abra em navegador)
3. Certifique-se que as páginas carregam corretamente

---

## ✅ Checklist de Qualidade

Antes de submeter, verifique:

- [ ] URLs não são `example.com`
- [ ] URLs são HTTPS (não HTTP)
- [ ] Páginas carregam sem erro 404
- [ ] Páginas têm conteúdo real (não "Em construção")
- [ ] Email de suporte funciona (se usar `mailto:`)
- [ ] Política de Privacidade menciona:
  - [ ] Coleta de dados
  - [ ] Uso de dados
  - [ ] Direitos LGPD
  - [ ] Contato para dúvidas

---

## 📝 Template Mínimo de Política de Privacidade

Se precisar criar rápido:

```markdown
# Política de Privacidade - Nossa Maternidade

**Última atualização**: [DATA]

## Coleta de Dados

Coletamos:

- Nome e email (registro)
- Informações de uso (analytics)
- Dados de saúde (diário, ciclo)

## Uso dos Dados

Seus dados são usados para:

- Personalizar sua experiência
- Melhorar nossos serviços
- Enviar notificações relevantes

## Compartilhamento

NÃO compartilhamos seus dados com terceiros para marketing.

Compartilhamos apenas com:

- Supabase (infraestrutura)
- RevenueCat (assinaturas)
- Sentry (monitoramento de erros)

## Seus Direitos (LGPD)

Você pode:

- Acessar seus dados
- Corrigir dados incorretos
- Deletar sua conta
- Exportar seus dados

## Contato

Para dúvidas: nath@nossamaternidade.com.br
```

---

## 🚀 Próximos Passos

Depois de atualizar as URLs:

1. ✅ Verifique que todas as páginas carregam
2. ✅ Atualize no App Store Connect
3. ✅ Me avise quando concluir

---

## ❓ Qual opção você prefere?

**Responda**:

- **A**: Tenho site no ar → me passe as URLs
- **B**: Deploy rápido no Vercel → me ajude
- **C**: Uso email temporário → entendo os riscos

---

**Me avise qual opção!** Depois continuamos com os próximos passos. 🚀
