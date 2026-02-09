# 🎯 Decisões de Produto - Nossa Maternidade

**Data:** 11 de Janeiro de 2026
**Status:** 🔴 PENDENTE DE APROVAÇÃO

---

## 📋 CONTEXTO

Três decisões críticas precisam ser tomadas antes de continuar a implementação:

1. **Onboarding antes ou depois do login?**
2. **Limite do free tier da NathIA**
3. **Opções da tela "Foco Emocional"**

---

## 🔴 DECISÃO 1: Onboarding vs Login

### Estado Atual do Código

**Fluxo Atual (implementado):**

```
Login → NotificationPermission → NathJourneyOnboarding → MainApp
```

**Análise do código:**

- `src/navigation/flowResolver.ts` mostra que login é **obrigatório** antes do onboarding
- `src/navigation/RootNavigator.tsx` confirma: usuário precisa estar autenticado para ver onboarding
- Dados do onboarding são salvos em `user_onboarding` table (requer `user_id`)

### Opção A: Onboarding ANTES do Login ⭐ **RECOMENDADO**

**Como funcionaria:**

```
App Abre → Onboarding (salvo localmente) → Paywall/Summary → Criar Conta → Sync dados
```

**Mudanças necessárias:**

1. Modificar `flowResolver.ts` para permitir onboarding sem autenticação
2. Salvar dados do onboarding em `AsyncStorage` durante o fluxo
3. Na tela `OnboardingPaywall` ou `OnboardingSummary`, pedir criação de conta
4. Após criar conta, fazer sync dos dados locais para `user_onboarding` table

**Vantagens:**

- ✅ Menor fricção inicial (padrão Calm, Flo, Headspace)
- ✅ Usuária já está emocionalmente investida quando pedimos signup
- ✅ Melhor conversão (ela já viu valor antes de criar conta)
- ✅ Alinhado com apps modernos de wellness

**Desvantagens:**

- ⚠️ Se fechar app no meio, perde progresso (mitigável com AsyncStorage persistente)
- ⚠️ Requer refatoração do fluxo atual

**Implementação:**

- Criar `onboarding-local-store.ts` (Zustand + AsyncStorage)
- Modificar `flowResolver.ts` para não exigir `isAuthenticated` para onboarding
- Adicionar função `syncOnboardingToServer()` após criação de conta

---

### Opção B: Login ANTES do Onboarding (Atual)

**Como funciona:**

```
App Abre → Login (Apple Sign In) → Onboarding → MainApp
```

**Vantagens:**

- ✅ Dados sempre salvos no servidor desde o início
- ✅ Não perde progresso se fechar app
- ✅ Já está implementado

**Desvantagens:**

- ❌ Alta fricção inicial (pede login antes de mostrar valor)
- ❌ Muitas usuárias desistem antes de conhecer o app
- ❌ Não alinhado com padrão de apps modernos

---

### 🎯 RECOMENDAÇÃO: **Opção A**

**Justificativa:**

1. **Padrão de mercado:** Apps líderes (Calm, Flo, Headspace) fazem onboarding antes do login
2. **Conversão:** Usuária que já investiu tempo no onboarding tem muito mais chance de criar conta
3. **Experiência:** Menos fricção = melhor primeira impressão
4. **Mitigação:** AsyncStorage garante que dados não se percam mesmo se fechar app

**Risco:** Baixo (AsyncStorage é confiável, sync é simples)

---

## 🔴 DECISÃO 2: Limite do Free Tier da NathIA

### Estado Atual do Código

**Limite atual (encontrado):**

- `src/hooks/useChatHandlers.ts` linha 34: `FREE_MESSAGE_LIMIT = 20`
- **Atualmente: 20 mensagens/dia** (muito generoso!)
- Reset: Meia-noite Brasília

**Custo estimado:**

- GPT-4o-mini: ~$0.15/1K tokens input, $0.60/1K output
- Conversa média (10 mensagens): ~$0.02-0.05
- 10 mensagens/dia × 30 dias = ~$0.60-1.50/mês por usuária free

### Opção A: 5 mensagens/dia

**Vantagens:**

- ✅ Custo controlado (~$0.30-0.75/mês por usuária)
- ✅ Cria urgência para assinar
- ✅ Suficiente para dúvida rápida

**Desvantagens:**

- ⚠️ Pode ser frustrante (não dá para conversa completa)
- ⚠️ Usuária pode não sentir valor suficiente

---

### Opção B: 10 mensagens/dia ⭐ **RECOMENDADO**

**Vantagens:**

- ✅ Permite conversa real por dia (sentir valor)
- ✅ Ainda incentiva upgrade para "ilimitado"
- ✅ Custo aceitável (~$0.60-1.50/mês por usuária)
- ✅ Melhor experiência = melhor retenção
- ✅ Reduz de 20 para 10 (ajuste necessário, atual está muito generoso)

**Desvantagens:**

- ⚠️ Custo um pouco maior que 5/dia

---

### Opção C: 3 mensagens/dia

**Vantagens:**

- ✅ Custo muito baixo (~$0.18-0.45/mês)
- ✅ Muito agressivo na conversão

**Desvantagens:**

- ❌ Pode frustrar e gerar churn
- ❌ Usuária não sente valor suficiente
- ❌ Não dá para conversa útil

---

### Opção D: Sem limite, mas com delay

**Como funciona:**

- Free users: 30s entre mensagens
- Premium: Instantâneo

**Vantagens:**

- ✅ Usuária pode usar quanto quiser
- ✅ Diferencial claro (velocidade)

**Desvantagens:**

- ⚠️ Custo pode escalar muito
- ⚠️ Requer implementação de delay/queue
- ⚠️ Pode ser frustrante esperar 30s

---

### 🎯 RECOMENDAÇÃO: **Opção B (10 mensagens/dia)**

**Justificativa:**

1. **Valor percebido:** 10 mensagens permitem conversa real, usuária sente valor
2. **Custo:** Ainda controlado (~$1.50/mês no máximo por usuária ativa)
3. **Conversão:** Usuária que sente valor tem mais chance de assinar
4. **Retenção:** Melhor experiência = menos churn

**Implementação:**

- Alterar `FREE_MESSAGE_LIMIT` de 6 para 10
- Manter reset diário (meia-noite Brasília)
- Adicionar contador visual na UI ("5 de 10 mensagens hoje")

---

## 🔴 DECISÃO 3: Opções da Tela "Foco Emocional"

### Estado Atual do Código

**Tela existente:** `OnboardingEmotionalState.tsx`

- Atualmente pergunta sobre **estado emocional** (bem equilibrada, ansiosa, etc.)
- Não pergunta sobre **focos de interesse**

**Dados atuais:**

- `EMOTIONAL_STATE_OPTIONS` em `nath-journey-onboarding-data.ts`
- 5 opções: Bem equilibrada, Um pouco ansiosa, Muito ansiosa, Triste/esgotada, Prefiro não responder

### Proposta: Nova Tela "Foco Emocional" (Multi-select, máximo 2)

**5 Opções Sugeridas:**

| ID                  | Label                 | Copy Empática                                               | Por que incluir                  |
| ------------------- | --------------------- | ----------------------------------------------------------- | -------------------------------- |
| `anxiety_fear`      | Ansiedade e medo      | "A cabeça não para, né? Vou te ajudar a respirar."          | Universal em gestantes/tentantes |
| `self_esteem_body`  | Autoestima e corpo    | "Seu corpo tá fazendo algo incrível. Vamos celebrar isso."  | Mudanças físicas, inseguranças   |
| `relationship`      | Relacionamento        | "Às vezes a gente precisa de colo. Vamos falar sobre isso." | Parceiro, família, rede de apoio |
| `organization_prep` | Organização e preparo | "Mil coisas pra fazer? Vamos por partes."                   | Enxoval, finanças, planejamento  |
| `health_wellness`   | Saúde e bem-estar     | "Cuidar de você é cuidar do bebê também."                   | Alimentação, exercício, sono     |

**Opções NÃO recomendadas para MVP:**

- ❌ "Trauma" → requer cuidado clínico, disclaimers pesados
- ❌ "Luto gestacional" → muito sensível, precisa conteúdo especializado
- ❌ "Depressão" → melhor detectar via mood tracking e sugerir ajuda profissional

---

### 🎯 RECOMENDAÇÃO: **As 5 opções propostas**

**Justificativa:**

1. **Cobertura:** Cobre os principais desafios emocionais da maternidade
2. **Segurança:** Evita tópicos que requerem cuidado clínico
3. **Personalização:** Permite NathIA focar nas necessidades específicas
4. **Multi-select:** Máximo 2 permite combinações (ex: Ansiedade + Relacionamento)

**Implementação:**

- Criar nova tela `OnboardingEmotionalFocus.tsx` OU adicionar à tela existente
- Adicionar campo `emotional_focus: string[]` em `user_onboarding` table
- Usar dados para personalizar respostas da NathIA

---

## 📊 RESUMO DAS DECISÕES

| Decisão                    | Opção Recomendada      | Justificativa                                           |
| -------------------------- | ---------------------- | ------------------------------------------------------- |
| **1. Onboarding vs Login** | **A (Antes)**          | Menor fricção, padrão de mercado, melhor conversão      |
| **2. Free tier NathIA**    | **B (10/dia)**         | Permite sentir valor, custo controlado, melhor retenção |
| **3. Focos emocionais**    | **5 opções propostas** | Cobertura completa, seguro, permite personalização      |

---

## ✅ PRÓXIMOS PASSOS APÓS APROVAÇÃO

### Se Aprovar Decisão 1 (Onboarding antes):

1. Criar `onboarding-local-store.ts` (Zustand + AsyncStorage)
2. Modificar `flowResolver.ts` para não exigir autenticação
3. Adicionar função `syncOnboardingToServer()` após login
4. Atualizar `OnboardingPaywall` para pedir criação de conta

### Se Aprovar Decisão 2 (10 mensagens/dia):

1. Alterar `FREE_MESSAGE_LIMIT` de **20 para 10** (em `src/hooks/useChatHandlers.ts` linha 34)
2. Adicionar contador visual na UI ("5 de 10 mensagens hoje")
3. Atualizar documentação

### Se Aprovar Decisão 3 (5 focos emocionais):

1. Criar/atualizar tela `OnboardingEmotionalFocus.tsx`
2. Adicionar campo `emotional_focus` em `user_onboarding` table
3. Usar dados para personalizar NathIA

---

**Status:** 🔴 AGUARDANDO APROVAÇÃO
**Data:** 11 de Janeiro de 2026
