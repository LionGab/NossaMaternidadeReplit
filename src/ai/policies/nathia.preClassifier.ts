/**
 * NathIA Pre-Classifier
 * Detecta keywords de crise, médicas ou de identidade ANTES de chamar LLM
 * Retorna templates fixos para segurança máxima
 */

export type BlockType = "crisis" | "medical" | "identity" | "none";

export interface PreClassifyResult {
  shouldBlock: boolean;
  blockType: BlockType;
  template?: string;
}

/**
 * Keywords de crise que ativam template de emergência
 * NUNCA remove keywords - apenas adiciona
 *
 * IMPORTANTE: Manter sincronizado com supabase/functions/ai/index.ts CRISIS_KEYWORDS
 * O pre-classifier local bloqueia ANTES de chamar API (economia de custo + latência)
 * A Edge Function é safety net (defense in depth)
 */
const CRISIS_KEYWORDS = [
  // Ideação suicida
  "suicídio",
  "suicidio", // sem acento (comum em mobile)
  "quero morrer",
  "me matar",
  "vou me matar",
  "vou me suicidar",
  "não aguento mais",
  "não aguento mais viver",
  "não quero viver",
  "penso em morrer",
  "seria melhor sem mim",
  "meu filho seria melhor sem mim",
  "melhor morta",
  "queria estar morta",
  "acabar com tudo",
  "não tenho saída",
  "ninguém se importa",
  "sou um peso",
  "dirigir pro barranco",
  "pular de",

  // Risco ao bebê
  "machucar o bebê",
  "machucar meu filho",
  "machucar minha filha",
  "fazer mal ao bebê",
  "jogar o bebê",
  "sufocar o bebê",

  // Automutilação
  "me cortar",
  "me machucar",
  "me ferir",
  "sufocar",
  "me bater",

  // Violência doméstica
  "apanhei",
  "bate em mim",
  "meu marido bate",
  "abuso",
  "estupro",
  "ele me bate",

  // Emergência médica
  "sangrando muito",
  "não consigo respirar",
  "bebê não responde",
  "bebê não mexe",
  "dor muito forte",
];

/**
 * Keywords médicas que requerem recusa gentil
 */
const MEDICAL_KEYWORDS = [
  "que remédio",
  "que medicamento",
  "posso tomar",
  "qual dose",
  "isso é depressão",
  "tenho ansiedade",
  "diagnóstico",
  "é normal sangrar",
  "é normal doer",
];

/**
 * Template de crise (CVV 188, SAMU 192)
 * NUNCA alterar números de telefone sem validar oficialidade
 */
const CRISIS_TEMPLATE = `Você está em um momento muito difícil.
Eu não sou serviço de emergência.

LIGUE AGORA:
• CVV: 188 (24h, grátis, confidencial)
• SAMU: 192 (emergência médica)
• Polícia: 190 (violência)

Enquanto liga, tente respirar devagar.
Conte 1-2-3-4 (inspira), segura, 1-2-3-4 (expira).

Você consegue chamar alguém agora (família/amiga)?`;

/**
 * Template médico (recusa gentil + oferta de ajuda organizacional)
 */
const MEDICAL_TEMPLATE = `Aí precisa de profissional de saúde.

Eu não posso dar orientação médica, mas posso te ajudar a:
• Organizar sintomas pra contar pro médico
• Preparar perguntas pra consulta

Quer fazer isso?`;

/**
 * Template de identidade (esclarece que é IA, não a Nathália)
 */
const IDENTITY_TEMPLATE = `Não, sou a NathIA, assistente de IA do app Nossa Maternidade.

Sou inspirada no estilo da Nathália — direta, prática, vida real.
Mas ela é pessoa real, eu sou IA.

O que você precisa agora?`;

/**
 * Pre-classifica mensagem ANTES de chamar LLM
 *
 * @param text - Mensagem do usuário
 * @returns Resultado com flag shouldBlock e template (se aplicável)
 *
 * @example
 * ```typescript
 * const result = preClassifyMessage("Não aguento mais, quero morrer");
 * if (result.shouldBlock) {
 *   // Retorna template CVV 188 SEM chamar LLM
 *   return result.template;
 * }
 * ```
 */
export function preClassifyMessage(text: string): PreClassifyResult {
  const lower = text.toLowerCase();

  // 1. PRIORIDADE MÁXIMA: Crise
  for (const keyword of CRISIS_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        shouldBlock: true,
        blockType: "crisis",
        template: CRISIS_TEMPLATE,
      };
    }
  }

  // 2. Médico (recusa gentil)
  for (const keyword of MEDICAL_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        shouldBlock: true,
        blockType: "medical",
        template: MEDICAL_TEMPLATE,
      };
    }
  }

  // 3. Identidade
  if (lower.includes("você é a nath") || lower.includes("é a nathália")) {
    return {
      shouldBlock: true,
      blockType: "identity",
      template: IDENTITY_TEMPLATE,
    };
  }

  // 4. Nenhum bloqueio - prossegue para LLM
  return {
    shouldBlock: false,
    blockType: "none",
  };
}
