/**
 * Community Configuration
 *
 * Constantes e dados mock para a feature Community
 */

import type { Post } from "../types/navigation";

// ============================================
// TOPIC CHIPS
// ============================================
export interface TopicConfig {
  icon:
    | "help-circle-outline"
    | "chatbubble-outline"
    | "moon-outline"
    | "medical-outline"
    | "heart-outline"
    | "water-outline"
    | "happy-outline"
    | "trophy-outline";
  label: string;
  accent: boolean; // true = rosa (accent), false = azul (primary)
}

export const COMMUNITY_TOPICS: TopicConfig[] = [
  { icon: "help-circle-outline", label: "Dúvida", accent: false },
  { icon: "chatbubble-outline", label: "Desabafo", accent: true },
  { icon: "moon-outline", label: "Sono", accent: false },
  { icon: "medical-outline", label: "Enjoo", accent: false },
  { icon: "heart-outline", label: "Ansiedade", accent: true },
  { icon: "water-outline", label: "Amamentação", accent: true },
  { icon: "happy-outline", label: "Bebê", accent: false },
  { icon: "trophy-outline", label: "Vitória", accent: true },
];

// ============================================
// MOCK POSTS (desenvolvimento)
// ============================================
export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "Mariana Santos",
    content:
      "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. Alguém tem dicas para o primeiro trimestre?",
    likesCount: 45,
    commentsCount: 23,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    type: "duvida",
  },
  {
    id: "2",
    authorId: "user2",
    authorName: "Camila Oliveira",
    content:
      "O sono no terceiro trimestre está impossível. Já tentei almofadas de amamentação, mas nada funciona. O que vocês usam?",
    likesCount: 32,
    commentsCount: 18,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    type: "desabafo",
  },
  {
    id: "3",
    authorId: "user3",
    authorName: "Juliana Costa",
    content:
      "Minha bebê completou 3 meses hoje! O tempo voa. Compartilhando essa conquista com vocês que me apoiaram tanto durante a gestação.",
    likesCount: 89,
    commentsCount: 34,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
    type: "vitoria",
  },
  {
    id: "4",
    authorId: "user4",
    authorName: "Patricia Lima",
    content:
      "Meninas, alguém mais está sentindo muitas dores nas costas? Tenho 28 semanas e está bem desconfortável.",
    likesCount: 28,
    commentsCount: 15,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    isLiked: false,
    type: "duvida",
  },
  {
    id: "5",
    authorId: "user5",
    authorName: "Fernanda Souza",
    content:
      "Acabei de fazer minha primeira ultrassom! Ver o coraçãozinho batendo foi emocionante demais. Chorei muito!",
    likesCount: 156,
    commentsCount: 42,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: true,
    type: "vitoria",
  },
];

// ============================================
// POST TYPES
// ============================================
export const POST_TYPES = {
  duvida: "Dúvida",
  desabafo: "Desabafo",
  vitoria: "Vitória",
  geral: "Geral",
} as const;

export type PostType = keyof typeof POST_TYPES;
