/**
 * Validation schemas para inputs críticos - Nossa Maternidade
 * Implementa validação estrutural com Zod conforme security.instructions.md
 *
 * @module utils/validation
 */

import { z } from "zod";

// ============================================
// Schemas de Autenticação
// ============================================

/**
 * Schema de validação para email
 * - Email válido
 * - Máximo 255 caracteres
 * - Lowercase normalizado
 */
export const emailSchema = z
  .string()
  .email("Email inválido")
  .max(255, "Email muito longo")
  .toLowerCase()
  .trim();

/**
 * Schema de validação para senha
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Máximo 128 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 */
export const senhaSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .max(128, "Máximo 128 caracteres")
  .regex(/[A-Z]/, "Deve conter letra maiúscula")
  .regex(/[a-z]/, "Deve conter letra minúscula")
  .regex(/[0-9]/, "Deve conter número")
  .regex(/[^A-Za-z0-9]/, "Deve conter caractere especial");

/**
 * Schema de validação para nome de usuário
 * - Entre 2 e 100 caracteres
 * - Trim de espaços
 */
export const nomeSchema = z.string().min(2, "Nome muito curto").max(100, "Nome muito longo").trim();

// ============================================
// Schemas de Dados Pessoais (LGPD)
// ============================================

/**
 * Valida CPF brasileiro
 * @param cpf - CPF com ou sem formatação
 * @returns true se válido
 */
function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Schema de validação para CPF
 */
export const cpfSchema = z
  .string()
  .regex(/^\d{11}$/, "CPF deve ter 11 dígitos")
  .refine(validarCPF, "CPF inválido");

/**
 * Schema de validação para telefone brasileiro
 * Aceita: 11 dígitos (celular com 9) ou 10 dígitos (fixo)
 */
export const telefoneSchema = z.string().regex(/^\d{10,11}$/, "Telefone inválido");

/**
 * Schema de validação para data ISO
 * Garante que a data não é no futuro
 */
export const dataSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) <= new Date(), {
    message: "Data não pode ser no futuro",
  });

// ============================================
// Schemas Compostos
// ============================================

/**
 * Schema para cadastro de usuário
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: senhaSchema,
  name: nomeSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Schema para login
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha obrigatória"), // Não validar senha no login
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Schema para reset de senha
 */
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// Funções Utilitárias
// ============================================

/**
 * Sanitiza string para prevenir XSS básico
 * Remove caracteres < > e limita tamanho
 *
 * @param input - String a ser sanitizada
 * @param maxLength - Tamanho máximo (padrão: 1000)
 * @returns String sanitizada
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < > para prevenir XSS básico
    .slice(0, maxLength); // Limita tamanho
}

/**
 * Valida e retorna erros de forma estruturada
 *
 * @param schema - Schema Zod para validação
 * @param data - Dados a serem validados
 * @returns { success: true, data } ou { success: false, errors }
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Formatar erros como array de strings
  const errors: string[] = [];
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    errors.push(`${path || "value"}: ${issue.message}`);
  });

  return { success: false, errors };
}

// ============================================
// Schemas de Dados de Saúde (LGPD Crítico)
// ============================================

/**
 * Schema para texto livre (posts, comentários, descrições)
 * - Mínimo 1 caractere (não vazio)
 * - Máximo 5000 caracteres (previne spam)
 * - Trim de espaços
 * - Remove caracteres perigosos (básico)
 */
export const textoSchema = z
  .string()
  .trim()
  .min(1, "Campo não pode estar vazio")
  .max(5000, "Texto muito longo (máximo 5000 caracteres)")
  .transform((val) => sanitizeString(val));

/**
 * Schema para título de hábito/post
 * - Mínimo 3 caracteres
 * - Máximo 200 caracteres
 */
export const tituloSchema = z
  .string()
  .min(3, "Título muito curto (mínimo 3 caracteres)")
  .max(200, "Título muito longo (máximo 200 caracteres)")
  .trim()
  .transform((val) => sanitizeString(val));

/**
 * Schema para URL de imagem
 * - URL válida
 * - Máximo 2000 caracteres
 * - Apenas HTTPS (segurança)
 */
export const imagemUrlSchema = z
  .string()
  .url("URL de imagem inválida")
  .max(2000, "URL muito longa")
  .refine((url) => url.startsWith("https://"), {
    message: "URL deve ser HTTPS",
  })
  .optional();

/**
 * Schema para ID de usuário/recurso (UUID)
 * - Formato UUID válido
 */
export const uuidSchema = z.string().uuid("ID inválido");

/**
 * Schema para frequência de hábito
 * - Valores permitidos: daily, weekly, custom
 */
export const frequenciaSchema = z.enum(["daily", "weekly", "custom"], {
  error: "Frequência inválida",
});

/**
 * Schema para criação de hábito
 * CRÍTICO: Dados de saúde da gestante
 */
export const habitSchema = z.object({
  user_id: uuidSchema,
  title: tituloSchema,
  description: textoSchema.optional(),
  frequency: frequenciaSchema,
  is_active: z.boolean().default(true),
  streak: z.number().int().min(0).max(1000).default(0),
  last_completed_at: dataSchema.optional().nullable(),
});

export type HabitInput = z.infer<typeof habitSchema>;

/**
 * Schema para atualização de hábito
 * Todos os campos opcionais exceto ao menos um deve estar presente
 */
export const habitUpdateSchema = z
  .object({
    title: tituloSchema.optional(),
    description: textoSchema.optional().nullable(),
    frequency: frequenciaSchema.optional(),
    is_active: z.boolean().optional(),
    streak: z.number().int().min(0).max(1000).optional(),
    last_completed_at: dataSchema.optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser atualizado",
  });

export type HabitUpdateInput = z.infer<typeof habitUpdateSchema>;

/**
 * Schema para criação de perfil de usuário
 */
export const userProfileSchema = z.object({
  id: uuidSchema,
  name: nomeSchema,
  email: emailSchema,
  avatar_url: imagemUrlSchema.nullable().optional(),
  pregnancy_stage: z
    .enum([
      "not_pregnant",
      "trying",
      "first_trimester",
      "second_trimester",
      "third_trimester",
      "postpartum",
    ])
    .optional()
    .nullable(),
  interests: z.array(z.string()).optional().nullable(),
  bio: z
    .string()
    .trim()
    .max(500, "Bio muito longa (máximo 500 caracteres)")
    .transform((val) => sanitizeString(val))
    .optional()
    .nullable(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

/**
 * Schema para atualização de perfil
 * Pelo menos um campo deve ser atualizado
 */
export const userProfileUpdateSchema = z
  .object({
    name: nomeSchema.optional(),
    avatar_url: imagemUrlSchema.nullable().optional(),
    pregnancy_stage: z
      .enum([
        "not_pregnant",
        "trying",
        "first_trimester",
        "second_trimester",
        "third_trimester",
        "postpartum",
      ])
      .optional()
      .nullable(),
    interests: z.array(z.string()).optional().nullable(),
    bio: z
      .string()
      .trim()
      .max(500, "Bio muito longa (máximo 500 caracteres)")
      .transform((val) => sanitizeString(val))
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Pelo menos um campo deve ser atualizado",
  });

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

// ============================================
// Schemas de Comunidade
// ============================================

/**
 * Schema para conteúdo de post
 * - Mínimo 1 caractere
 * - Máximo 2000 caracteres
 */
const postContentSchema = z
  .string()
  .min(1, "Post não pode estar vazio")
  .max(2000, "Post muito longo (máximo 2000 caracteres)")
  .trim()
  .transform((val) => sanitizeString(val));

/**
 * Schema para conteúdo de comentário
 * - Mínimo 1 caractere
 * - Máximo 1000 caracteres
 */
const commentContentSchema = z
  .string()
  .min(1, "Comentário não pode estar vazio")
  .max(1000, "Comentário muito longo (máximo 1000 caracteres)")
  .trim()
  .transform((val) => sanitizeString(val));

/**
 * Schema para criação de post na comunidade
 */
export const postSchema = z.object({
  author_id: uuidSchema,
  content: postContentSchema,
  image_url: imagemUrlSchema.nullable().optional(),
  group_id: uuidSchema.optional().nullable(),
  type: z.enum(["text", "image"]).default("text"),
});

export type PostInput = z.infer<typeof postSchema>;

/**
 * Schema para criação de comentário
 */
export const commentSchema = z.object({
  post_id: uuidSchema,
  user_id: uuidSchema,
  content: commentContentSchema,
});

export type CommentInput = z.infer<typeof commentSchema>;

/**
 * Schema para denúncia de conteúdo
 */
export const reportSchema = z.object({
  content_type: z.enum(["post", "comment", "user", "message"]),
  content_id: uuidSchema,
  reason: z.enum([
    "spam",
    "harassment",
    "hate_speech",
    "inappropriate_content",
    "misinformation",
    "impersonation",
    "other",
  ]),
  description: z
    .string()
    .trim()
    .max(500, "Descrição muito longa (máximo 500 caracteres)")
    .transform((val) => sanitizeString(val))
    .optional()
    .nullable(),
});

export type ReportInput = z.infer<typeof reportSchema>;

// ============================================
// Schemas de IA/Chat
// ============================================

/**
 * Schema para conteúdo de mensagem de chat
 * - Mínimo 1 caractere
 * - Máximo 2000 caracteres
 */
const chatContentSchema = z
  .string()
  .min(1, "Mensagem não pode estar vazia")
  .max(2000, "Mensagem muito longa (máximo 2000 caracteres)")
  .trim()
  .transform((val) => sanitizeString(val));

/**
 * Schema para mensagem de chat (NathIA)
 */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: chatContentSchema,
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/**
 * Schema para array de mensagens
 */
export const chatMessagesSchema = z
  .array(chatMessageSchema)
  .min(1, "Pelo menos uma mensagem é necessária");

// ============================================
// Exports de Conveniência
// ============================================

export const schemas = {
  // Autenticação
  email: emailSchema,
  senha: senhaSchema,
  nome: nomeSchema,
  cpf: cpfSchema,
  telefone: telefoneSchema,
  data: dataSchema,
  signUp: signUpSchema,
  signIn: signInSchema,
  resetPassword: resetPasswordSchema,

  // Dados de saúde
  habit: habitSchema,
  habitUpdate: habitUpdateSchema,
  userProfile: userProfileSchema,
  userProfileUpdate: userProfileUpdateSchema,

  // Comunidade
  post: postSchema,
  comment: commentSchema,
  report: reportSchema,

  // IA/Chat
  chatMessage: chatMessageSchema,
  chatMessages: chatMessagesSchema,

  // Utilitários
  texto: textoSchema,
  titulo: tituloSchema,
  imagemUrl: imagemUrlSchema,
  uuid: uuidSchema,
} as const;
