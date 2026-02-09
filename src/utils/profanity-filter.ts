/**
 * Filtro de Palavrões e Conteúdo Impróprio
 * 
 * Sistema de moderação automática para comunidade materno-infantil
 * Detecta:
 * - Palavrões e linguagem ofensiva
 * - Conteúdo sensível
 * - Spam e links suspeitos
 * - Conteúdo potencialmente prejudicial
 */

export type ProfanityCategory = 
  | "profanity"      // Palavrões
  | "offensive"      // Conteúdo ofensivo
  | "spam"           // Spam/links
  | "sensitive"      // Conteúdo sensível
  | "harmful";       // Potencialmente prejudicial

export interface ProfanityResult {
  isClean: boolean;
  score: number; // 0-100, quanto maior mais problemático
  categories: ProfanityCategory[];
  flaggedTerms: string[];
  suggestion: string | null;
}

// Lista de palavrões em português brasileiro (censurada para código)
// Inclui variações comuns e leetspeak
const PROFANITY_LIST: string[] = [
  // Palavrões graves
  "porra", "p0rra", "caralho", "car4lho", "c4r4lh0",
  "merda", "m3rd4", "bosta", "coco", "foda", "f0d4",
  "buceta", "buc3t4", "xoxota", "xereca", "pinto",
  "pau", "rola", "piroca", "cacete", "filha da puta",
  "filho da puta", "fdp", "pqp", "vsf", "tnc",
  "viado", "vi4d0", "bicha", "sapatão", "traveco",
  "vaca", "vagabunda", "piranha", "prostituta", "puta",
  "arrombado", "cuzão", "cu", "bunda", "idiota",
  "imbecil", "retardado", "mongol", "débil", "otário",
  "babaca", "cretino", "desgraça", "desgraçado",
  
  // Insultos direcionados a mães
  "mãe ruim", "má mãe", "péssima mãe",
  
  // Termos perigosos
  "suicídio", "suicida", "se matar", "me matar",
  "aborto ilegal", "abortar sozinha",
];

// Palavras sensíveis que precisam contexto (não bloqueiam automaticamente)
const SENSITIVE_TERMS: string[] = [
  "depressão", "ansiedade", "pânico", "tristeza profunda",
  "não aguento mais", "exausta", "sozinha", "abandonada",
  "marido", "violência", "agressão", "bater", "machucar",
];

// Padrões de spam
const SPAM_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s]+/gi,            // Links HTTP
  /www\.[^\s]+/gi,                   // Links www
  /bit\.ly|t\.co|goo\.gl/gi,        // Encurtadores
  /compre\s+agora/gi,                // Propaganda
  /clique\s+aqui/gi,
  /promoção\s+imperdível/gi,
  /ganhe\s+dinheiro/gi,
  /r\$\s*\d+[.,]?\d*/gi,            // Valores monetários
  /(\d{2,3}[.\-\s]?\d{3,5}[.\-\s]?\d{4})/gi, // Telefones
  /@[a-zA-Z0-9_]+/g,                // Menções (@usuario)
];

// Substitui leetspeak para normalização
function normalizeLeetspeak(text: string): string {
  return text
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");
}

// Remove acentos para comparação
function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Analisa texto para conteúdo impróprio
 */
export function analyzeProfanity(text: string): ProfanityResult {
  const normalizedText = normalizeLeetspeak(removeAccents(text));
  const originalLower = text.toLowerCase();
  
  const categories: Set<ProfanityCategory> = new Set();
  const flaggedTerms: string[] = [];
  let score = 0;

  // 1. Verificar palavrões
  for (const word of PROFANITY_LIST) {
    const normalizedWord = normalizeLeetspeak(removeAccents(word));
    if (normalizedText.includes(normalizedWord)) {
      categories.add("profanity");
      flaggedTerms.push(word);
      score += 25;
    }
  }

  // 2. Verificar termos sensíveis
  for (const term of SENSITIVE_TERMS) {
    const normalizedTerm = normalizeLeetspeak(removeAccents(term));
    if (normalizedText.includes(normalizedTerm)) {
      categories.add("sensitive");
      flaggedTerms.push(term);
      score += 10;
    }
  }

  // 3. Verificar spam
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(originalLower)) {
      categories.add("spam");
      const matches = originalLower.match(pattern);
      if (matches) {
        flaggedTerms.push(...matches.slice(0, 3));
      }
      score += 15;
    }
    // Reset regex lastIndex
    pattern.lastIndex = 0;
  }

  // 4. Verificar CAPS excessivo (grito)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / Math.max(text.length, 1);
  if (capsRatio > 0.5 && text.length > 20) {
    categories.add("offensive");
    score += 5;
  }

  // 5. Verificar repetição excessiva (spam behavior)
  const repeatedChars = /(.)\1{4,}/g;
  if (repeatedChars.test(text)) {
    categories.add("spam");
    score += 5;
  }

  // Limitar score a 100
  score = Math.min(score, 100);

  // Determinar sugestão
  let suggestion: string | null = null;
  if (categories.has("profanity")) {
    suggestion = "Por favor, use uma linguagem mais respeitosa na comunidade.";
  } else if (categories.has("spam")) {
    suggestion = "Links e promoções não são permitidos na comunidade.";
  } else if (categories.has("sensitive")) {
    suggestion = "Seu post contém temas sensíveis. Considere buscar apoio profissional se necessário.";
  }

  return {
    isClean: score < 15,
    score,
    categories: Array.from(categories),
    flaggedTerms: [...new Set(flaggedTerms)],
    suggestion,
  };
}

/**
 * Censura palavrões no texto (substitui por asteriscos)
 */
export function censorProfanity(text: string): string {
  let censored = text;
  
  for (const word of PROFANITY_LIST) {
    const regex = new RegExp(word, "gi");
    censored = censored.replace(regex, (match) => 
      match[0] + "*".repeat(match.length - 2) + match[match.length - 1]
    );
  }
  
  return censored;
}

/**
 * Verifica se texto precisa de moderação humana
 */
export function needsHumanReview(result: ProfanityResult): boolean {
  // Score médio ou categorias sensíveis precisam review
  if (result.score >= 15 && result.score < 50) return true;
  if (result.categories.includes("sensitive")) return true;
  if (result.categories.includes("harmful")) return true;
  return false;
}

/**
 * Verifica se texto deve ser bloqueado automaticamente
 */
export function shouldAutoBlock(result: ProfanityResult): boolean {
  // Score alto ou palavrões graves = bloqueio automático
  return result.score >= 50 || result.categories.includes("profanity");
}
