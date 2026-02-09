// src/content/insights.ts
import { LifeJourney } from "@/types/expanded-onboarding.types";

export interface DailyInsight {
  id: string;
  journey: LifeJourney;
  dayIndex: number;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaAction?: "open_affirmations" | "open_daily_log" | "open_cycle" | "open_assistant" | "open_care";
}

export const INSIGHTS: DailyInsight[] = [
  // AUTOESTIMA
  { id: 'love-01', journey: 'AUTOESTIMA', dayIndex: 1, title: 'Um passo por vez', message: 'Hoje, escolha uma coisa pequena para cuidar de você: água, respiração, ou um banho mais calmo.', ctaLabel: 'Fazer check-in', ctaAction: 'open_daily_log' },
  { id: 'love-02', journey: 'AUTOESTIMA', dayIndex: 2, title: 'Seu corpo é seu lar', message: 'Tire um momento para agradecer ao seu corpo por tudo o que ele faz por você hoje.' },
  { id: 'love-03', journey: 'AUTOESTIMA', dayIndex: 3, title: 'Gentileza gera equilíbrio', message: 'Fale com você mesma hoje como falaria com sua melhor amiga. Você merece esse carinho.' },
  { id: 'love-04', journey: 'AUTOESTIMA', dayIndex: 4, title: 'Espaço para respirar', message: 'Reserve 5 minutos para não fazer nada. Apenas ser. Isso é autocuidado.' },
  { id: 'love-05', journey: 'AUTOESTIMA', dayIndex: 5, title: 'Pequenas vitórias', message: 'Qual foi sua pequena vitória de hoje? Celebre-a, por menor que pareça.', ctaLabel: 'Ver afirmações', ctaAction: 'open_affirmations' },
  { id: 'love-06', journey: 'AUTOESTIMA', dayIndex: 6, title: 'Seu valor é intrínseco', message: 'Você não precisa produzir nada para ter valor. Sua existência já é o suficiente.' },
  { id: 'love-07', journey: 'AUTOESTIMA', dayIndex: 7, title: 'Limites são amor', message: 'Dizer não para algo que te drena é dizer sim para você mesma. Pratique um limite hoje.' },
  { id: 'love-08', journey: 'AUTOESTIMA', dayIndex: 8, title: 'Nutrição além da comida', message: 'O que você está consumindo hoje? Escolha conteúdos que te tragam paz e inspiração.' },
  { id: 'love-09', journey: 'AUTOESTIMA', dayIndex: 9, title: 'Presença é presente', message: 'Sinta seus pés no chão por um momento. O agora é o único lugar onde a vida acontece.' },
  { id: 'love-10', journey: 'AUTOESTIMA', dayIndex: 10, title: 'Você é sua melhor companhia', message: 'Desfrute da sua própria companhia por alguns minutos hoje. O que você gosta em si mesma?' },

  // SAUDE_CORPO
  { id: 'body-01', journey: 'SAUDE_CORPO', dayIndex: 1, title: 'Movimento gentil', message: '5 minutos de alongamento fazem diferença. Que tal agora?', ctaLabel: 'Abrir assistente', ctaAction: 'open_assistant' },
  { id: 'body-02', journey: 'SAUDE_CORPO', dayIndex: 2, title: 'Hidratação é vida', message: 'Beba um copo de água agora. Seu corpo agradece pela clareza e energia.' },
  { id: 'body-03', journey: 'SAUDE_CORPO', dayIndex: 3, title: 'Escute seu corpo', message: 'Onde você sente tensão? Respire direcionando o ar para essa área por um minuto.' },
  { id: 'body-04', journey: 'SAUDE_CORPO', dayIndex: 4, title: 'Nutrição consciente', message: 'Ao comer hoje, tente sentir o sabor e a textura. Menos pressa, mais presença.' },
  { id: 'body-05', journey: 'SAUDE_CORPO', dayIndex: 5, title: 'Descanso é treino', message: 'Dormir bem é tão importante quanto se exercitar. Prepare seu ambiente para o sono hoje.' },
  { id: 'body-06', journey: 'SAUDE_CORPO', dayIndex: 6, title: 'Postura e confiança', message: 'Endireite a coluna e respire fundo. Pequenos ajustes mudam como nos sentimos.' },
  { id: 'body-07', journey: 'SAUDE_CORPO', dayIndex: 7, title: 'Toque acolhedor', message: 'Passe um creme nas mãos ou pés com atenção. Sinta o cuidado através do toque.' },
  { id: 'body-08', journey: 'SAUDE_CORPO', dayIndex: 8, title: 'Luz natural', message: 'Tente pegar 5-10 minutos de sol ou luz natural. Isso regula seu ritmo biológico.' },
  { id: 'body-09', journey: 'SAUDE_CORPO', dayIndex: 9, title: 'Ritmo possível', message: 'Se o dia está corrido, apenas 1 minuto de respiração profunda já conta como cuidado.' },
  { id: 'body-10', journey: 'SAUDE_CORPO', dayIndex: 10, title: 'Celebre sua força', message: 'Seu corpo é incrível por tudo o que ele permite que você faça. Honre essa força.' },

  // SAUDE_MENTAL
  { id: 'mind-01', journey: 'SAUDE_MENTAL', dayIndex: 1, title: 'Respiração 4-7-8', message: 'Inspire 4s, segure 7s, expire 8s. Repita 3 vezes para acalmar o sistema nervoso.', ctaLabel: 'Fazer check-in', ctaAction: 'open_daily_log' },
  { id: 'mind-02', journey: 'SAUDE_MENTAL', dayIndex: 2, title: 'Observe seus pensamentos', message: 'Pensamentos são como nuvens: deixe-os passar sem precisar se prender a eles.' },
  { id: 'mind-03', journey: 'SAUDE_MENTAL', dayIndex: 3, title: 'Um foco por vez', message: 'O multitasking drena sua mente. Tente fazer uma única coisa com atenção plena agora.' },
  { id: 'mind-04', journey: 'SAUDE_MENTAL', dayIndex: 4, title: 'Gratidão real', message: 'Pense em algo simples que aconteceu hoje e que você é grata. Sinta essa gratidão.' },
  { id: 'mind-05', journey: 'SAUDE_MENTAL', dayIndex: 5, title: 'Desconexão digital', message: 'Tire 30 minutos longe de telas hoje. Deixe sua mente descansar do excesso de estímulos.' },
  { id: 'mind-06', journey: 'SAUDE_MENTAL', dayIndex: 6, title: 'Afirmação do dia', message: '"Eu sou capaz de lidar com o que vier hoje, um passo de cada vez."', ctaLabel: 'Ver afirmações', ctaAction: 'open_affirmations' },
  { id: 'mind-07', journey: 'SAUDE_MENTAL', dayIndex: 7, title: 'Espaço de silêncio', message: 'Busque um momento de silêncio total. Apenas ouça os sons au seu redor sem julgamento.' },
  { id: 'mind-08', journey: 'SAUDE_MENTAL', dayIndex: 8, title: 'Escrita terapêutica', message: 'Se algo te preocupa, escreva por 2 minutos. Tirar da mente ajuda a organizar o sentir.' },
  { id: 'mind-09', journey: 'SAUDE_MENTAL', dayIndex: 9, title: 'Gentileza mental', message: 'Seja paciente com seus processos. O aprendizado e a cura levam tempo.' },
  { id: 'mind-10', journey: 'SAUDE_MENTAL', dayIndex: 10, title: 'Foco no possível', message: 'O que está sob seu controle hoje? Foque nisso e solte o resto com suavidade.' },

  // RELACIONAMENTOS
  { id: 'rel-01', journey: 'RELACIONAMENTOS', dayIndex: 1, title: 'Escuta ativa', message: 'Hoje, ao conversar com alguém, tente apenas ouvir, sem preparar a resposta antes.', ctaLabel: 'Abrir assistente', ctaAction: 'open_assistant' },
  { id: 'rel-02', journey: 'RELACIONAMENTOS', dayIndex: 2, title: 'Presença com o outro', message: 'Dê atenção total a quem está com você. Guarde o celular por alguns minutos.' },
  { id: 'rel-03', journey: 'RELACIONAMENTOS', dayIndex: 3, title: 'Elogio sincero', message: 'Diga algo positivo a alguém hoje. Pequenos reconhecimentos fortalecem laços.' },
  { id: 'rel-04', journey: 'RELACIONAMENTOS', dayIndex: 4, title: 'Comunicação do sentir', message: 'Use "Eu me sinto..." em vez de "Você fez...". Falar do seu sentimento abre diálogos.' },
  { id: 'rel-05', journey: 'RELACIONAMENTOS', dayIndex: 5, title: 'Pedido de ajuda', message: 'Pedir ajuda é um sinal de força e confiança na relação. O que você precisa hoje?' },
  { id: 'rel-06', journey: 'RELACIONAMENTOS', dayIndex: 6, title: 'Empatia e pausa', message: 'Antes de reagir a um conflito, respire fundo e tente ver a perspectiva do outro.' },
  { id: 'rel-07', journey: 'RELACIONAMENTOS', dayIndex: 7, title: 'Cuidado compartilhado', message: 'Proponha algo simples para fazer junto com quem você ama hoje.' },
  { id: 'rel-08', journey: 'RELACIONAMENTOS', dayIndex: 8, title: 'Perdão e leveza', message: 'Solte uma pequena mágoa. A leveza nas relações começa na nossa disposição de perdoar.' },
  { id: 'rel-09', journey: 'RELACIONAMENTOS', dayIndex: 9, title: 'Linguagem do amor', message: 'Como a pessoa ao seu lado se sente amada? Pratique um pequeno gesto nessa linguagem.' },
  { id: 'rel-10', journey: 'RELACIONAMENTOS', dayIndex: 10, title: 'Conexão autêntica', message: 'Seja você mesma. A vulnerabilidade é a ponte mais curta para a intimidade real.' },

  // ROTINA
  { id: 'org-01', journey: 'ROTINA', dayIndex: 1, title: 'Regra dos 2 minutos', message: 'Se algo leva menos de 2 minutos para ser feito, faça agora.', ctaLabel: 'Fazer check-in', ctaAction: 'open_daily_log' },
  { id: 'org-02', journey: 'ROTINA', dayIndex: 2, title: 'As 3 prioridades', message: 'Escreva as 3 coisas mais importantes de hoje. Foque nelas antes de todo o resto.' },
  { id: 'org-03', journey: 'ROTINA', dayIndex: 3, title: 'Destralhe um canto', message: 'Escolha uma gaveta ou espaço pequeno para organizar. Ordem externa traz paz interna.' },
  { id: 'org-04', journey: 'ROTINA', dayIndex: 4, title: 'Planejamento gentil', message: 'Deixe sua roupa ou bolsa pronta para amanhã. Sua versão do futuro vai agradecer.' },
  { id: 'org-05', journey: 'ROTINA', dayIndex: 5, title: 'Blocos de tempo', message: 'Dedique um bloco de tempo sem interrupções para uma tarefa importante.' },
  { id: 'org-06', journey: 'ROTINA', dayIndex: 6, title: 'Limpeza digital', message: 'Apague 10 fotos ou e-mails inúteis hoje. Menos ruído digital, mais foco.' },
  { id: 'org-07', journey: 'ROTINA', dayIndex: 7, title: 'Checklist da noite', message: 'Anote o que ficou pendente para amanhã. Tire da cabeça para dormir melhor.' },
  { id: 'org-08', journey: 'ROTINA', dayIndex: 8, title: 'Ritual de início', message: 'Como você começa seu dia? Crie um pequeno hábito que te traga centro e ordem.' },
  { id: 'org-09', journey: 'ROTINA', dayIndex: 9, title: 'Pausa produtiva', message: 'Pausas planejadas aumentam a eficiência. Pare 10 minutos para recarregar agora.' },
  { id: 'org-10', journey: 'ROTINA', dayIndex: 10, title: 'Flexibilidade', message: 'Planos mudam. Seja organizada o suficiente para ter controle, e flexível para ter paz.' },

  // MATERNIDADE
  { id: 'mat-01', journey: 'MATERNIDADE', dayIndex: 1, title: 'Momento de conexão', message: 'Feche os olhos, coloque a mão no coração e respire 5 vezes devagar. Isso já é autocuidado.', ctaLabel: 'Conversar com NathIA', ctaAction: 'open_assistant' },
  { id: 'mat-02', journey: 'MATERNIDADE', dayIndex: 2, title: 'Seu instinto guia', message: 'Confie na sua intuição hoje. Você é a melhor pessoa para cuidar do seu caminho.' },
  { id: 'mat-03', journey: 'MATERNIDADE', dayIndex: 3, title: 'Autocuidado possível', message: 'No meio da rotina, qual o cuidado mais possível hoje? Um chá, um banho, ou pedir ajuda.' },
  { id: 'mat-04', journey: 'MATERNIDADE', dayIndex: 4, title: 'Presença no agora', message: 'Observe os pequenos detalhes ao seu redor hoje. Sinta as texturas, os sons, os aromas.' },
  { id: 'mat-05', journey: 'MATERNIDADE', dayIndex: 5, title: 'Rede de apoio', message: 'Quem pode te dar uma mão hoje? Aceitar ajuda é um ato de amor próprio.' },
  { id: 'mat-06', journey: 'MATERNIDADE', dayIndex: 6, title: 'Marcos de amor', message: 'Celebre o quão longe você chegou. Cada dia é uma vitória na sua jornada.' },
  { id: 'mat-07', journey: 'MATERNIDADE', dayIndex: 7, title: 'Leveza na rotina', message: 'Se algo não saiu como planejado, tudo bem. O amor importa mais do que a perfeição.' },
  { id: 'mat-08', journey: 'MATERNIDADE', dayIndex: 8, title: 'Você além dos papéis', message: 'O que você gostava de fazer antes? Resgate um pequeno hobby ou prazer hoje.' },
  { id: 'mat-09', journey: 'MATERNIDADE', dayIndex: 9, title: 'Nutrição emocional', message: 'Busque conteúdos que te acolham, não que te cobrem. Você está fazendo o seu melhor.' },
  { id: 'mat-10', journey: 'MATERNIDADE', dayIndex: 10, title: 'Legado de afeto', message: 'Seu cuidado e presença constroem um mundo melhor. Sinta esse valor em você.' },
];

export const getInsightsByJourney = (journey: LifeJourney) =>
  INSIGHTS.filter((i) => i.journey === journey).sort((a, b) => a.dayIndex - b.dayIndex);

export const getMaxDayIndex = (journey: LifeJourney) => {
  const list = getInsightsByJourney(journey);
  return list.length ? list[list.length - 1]!.dayIndex : 1;
};
