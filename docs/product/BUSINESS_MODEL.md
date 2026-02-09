# Nossa Maternidade — Modelo de Negocio

> **ATENCAO**: Este documento e visao de NEGOCIO, nao spec tecnica.
> A arquitetura real do projeto esta em `/CLAUDE.md` e `/src/CLAUDE.md`.
> Valores e metricas aqui sao estimativas e podem mudar.

---

## Publico-Alvo

| Segmento | Faixa | Perfil |
|---|---|---|
| **Core** | Mulheres 18-28 anos | Seguidoras da Natalia, primeira gravidez ou pos-parto |
| **Amplo** | Mulheres 18-40 anos | Interessadas em maternidade, bem-estar, lifestyle |
| **Demografico** | Classe C/B | Brasil, com interesse em empreendedorismo feminino |

### Personas Principais

1. **Tentante**: Mulher planejando engravidar, busca informacao e acompanhamento de ciclo
2. **Gestante**: Gravidez em andamento, precisa de suporte emocional e pratico
3. **Mae recem-parida**: Pos-parto recente (0-6 meses), caos hormonal, sono, amamentacao
4. **Mae de bebe/toddler**: 6+ meses, retomando rotina, equilibrando trabalho/maternidade
5. **Curiosa**: Nao e mae (ainda), mas acompanha a Natalia e se identifica com autocuidado

## Precificacao

| Plano | Preco | Desconto |
|---|---|---|
| **Mensal** | R$29,90/mes | - |
| **Anual** | R$249,90/ano | ~30% off vs mensal |

### Free vs Premium

| Feature | Free | Premium |
|---|---|---|
| Feed publico | Ilimitado | Ilimitado |
| IA da Nat (texto) | 6 msgs/dia | Ilimitado |
| IA da Nat (voz) | - | Ilimitado (futuro) |
| Habit Tracker | Basico | Completo + historico |
| Mundo da Nat | - | Acesso total |
| Comunidade | - | Acesso total |
| Impacto Social | - | Acesso total (futuro) |
| Desafios mensais | - | Participacao + selos |

## Estimativas (Conservadoras)

| Metrica | Premissa | Valor |
|---|---|---|
| Downloads mes 1 | 5% dos 10M IG followers | 500k |
| Conversao premium | 1-2% | 5k-10k assinantes |
| MRR (mes 3) | 7k x R$29,90 | ~R$209k/mes |
| Churn mensal | 8-12% | Requer conteudo constante |

## Fontes de Receita

1. **Assinaturas premium** (principal) — RevenueCat
2. **Ads no feed publico** (futuro) — conteudo gratis monetizado
3. **Parcerias com marcas** (futuro) — conteudo patrocinado no Mundo da Nat
4. **NAVA integration** (futuro) — early access a produtos dentro do app

## Roadmap de Implementacao (8 Semanas)

| Semana | Entregavel | Status |
|---|---|---|
| 1 | Setup + Auth + Onboarding | Implementado |
| 2 | Feed publico + Home | Parcial (Home existe, Feed futuro) |
| 3 | IA da Nat (texto) | Implementado |
| 4 | Rituais da Nat (Habit Tracker) | Implementado |
| 5 | Paywall + Assinatura | Implementado |
| 6 | IA Voz (ElevenLabs) + Mundo da Nat | Parcial (Mundo existe, Voz futuro) |
| 7 | Comunidade + Impacto | Parcial (Comunidade existe, Impacto futuro) |
| 8 | Polish + Deploy | Em andamento |

## Checklist de Deploy

### Tecnico
- [x] Expo SDK 54 + React Native 0.81
- [x] TypeScript strict mode
- [x] TanStack Query + Zustand configurados
- [x] FlashList em todas as listas
- [x] expo-image para imagens
- [x] Sentry configurado
- [x] EAS Build + profiles (dev/preview/production)
- [ ] Deep linking testado
- [ ] Analytics instrumentados (PostHog/Mixpanel)

### Produto
- [x] Onboarding completo (9 telas)
- [ ] Feed publico funcional
- [x] IA texto funcionando (Gemini)
- [x] Habit Tracker com packs
- [x] Paywall RevenueCat
- [x] Mundo da Nat com conteudo
- [x] Push notifications configuradas
- [ ] IA voz (ElevenLabs)

### Conteudo (Natalia)
- [ ] Audio para clone de voz (10-30 min, limpo)
- [x] Personality prompt aprovado
- [x] Packs de habitos curados
- [ ] Posts iniciais para Mundo da Nat (minimo 10)
- [ ] Video de onboarding gravado
- [ ] Video de paywall gravado
- [x] Frases rotativas para Habit Tracker

### Legal
- [ ] Termos de uso
- [ ] Politica de privacidade (LGPD)
- [ ] Consentimento de uso de voz (ElevenLabs)
- [ ] Compliance App Store
- [ ] Compliance Google Play

---

*Fonte: Documento Consolidado App Nat (fev/2026)*
*Ultima atualizacao: 2026-02-09*
