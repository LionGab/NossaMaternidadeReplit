/**
 * Query Key Factory - TanStack Query
 *
 * Factory pattern para query keys, garantindo consistência
 * e facilitando invalidação de queries.
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
 */

/**
 * Query keys para posts da comunidade
 */
export const communityKeys = {
  // Raiz - invalida todas as queries relacionadas a comunidade
  all: ["community"] as const,

  // Lista de posts com filtros opcionais
  posts: (filters?: { limit?: number; offset?: number }) =>
    filters
      ? ([...communityKeys.all, "posts", filters] as const)
      : ([...communityKeys.all, "posts"] as const),

  // Post individual
  post: (id: string) => [...communityKeys.all, "post", id] as const,

  // Comentários de um post
  comments: (postId: string) => [...communityKeys.all, "comments", postId] as const,

  // Busca de posts
  search: (query: string) => [...communityKeys.all, "search", query] as const,

  // Stats da comunidade
  stats: () => [...communityKeys.all, "stats"] as const,

  // Grupos
  groups: () => [...communityKeys.all, "groups"] as const,
  group: (id: string) => [...communityKeys.all, "group", id] as const,
};

/**
 * Query keys para dados do usuário
 */
export const userKeys = {
  // Raiz
  all: ["user"] as const,

  // Perfil do usuário atual
  profile: () => [...userKeys.all, "profile"] as const,

  // Posts do usuário atual
  myPosts: (filters?: { limit?: number; offset?: number }) =>
    filters
      ? ([...userKeys.all, "myPosts", filters] as const)
      : ([...userKeys.all, "myPosts"] as const),

  // Preferências
  preferences: () => [...userKeys.all, "preferences"] as const,

  // Dados de gravidez
  pregnancyData: () => [...userKeys.all, "pregnancy"] as const,

  // Lembretes
  reminders: () => [...userKeys.all, "reminders"] as const,
};

/**
 * Query keys para conteúdo (Mundo da Nath, etc)
 */
export const contentKeys = {
  // Raiz
  all: ["content"] as const,

  // Posts do Mundo da Nath
  mundoNathPosts: (filters?: { status?: string }) =>
    filters
      ? ([...contentKeys.all, "mundoNath", filters] as const)
      : ([...contentKeys.all, "mundoNath"] as const),

  // Post individual do Mundo da Nath
  mundoNathPost: (id: string) => [...contentKeys.all, "mundoNath", id] as const,

  // Afirmações diárias
  affirmations: () => [...contentKeys.all, "affirmations"] as const,
};

/**
 * Query keys para hábitos
 */
export const habitsKeys = {
  // Raiz
  all: ["habits"] as const,

  // Lista de hábitos
  list: () => [...habitsKeys.all, "list"] as const,

  // Hábito individual
  habit: (id: string) => [...habitsKeys.all, "habit", id] as const,

  // Logs de hábito por data
  logs: (date: string) => [...habitsKeys.all, "logs", date] as const,

  // Progresso semanal
  weeklyProgress: () => [...habitsKeys.all, "weekly"] as const,
};

/**
 * Query keys para ciclo menstrual
 */
export const cycleKeys = {
  // Raiz
  all: ["cycle"] as const,

  // Dados do ciclo (settings + logs)
  data: () => [...cycleKeys.all, "data"] as const,

  // Configurações
  settings: () => [...cycleKeys.all, "settings"] as const,

  // Logs diários
  logs: () => [...cycleKeys.all, "logs"] as const,
};

/**
 * Query keys para NathIA (chat AI)
 */
export const nathiaKeys = {
  // Raiz
  all: ["nathia"] as const,

  // Histórico de conversas
  conversations: () => [...nathiaKeys.all, "conversations"] as const,

  // Conversa específica
  conversation: (id: string) => [...nathiaKeys.all, "conversation", id] as const,

  // Mensagens de uma conversa
  messages: (conversationId: string) => [...nathiaKeys.all, "messages", conversationId] as const,
};

/**
 * Query keys para premium/RevenueCat
 */
export const premiumKeys = {
  // Raiz
  all: ["premium"] as const,

  // Status de assinatura
  subscription: () => [...premiumKeys.all, "subscription"] as const,

  // Ofertas disponíveis
  offerings: () => [...premiumKeys.all, "offerings"] as const,
};
