export type PostStatus = "draft" | "submitted" | "approved" | "rejected" | "needs_changes";
export type MediaType = "text" | "image" | "video";

// Tipos de denúncia disponíveis
export type ReportReason =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "inappropriate_content"
  | "misinformation"
  | "impersonation"
  | "other";

// Tipo de conteúdo que pode ser denunciado
export type ReportContentType = "post" | "comment" | "user" | "message";

// Interface para denúncia
export interface UserReport {
  id: string;
  reporter_id: string;
  content_type: ReportContentType;
  content_id: string;
  reason: ReportReason;
  description: string | null;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  created_at: string;
}

// Interface para bloqueio de usuário
export interface UserBlock {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export interface CommunityPost {
  id: string;
  author_id: string;
  text: string | null;
  media_path: string | null;
  media_type: MediaType;
  tags: string[] | null;
  status: PostStatus;
  review_reason: string | null;
  created_at: string;
  published_at: string | null;
  // Contadores agregados do banco
  likes_count?: number | null;
  comments_count?: number | null;
  // Campos virtuais
  isLiked?: boolean;
  profiles?: {
    name: string;
    avatar_url: string;
  };
  signed_media_url?: string | null;
}

export interface MundoNathPost {
  id: string;
  type: MediaType;
  text: string | null;
  media_path: string | null;
  is_published: boolean;
  published_at: string;
  created_at?: string;
  signed_media_url?: string | null;
  is_locked?: boolean;
}

// Admin types for Mundo da Nath
export type MundoNathPostStatus = "draft" | "scheduled" | "published" | "archived";

export interface MundoNathPostAdmin extends MundoNathPost {
  title?: string | null;
  status?: MundoNathPostStatus;
  scheduled_at?: string | null;
  expires_at?: string | null;
  author_id?: string | null;
}

export interface AdminPostsStats {
  published: number;
  draft: number;
  scheduled: number;
  total: number;
}
