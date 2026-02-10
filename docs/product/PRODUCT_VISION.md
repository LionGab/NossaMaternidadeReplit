# Nossa Maternidade — Visao do Produto

> **ATENCAO**: Este documento e visao de PRODUTO, nao spec tecnica.
> A arquitetura real do projeto esta em `/CLAUDE.md` e `/src/CLAUDE.md`.
> Exemplos de codigo aqui sao ILUSTRATIVOS e podem estar desatualizados.
> NAO use este documento como referencia para implementacao.

---

## Nome e Posicionamento

**"Nossa Maternidade"** — com subtitulo: _"O mundo da Nat, pra voce"_

Nota estrategica: o nome funciona no curto prazo. Se o app expandir alem de maternidade, considerar migrar para "Mundo Nat" ou "Valente" futuramente.

## Modelo de 4 Camadas

| Camada           | Conteudo                                               | Acesso                   | Receita                     |
| ---------------- | ------------------------------------------------------ | ------------------------ | --------------------------- |
| **1. Aberta**    | Feed publico, snippets de IA, rituais basicos          | Gratis com cadastro      | Ads + funil para premium    |
| **2. Profunda**  | IA da Nat (texto + voz), habit tracker guiado          | Freemium (limite diario) | Conversao para assinatura   |
| **3. Exclusiva** | Close Friends, comunidade, desafios, bastidores, lives | Premium (assinatura)     | R$29,90/mes ou R$249,90/ano |
| **4. Impacto**   | Projetos sociais, transparencia de doacoes             | Premium                  | Reforco de marca + retencao |

## Diferenciais Competitivos

1. **IA conversacional com voz clonada da Natalia** — nenhum app de influencer BR tem isso
2. **Close Friends proprio** — dados e relacionamento sao dela, nao do Instagram
3. **Habit Tracker guiado pela Nat** — transforma inspiracao em acao diaria
4. **Multi-camada** — funil natural de conversao
5. **Impacto social integrado** — diferencia de apps rasos de creators

## 6 Modulos do Produto

### Status de Implementacao

| #   | Modulo                           | Status                 | Onde no codigo                                           |
| --- | -------------------------------- | ---------------------- | -------------------------------------------------------- |
| 1   | Feed Publico ("Nat todo dia")    | Futuro                 | N/A                                                      |
| 2   | IA da Nat (Chat)                 | Implementado (texto)   | `src/screens/assistant/`, `src/config/nathia-prompts.ts` |
| 3   | Rituais da Nat (Habit Tracker)   | Implementado           | `src/screens/care/HabitsEnhancedScreen.tsx`              |
| 4   | Mundo da Natalia (Close Friends) | Implementado (parcial) | `src/screens/mundo/`                                     |
| 5   | Comunidade                       | Implementado           | `src/screens/community/`                                 |
| 6   | Impacto Social                   | Futuro                 | N/A                                                      |

### Modulo 1: Feed Publico (futuro)

Conteudo publico da Natalia — clips, carrosseis, textos motivacionais, dicas rapidas. Fonte de dados via CMS. Topo do funil de conversao.

### Modulo 2: IA da Nat

Chat com IA que "fala" como a Natalia. Atualmente: texto via Gemini 2.0 Flash. Futuro: voz clonada via ElevenLabs.

**Limites**:

- Free: 6 mensagens de texto/dia (reset meia-noite UTC-3)
- Premium: ilimitado

**Conexao com Habits**: a IA sugere adicionar habitos ao tracker quando relevante.

### Modulo 3: Rituais da Nat (Habit Tracker)

Tracker de habitos organizado em sessoes de vida.

**5 Sessoes**: Mae, Mulher, Casa, Trabalho, Amor

**Packs pre-configurados**:

- "Primeiros meses de mae" (0-3 meses)
- "Retomando a rotina" (3-6 meses)
- "Mae que corre" (6+ meses)
- "Ainda nao sou mae"

**Gamificacao**: streaks, badges, frases rotativas da Nat, progresso visual.

### Modulo 4: Mundo da Natalia (Close Friends)

Feed exclusivo premium — bastidores, vulnerabilidade, conteudo que nao vai pra redes.

### Modulo 5: Comunidade

Forum para membros trocarem experiencias. Topicos: Maternidade, Corpo & Mente, Trabalho & Grana, Fe, Off-topic. Com moderacao.

### Modulo 6: Impacto Social (futuro)

Dashboard transparente de impacto social. Porcentagem da assinatura para projetos, video mensal da Natalia, metricas visuais.

## Fluxos de Orquestracao

### Fluxo A: Aquisicao → Engajamento

```
Story da Nat (Instagram/TikTok)
  → Landing no app (video curto + CTA "Baixar")
  → Cadastro (login social)
  → Onboarding (9 telas no app atual)
  → Home personalizada
```

### Fluxo B: IA <-> Habits (ciclo virtuoso)

```
Usuaria pergunta pra IA sobre cansaco/rotina
  → IA responde com empatia + acoes praticas
  → Sugere adicionar habito ao tracker
  → Tracker recebe habito + lembrete
  → IA reconhece progresso ou ajusta se nao estiver completando
```

### Fluxo C: Free → Premium (conversao suave)

```
Usuaria usa feed + IA gratis + habits basicos
  → Bate limite (6 msgs/dia, habits limitados)
  → Video da Natalia no paywall
  → RevenueCat: Mensal R$29,90 / Anual R$249,90
  → Desbloqueio imediato de tudo
```

### Fluxo D: Retencao

```
Notificacao matinal personalizada
  → Conteudo novo no Mundo da Nat
  → Desafio mensal coletivo
  → Impacto social (video mensal)
  → Streak longo = orgulho + custo de abandono
```

---

_Fonte: Documento Consolidado App Nat (fev/2026)_
_Ultima atualizacao: 2026-02-09_
