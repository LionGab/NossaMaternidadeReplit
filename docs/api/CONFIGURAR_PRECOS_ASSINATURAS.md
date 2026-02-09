# Configurar Preços das Assinaturas - App Store Connect

## ⏱️ Tempo: 15 minutos

---

## 🎯 Preços Definidos

| Plano      | Preço        | Economia           |
| ---------- | ------------ | ------------------ |
| **Mensal** | R$ 19,99/mês | -                  |
| **Anual**  | R$ 79,99/ano | ~67% (R$ 6,66/mês) |

---

## 📋 PASSO 1: Acessar Assinaturas

1. Acesse: https://appstoreconnect.apple.com/
2. Login: `nath@nossamaternidade.com.br`
3. Clique no app: **Nossa Maternidade**
4. Navegue: **Monetização** > **Assinaturas**

---

## 📋 PASSO 2: Configurar Plano Mensal

### 2.1 Selecionar assinatura

1. Clique em: **Plano Mensal** (nossa_maternidade_monthly)
2. Clique em: **Preços de Assinatura**

### 2.2 Definir preço

```
┌─────────────────────────────────────────────┐
│  Preços de Assinatura                       │
├─────────────────────────────────────────────┤
│  Região: Brasil (BRL)           ← Selecione │
│  Preço: R$ 19,99                ← Digite    │
│                                             │
│  [ ] Manter preços equivalentes             │
│      em outras regiões                      │
│                                             │
│  [Cancelar]  [Salvar]           ← Clique    │
└─────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE**:

- Preço base: R$ 19,99
- Deixe "Manter preços equivalentes" DESMARCADO inicialmente
- Você pode adicionar outros países depois

### 2.3 Adicionar países principais (opcional)

Se quiser vender em outros países agora:

| País        | Preço Sugerido |
| ----------- | -------------- |
| 🇧🇷 Brasil   | R$ 19,99       |
| 🇺🇸 EUA      | $4.99          |
| 🇵🇹 Portugal | €4.99          |

---

## 📋 PASSO 3: Configurar Plano Anual

### 3.1 Selecionar assinatura

1. Volte para **Assinaturas**
2. Clique em: **Plano Anual** (nossa_maternidade_yearly)
3. Clique em: **Preços de Assinatura**

### 3.2 Definir preço

```
┌─────────────────────────────────────────────┐
│  Preços de Assinatura                       │
├─────────────────────────────────────────────┤
│  Região: Brasil (BRL)           ← Selecione │
│  Preço: R$ 79,99                ← Digite    │
│                                             │
│  [Cancelar]  [Salvar]           ← Clique    │
└─────────────────────────────────────────────┘
```

---

## 📋 PASSO 4: Completar Metadados

Agora que os preços estão configurados, complete os metadados restantes:

### 4.1 Nome de Exibição

```
Plano Mensal:
  Nome: Assinatura Mensal
  Descrição: Acesso completo à NathIA e conteúdos premium

Plano Anual:
  Nome: Assinatura Anual
  Descrição: Melhor custo-benefício - 12 meses de acesso completo
```

### 4.2 Benefícios Promocionais (opcional)

Se quiser destacar benefícios:

```
• Assistente NathIA 24/7
• Conteúdos por fase da gestação
• Rotina e organização do bebê
• Hábitos e autocuidado
• Comunidade de mães
```

### 4.3 Imagem Promocional (opcional)

**Tamanho**: 1600x1200 pixels
**Formato**: PNG ou JPG
**Recomendação**: Mostre interface da NathIA ou benefícios visuais

---

## 📋 PASSO 5: Configurar Trial Gratuito (RECOMENDADO)

### Por que oferecer trial?

- Aumenta conversões em 40-60%
- Usuários testam sem compromisso
- RevenueCat gerencia automaticamente

### Como configurar

1. Em cada assinatura, vá para: **Preços de Assinatura**
2. Clique em: **Adicionar Preço Introdutório**
3. Selecione: **Teste Gratuito**

```
┌─────────────────────────────────────────────┐
│  Preço Introdutório                         │
├─────────────────────────────────────────────┤
│  Tipo: Teste Gratuito       ← Selecione     │
│  Duração: 7 dias            ← Configure     │
│                                             │
│  [Cancelar]  [Adicionar]    ← Clique        │
└─────────────────────────────────────────────┘
```

**Recomendação**: 7 dias grátis (padrão da indústria)

---

## 📋 PASSO 6: Revisar e Enviar

1. Volte para **Assinaturas**
2. Verifique status:

   ```
   ✅ Plano Mensal - Pronto para envio
   ✅ Plano Anual - Pronto para envio
   ```

3. Se aparecer "Faltam metadados", verifique:
   - [ ] Preço configurado
   - [ ] Nome de exibição preenchido
   - [ ] Descrição preenchida
   - [ ] Localização em Português (Brasil)

---

## ✅ Verificação Final

Execute este checklist antes de enviar:

- [ ] Plano Mensal: R$ 19,99 configurado
- [ ] Plano Anual: R$ 79,99 configurado
- [ ] Trial gratuito: 7 dias (opcional mas recomendado)
- [ ] Nomes de exibição preenchidos
- [ ] Descrições preenchidas
- [ ] Localização PT-BR completa
- [ ] Status mudou de "Faltam metadados" para "Pronto para envio"

---

## 🎯 Próximo Passo

Depois de salvar tudo:

```bash
# Me avise quando concluir
# Aí configuramos o RevenueCat webhook e testamos no TestFlight
```

---

## 💡 Dicas

**Pricing Strategy**:

- Anual economiza 67% → forte incentivo
- Trial 7 dias → padrão da indústria
- Família compartilhada desativado → correto (assinatura pessoal)

**Disponibilidade**:

- Comece só com Brasil
- Expanda depois para Portugal, EUA, etc.
- Evita complexidade inicial com impostos/conversões

---

## ❓ Troubleshooting

### "Não consigo salvar o preço"

→ Verifique se selecionou a região (Brasil) primeiro

### "Preço não aparece nas opções"

→ Use o campo de texto livre e digite: 19.99 (sem R$)

### "Status ainda mostra 'Faltam metadados'"

→ Verifique TODAS as seções:

- Informações de Assinatura
- Informações de Localização
- Preços de Assinatura
- Revisão de Assinatura (se disponível)

---

**Me avise quando concluir!** 🚀
