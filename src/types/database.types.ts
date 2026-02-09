export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      affirmations: {
        Row: {
          author: string | null;
          category: Database["public"]["Enums"]["affirmation_category"];
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          mood_contexts: string[] | null;
          recommended_for: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          source: string | null;
          text: string;
          times_favorited: number | null;
          times_shown: number | null;
        };
        Insert: {
          author?: string | null;
          category: Database["public"]["Enums"]["affirmation_category"];
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          mood_contexts?: string[] | null;
          recommended_for?: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          source?: string | null;
          text: string;
          times_favorited?: number | null;
          times_shown?: number | null;
        };
        Update: {
          author?: string | null;
          category?: Database["public"]["Enums"]["affirmation_category"];
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          mood_contexts?: string[] | null;
          recommended_for?: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          source?: string | null;
          text?: string;
          times_favorited?: number | null;
          times_shown?: number | null;
        };
        Relationships: [];
      };
      ai_context_cache: {
        Row: {
          baby_age_days: number | null;
          context_data: Json;
          context_summary: string | null;
          current_mood_trend: string | null;
          current_stage: Database["public"]["Enums"]["pregnancy_stage"] | null;
          current_streak: number | null;
          days_until_due: number | null;
          id: string;
          last_check_in_date: string | null;
          last_updated: string | null;
          user_id: string;
          version: number | null;
        };
        Insert: {
          baby_age_days?: number | null;
          context_data?: Json;
          context_summary?: string | null;
          current_mood_trend?: string | null;
          current_stage?: Database["public"]["Enums"]["pregnancy_stage"] | null;
          current_streak?: number | null;
          days_until_due?: number | null;
          id?: string;
          last_check_in_date?: string | null;
          last_updated?: string | null;
          user_id: string;
          version?: number | null;
        };
        Update: {
          baby_age_days?: number | null;
          context_data?: Json;
          context_summary?: string | null;
          current_mood_trend?: string | null;
          current_stage?: Database["public"]["Enums"]["pregnancy_stage"] | null;
          current_streak?: number | null;
          days_until_due?: number | null;
          id?: string;
          last_check_in_date?: string | null;
          last_updated?: string | null;
          user_id?: string;
          version?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_context_cache_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_context_cache_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      ai_insights: {
        Row: {
          category: string | null;
          confidence_score: number | null;
          created_at: string | null;
          description: string;
          dismissed_at: string | null;
          expires_at: string | null;
          id: string;
          insight_type: string;
          is_acted_upon: boolean | null;
          is_dismissed: boolean | null;
          priority: number | null;
          recommendation: string | null;
          supporting_data: Json | null;
          title: string;
          user_id: string;
        };
        Insert: {
          category?: string | null;
          confidence_score?: number | null;
          created_at?: string | null;
          description: string;
          dismissed_at?: string | null;
          expires_at?: string | null;
          id?: string;
          insight_type: string;
          is_acted_upon?: boolean | null;
          is_dismissed?: boolean | null;
          priority?: number | null;
          recommendation?: string | null;
          supporting_data?: Json | null;
          title: string;
          user_id: string;
        };
        Update: {
          category?: string | null;
          confidence_score?: number | null;
          created_at?: string | null;
          description?: string;
          dismissed_at?: string | null;
          expires_at?: string | null;
          id?: string;
          insight_type?: string;
          is_acted_upon?: boolean | null;
          is_dismissed?: boolean | null;
          priority?: number | null;
          recommendation?: string | null;
          supporting_data?: Json | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_insights_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_insights_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      analytics_conversions: {
        Row: {
          conversion_event: string;
          created_at: string | null;
          id: string;
          is_first_time: boolean | null;
          properties: Json | null;
          user_id_hash: string;
        };
        Insert: {
          conversion_event: string;
          created_at?: string | null;
          id?: string;
          is_first_time?: boolean | null;
          properties?: Json | null;
          user_id_hash: string;
        };
        Update: {
          conversion_event?: string;
          created_at?: string | null;
          id?: string;
          is_first_time?: boolean | null;
          properties?: Json | null;
          user_id_hash?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          app_version: string | null;
          category: string;
          created_at: string | null;
          device_model: string | null;
          device_platform: string | null;
          duration_ms: number | null;
          event_name: string;
          id: string;
          locale: string | null;
          os_version: string | null;
          properties: Json | null;
          screen_name: string | null;
          session_id: string | null;
          timezone: string | null;
          user_id_hash: string;
        };
        Insert: {
          app_version?: string | null;
          category: string;
          created_at?: string | null;
          device_model?: string | null;
          device_platform?: string | null;
          duration_ms?: number | null;
          event_name: string;
          id?: string;
          locale?: string | null;
          os_version?: string | null;
          properties?: Json | null;
          screen_name?: string | null;
          session_id?: string | null;
          timezone?: string | null;
          user_id_hash: string;
        };
        Update: {
          app_version?: string | null;
          category?: string;
          created_at?: string | null;
          device_model?: string | null;
          device_platform?: string | null;
          duration_ms?: number | null;
          event_name?: string;
          id?: string;
          locale?: string | null;
          os_version?: string | null;
          properties?: Json | null;
          screen_name?: string | null;
          session_id?: string | null;
          timezone?: string | null;
          user_id_hash?: string;
        };
        Relationships: [];
      };
      analytics_feature_usage: {
        Row: {
          avg_duration_seconds: number | null;
          created_at: string | null;
          feature_name: string;
          id: string;
          period_date: string;
          period_type: string;
          success_rate: number | null;
          total_uses: number | null;
          unique_users: number | null;
          updated_at: string | null;
        };
        Insert: {
          avg_duration_seconds?: number | null;
          created_at?: string | null;
          feature_name: string;
          id?: string;
          period_date: string;
          period_type?: string;
          success_rate?: number | null;
          total_uses?: number | null;
          unique_users?: number | null;
          updated_at?: string | null;
        };
        Update: {
          avg_duration_seconds?: number | null;
          created_at?: string | null;
          feature_name?: string;
          id?: string;
          period_date?: string;
          period_type?: string;
          success_rate?: number | null;
          total_uses?: number | null;
          unique_users?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      analytics_sessions: {
        Row: {
          created_at: string | null;
          duration_seconds: number | null;
          ended_at: string | null;
          entry_screen: string | null;
          event_count: number | null;
          exit_screen: string | null;
          id: string;
          last_activity_at: string | null;
          referrer: string | null;
          screen_count: number | null;
          session_id: string;
          started_at: string;
          user_id_hash: string;
        };
        Insert: {
          created_at?: string | null;
          duration_seconds?: number | null;
          ended_at?: string | null;
          entry_screen?: string | null;
          event_count?: number | null;
          exit_screen?: string | null;
          id?: string;
          last_activity_at?: string | null;
          referrer?: string | null;
          screen_count?: number | null;
          session_id: string;
          started_at?: string;
          user_id_hash: string;
        };
        Update: {
          created_at?: string | null;
          duration_seconds?: number | null;
          ended_at?: string | null;
          entry_screen?: string | null;
          event_count?: number | null;
          exit_screen?: string | null;
          id?: string;
          last_activity_at?: string | null;
          referrer?: string | null;
          screen_count?: number | null;
          session_id?: string;
          started_at?: string;
          user_id_hash?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          created_at: string | null;
          event_type: string;
          id: string;
          metadata: Json | null;
          user_id_hash: string;
        };
        Insert: {
          created_at?: string | null;
          event_type: string;
          id?: string;
          metadata?: Json | null;
          user_id_hash: string;
        };
        Update: {
          created_at?: string | null;
          event_type?: string;
          id?: string;
          metadata?: Json | null;
          user_id_hash?: string;
        };
        Relationships: [];
      };
      chat_conversations: {
        Row: {
          context_snapshot: Json | null;
          created_at: string | null;
          id: string;
          last_message_at: string | null;
          message_count: number | null;
          sentiment_average: number | null;
          status: Database["public"]["Enums"]["conversation_status"] | null;
          summary: string | null;
          title: string | null;
          topics: string[] | null;
          updated_at: string | null;
          user_id: string;
          user_message_count: number | null;
        };
        Insert: {
          context_snapshot?: Json | null;
          created_at?: string | null;
          id?: string;
          last_message_at?: string | null;
          message_count?: number | null;
          sentiment_average?: number | null;
          status?: Database["public"]["Enums"]["conversation_status"] | null;
          summary?: string | null;
          title?: string | null;
          topics?: string[] | null;
          updated_at?: string | null;
          user_id: string;
          user_message_count?: number | null;
        };
        Update: {
          context_snapshot?: Json | null;
          created_at?: string | null;
          id?: string;
          last_message_at?: string | null;
          message_count?: number | null;
          sentiment_average?: number | null;
          status?: Database["public"]["Enums"]["conversation_status"] | null;
          summary?: string | null;
          title?: string | null;
          topics?: string[] | null;
          updated_at?: string | null;
          user_id?: string;
          user_message_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          audio_duration_seconds: number | null;
          audio_url: string | null;
          content: string;
          content_type: Database["public"]["Enums"]["message_content_type"] | null;
          conversation_id: string;
          created_at: string | null;
          feedback: string | null;
          id: string;
          image_analysis: string | null;
          image_url: string | null;
          is_helpful: boolean | null;
          model_used: string | null;
          response_time_ms: number | null;
          role: Database["public"]["Enums"]["message_role"];
          sentiment_score: number | null;
          tokens_used: number | null;
          transcription: string | null;
          user_id: string;
        };
        Insert: {
          audio_duration_seconds?: number | null;
          audio_url?: string | null;
          content: string;
          content_type?: Database["public"]["Enums"]["message_content_type"] | null;
          conversation_id: string;
          created_at?: string | null;
          feedback?: string | null;
          id?: string;
          image_analysis?: string | null;
          image_url?: string | null;
          is_helpful?: boolean | null;
          model_used?: string | null;
          response_time_ms?: number | null;
          role: Database["public"]["Enums"]["message_role"];
          sentiment_score?: number | null;
          tokens_used?: number | null;
          transcription?: string | null;
          user_id: string;
        };
        Update: {
          audio_duration_seconds?: number | null;
          audio_url?: string | null;
          content?: string;
          content_type?: Database["public"]["Enums"]["message_content_type"] | null;
          conversation_id?: string;
          created_at?: string | null;
          feedback?: string | null;
          id?: string;
          image_analysis?: string | null;
          image_url?: string | null;
          is_helpful?: boolean | null;
          model_used?: string | null;
          response_time_ms?: number | null;
          role?: Database["public"]["Enums"]["message_role"];
          sentiment_score?: number | null;
          tokens_used?: number | null;
          transcription?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "chat_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      comment_likes: {
        Row: {
          comment_id: string;
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "community_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      community_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          is_deleted: boolean | null;
          likes_count: number | null;
          moderation_status: Database["public"]["Enums"]["moderation_status"] | null;
          parent_id: string | null;
          post_id: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          likes_count?: number | null;
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null;
          parent_id?: string | null;
          post_id: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          likes_count?: number | null;
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null;
          parent_id?: string | null;
          post_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "community_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "community_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_groups: {
        Row: {
          category: Database["public"]["Enums"]["group_category"] | null;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          is_private: boolean | null;
          member_count: number | null;
          name: string;
          post_count: number | null;
          requires_approval: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          category?: Database["public"]["Enums"]["group_category"] | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_private?: boolean | null;
          member_count?: number | null;
          name: string;
          post_count?: number | null;
          requires_approval?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          category?: Database["public"]["Enums"]["group_category"] | null;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_private?: boolean | null;
          member_count?: number | null;
          name?: string;
          post_count?: number | null;
          requires_approval?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "community_groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_groups_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      community_post_reports: {
        Row: {
          created_at: string | null;
          id: string;
          post_id: string | null;
          reason: string;
          reporter_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          reason: string;
          reporter_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          post_id?: string | null;
          reason?: string;
          reporter_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "community_post_reports_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
        ];
      };
      community_posts: {
        Row: {
          author_id: string;
          comments_count: number | null;
          content: string;
          created_at: string | null;
          deleted_at: string | null;
          group_id: string | null;
          hidden_reason: string | null;
          id: string;
          image_url: string | null;
          is_deleted: boolean | null;
          is_hidden: boolean | null;
          is_pinned: boolean | null;
          likes_count: number | null;
          moderation_status: Database["public"]["Enums"]["moderation_status"] | null;
          published_at: string | null;
          review_reason: string | null;
          status: Database["public"]["Enums"]["post_status"] | null;
          submitted_at: string | null;
          type: Database["public"]["Enums"]["post_type"] | null;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          comments_count?: number | null;
          content: string;
          created_at?: string | null;
          deleted_at?: string | null;
          group_id?: string | null;
          hidden_reason?: string | null;
          id?: string;
          image_url?: string | null;
          is_deleted?: boolean | null;
          is_hidden?: boolean | null;
          is_pinned?: boolean | null;
          likes_count?: number | null;
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null;
          published_at?: string | null;
          review_reason?: string | null;
          status?: Database["public"]["Enums"]["post_status"] | null;
          submitted_at?: string | null;
          type?: Database["public"]["Enums"]["post_type"] | null;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          comments_count?: number | null;
          content?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          group_id?: string | null;
          hidden_reason?: string | null;
          id?: string;
          image_url?: string | null;
          is_deleted?: boolean | null;
          is_hidden?: boolean | null;
          is_pinned?: boolean | null;
          likes_count?: number | null;
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null;
          published_at?: string | null;
          review_reason?: string | null;
          status?: Database["public"]["Enums"]["post_status"] | null;
          submitted_at?: string | null;
          type?: Database["public"]["Enums"]["post_type"] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "community_posts_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "community_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      community_rules_acceptance: {
        Row: {
          accepted_at: string | null;
          id: string;
          user_id: string | null;
          version: string;
        };
        Insert: {
          accepted_at?: string | null;
          id?: string;
          user_id?: string | null;
          version: string;
        };
        Update: {
          accepted_at?: string | null;
          id?: string;
          user_id?: string | null;
          version?: string;
        };
        Relationships: [];
      };
      community_user_blocks: {
        Row: {
          blocked_user_id: string | null;
          created_at: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          blocked_user_id?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          blocked_user_id?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      cycle_logs: {
        Row: {
          cervical_mucus: Database["public"]["Enums"]["discharge_level"] | null;
          created_at: string | null;
          date: string;
          flow: Database["public"]["Enums"]["flow_level"] | null;
          id: string;
          is_period: boolean | null;
          notes: string | null;
          ovulation_test_positive: boolean | null;
          symptoms: Database["public"]["Enums"]["symptom_type"][] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cervical_mucus?: Database["public"]["Enums"]["discharge_level"] | null;
          created_at?: string | null;
          date: string;
          flow?: Database["public"]["Enums"]["flow_level"] | null;
          id?: string;
          is_period?: boolean | null;
          notes?: string | null;
          ovulation_test_positive?: boolean | null;
          symptoms?: Database["public"]["Enums"]["symptom_type"][] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cervical_mucus?: Database["public"]["Enums"]["discharge_level"] | null;
          created_at?: string | null;
          date?: string;
          flow?: Database["public"]["Enums"]["flow_level"] | null;
          id?: string;
          is_period?: boolean | null;
          notes?: string | null;
          ovulation_test_positive?: boolean | null;
          symptoms?: Database["public"]["Enums"]["symptom_type"][] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cycle_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cycle_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      cycle_settings: {
        Row: {
          created_at: string | null;
          current_phase: string | null;
          cycle_length: number | null;
          id: string;
          last_period_start: string | null;
          notify_fertile_window: boolean | null;
          notify_ovulation: boolean | null;
          notify_period_prediction: boolean | null;
          period_length: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          current_phase?: string | null;
          cycle_length?: number | null;
          id?: string;
          last_period_start?: string | null;
          notify_fertile_window?: boolean | null;
          notify_ovulation?: boolean | null;
          notify_period_prediction?: boolean | null;
          period_length?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          current_phase?: string | null;
          cycle_length?: number | null;
          id?: string;
          last_period_start?: string | null;
          notify_fertile_window?: boolean | null;
          notify_ovulation?: boolean | null;
          notify_period_prediction?: boolean | null;
          period_length?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cycle_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cycle_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      daily_check_ins: {
        Row: {
          check_in_time: string | null;
          completed_at: string | null;
          created_at: string | null;
          date: string;
          energy_score: number | null;
          gratitude: string[] | null;
          how_feeling: string | null;
          id: string;
          mood_score: number | null;
          notes: string | null;
          sleep_hours: number | null;
          sleep_score: number | null;
          today_intention: string | null;
          today_priority: string | null;
          top_emotion: string | null;
          updated_at: string | null;
          user_id: string;
          wake_ups: number | null;
        };
        Insert: {
          check_in_time?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          date: string;
          energy_score?: number | null;
          gratitude?: string[] | null;
          how_feeling?: string | null;
          id?: string;
          mood_score?: number | null;
          notes?: string | null;
          sleep_hours?: number | null;
          sleep_score?: number | null;
          today_intention?: string | null;
          today_priority?: string | null;
          top_emotion?: string | null;
          updated_at?: string | null;
          user_id: string;
          wake_ups?: number | null;
        };
        Update: {
          check_in_time?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          date?: string;
          energy_score?: number | null;
          gratitude?: string[] | null;
          how_feeling?: string | null;
          id?: string;
          mood_score?: number | null;
          notes?: string | null;
          sleep_hours?: number | null;
          sleep_score?: number | null;
          today_intention?: string | null;
          today_priority?: string | null;
          top_emotion?: string | null;
          updated_at?: string | null;
          user_id?: string;
          wake_ups?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "daily_check_ins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_check_ins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      daily_logs: {
        Row: {
          anxiety_score: number | null;
          baby_mood: string | null;
          baby_sleep_hours: number | null;
          breastfeeding_count: number | null;
          challenges: string[] | null;
          created_at: string | null;
          date: string;
          discharge: Database["public"]["Enums"]["discharge_level"] | null;
          energy_score: number | null;
          exercise_minutes: number | null;
          exercise_type: string | null;
          feeling_description: string | null;
          gratitude_notes: string[] | null;
          highlights: string[] | null;
          id: string;
          medications: string[] | null;
          mood_score: number | null;
          moods: Database["public"]["Enums"]["mood_type"][] | null;
          notes: string | null;
          pumping_ml: number | null;
          sentiment_magnitude: number | null;
          sentiment_score: number | null;
          sex_activity: Database["public"]["Enums"]["sex_activity_type"] | null;
          sleep_hours: number | null;
          sleep_quality: number | null;
          stress_score: number | null;
          supplements: string[] | null;
          symptoms: Database["public"]["Enums"]["symptom_type"][] | null;
          tags: string[] | null;
          temperature: number | null;
          updated_at: string | null;
          user_id: string;
          water_ml: number | null;
          weight_kg: number | null;
        };
        Insert: {
          anxiety_score?: number | null;
          baby_mood?: string | null;
          baby_sleep_hours?: number | null;
          breastfeeding_count?: number | null;
          challenges?: string[] | null;
          created_at?: string | null;
          date: string;
          discharge?: Database["public"]["Enums"]["discharge_level"] | null;
          energy_score?: number | null;
          exercise_minutes?: number | null;
          exercise_type?: string | null;
          feeling_description?: string | null;
          gratitude_notes?: string[] | null;
          highlights?: string[] | null;
          id?: string;
          medications?: string[] | null;
          mood_score?: number | null;
          moods?: Database["public"]["Enums"]["mood_type"][] | null;
          notes?: string | null;
          pumping_ml?: number | null;
          sentiment_magnitude?: number | null;
          sentiment_score?: number | null;
          sex_activity?: Database["public"]["Enums"]["sex_activity_type"] | null;
          sleep_hours?: number | null;
          sleep_quality?: number | null;
          stress_score?: number | null;
          supplements?: string[] | null;
          symptoms?: Database["public"]["Enums"]["symptom_type"][] | null;
          tags?: string[] | null;
          temperature?: number | null;
          updated_at?: string | null;
          user_id: string;
          water_ml?: number | null;
          weight_kg?: number | null;
        };
        Update: {
          anxiety_score?: number | null;
          baby_mood?: string | null;
          baby_sleep_hours?: number | null;
          breastfeeding_count?: number | null;
          challenges?: string[] | null;
          created_at?: string | null;
          date?: string;
          discharge?: Database["public"]["Enums"]["discharge_level"] | null;
          energy_score?: number | null;
          exercise_minutes?: number | null;
          exercise_type?: string | null;
          feeling_description?: string | null;
          gratitude_notes?: string[] | null;
          highlights?: string[] | null;
          id?: string;
          medications?: string[] | null;
          mood_score?: number | null;
          moods?: Database["public"]["Enums"]["mood_type"][] | null;
          notes?: string | null;
          pumping_ml?: number | null;
          sentiment_magnitude?: number | null;
          sentiment_score?: number | null;
          sex_activity?: Database["public"]["Enums"]["sex_activity_type"] | null;
          sleep_hours?: number | null;
          sleep_quality?: number | null;
          stress_score?: number | null;
          supplements?: string[] | null;
          symptoms?: Database["public"]["Enums"]["symptom_type"][] | null;
          tags?: string[] | null;
          temperature?: number | null;
          updated_at?: string | null;
          user_id?: string;
          water_ml?: number | null;
          weight_kg?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "daily_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      deletion_requests: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          ip_address: string | null;
          notes: string | null;
          processed_at: string | null;
          requested_at: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          ip_address?: string | null;
          notes?: string | null;
          processed_at?: string | null;
          requested_at?: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          ip_address?: string | null;
          notes?: string | null;
          processed_at?: string | null;
          requested_at?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          group_id: string;
          id: string;
          joined_at: string | null;
          role: string | null;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          joined_at?: string | null;
          role?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "community_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "group_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      habit_completions: {
        Row: {
          completed_at: string | null;
          date: string;
          habit_id: string;
          id: string;
          notes: string | null;
          satisfaction_score: number | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          date: string;
          habit_id: string;
          id?: string;
          notes?: string | null;
          satisfaction_score?: number | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          date?: string;
          habit_id?: string;
          id?: string;
          notes?: string | null;
          satisfaction_score?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      habit_templates: {
        Row: {
          category: Database["public"]["Enums"]["habit_category"] | null;
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          recommended_for: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          sort_order: number | null;
          title: string;
        };
        Insert: {
          category?: Database["public"]["Enums"]["habit_category"] | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          recommended_for?: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          sort_order?: number | null;
          title: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["habit_category"] | null;
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          recommended_for?: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          sort_order?: number | null;
          title?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          best_streak: number | null;
          category: Database["public"]["Enums"]["habit_category"] | null;
          color: string | null;
          created_at: string | null;
          current_streak: number | null;
          description: string | null;
          frequency: Database["public"]["Enums"]["habit_frequency"] | null;
          icon: string | null;
          id: string;
          is_active: boolean | null;
          is_default: boolean | null;
          last_completed_at: string | null;
          sort_order: number | null;
          target_count: number | null;
          target_days: number[] | null;
          title: string;
          total_completions: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          best_streak?: number | null;
          category?: Database["public"]["Enums"]["habit_category"] | null;
          color?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          description?: string | null;
          frequency?: Database["public"]["Enums"]["habit_frequency"] | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          last_completed_at?: string | null;
          sort_order?: number | null;
          target_count?: number | null;
          target_days?: number[] | null;
          title: string;
          total_completions?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          best_streak?: number | null;
          category?: Database["public"]["Enums"]["habit_category"] | null;
          color?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          description?: string | null;
          frequency?: Database["public"]["Enums"]["habit_frequency"] | null;
          icon?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          last_completed_at?: string | null;
          sort_order?: number | null;
          target_count?: number | null;
          target_days?: number[] | null;
          title?: string;
          total_completions?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      mundo_nath_posts: {
        Row: {
          created_at: string | null;
          id: string;
          is_published: boolean | null;
          media_path: string | null;
          published_at: string | null;
          text: string | null;
          type: Database["public"]["Enums"]["media_type"];
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          media_path?: string | null;
          published_at?: string | null;
          text?: string | null;
          type?: Database["public"]["Enums"]["media_type"];
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_published?: boolean | null;
          media_path?: string | null;
          published_at?: string | null;
          text?: string | null;
          type?: Database["public"]["Enums"]["media_type"];
        };
        Relationships: [];
      };
      notification_history: {
        Row: {
          action_taken: string | null;
          body: string;
          created_at: string | null;
          data: Json | null;
          error_code: string | null;
          error_message: string | null;
          expo_receipt_id: string | null;
          id: string;
          notification_type: string;
          opened_at: string | null;
          sent_at: string | null;
          status: string;
          title: string;
          user_id: string | null;
        };
        Insert: {
          action_taken?: string | null;
          body: string;
          created_at?: string | null;
          data?: Json | null;
          error_code?: string | null;
          error_message?: string | null;
          expo_receipt_id?: string | null;
          id?: string;
          notification_type: string;
          opened_at?: string | null;
          sent_at?: string | null;
          status: string;
          title: string;
          user_id?: string | null;
        };
        Update: {
          action_taken?: string | null;
          body?: string;
          created_at?: string | null;
          data?: Json | null;
          error_code?: string | null;
          error_message?: string | null;
          expo_receipt_id?: string | null;
          id?: string;
          notification_type?: string;
          opened_at?: string | null;
          sent_at?: string | null;
          status?: string;
          title?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notification_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notification_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      notification_preferences: {
        Row: {
          affirmation_time: string | null;
          chat_reminders: boolean | null;
          check_in_time: string | null;
          community_comments: boolean | null;
          community_likes: boolean | null;
          community_mentions: boolean | null;
          created_at: string | null;
          cycle_reminders: boolean | null;
          daily_affirmation: boolean | null;
          daily_check_in: boolean | null;
          habit_reminder_time: string | null;
          habit_reminders: boolean | null;
          id: string;
          notifications_enabled: boolean | null;
          period_predictions: boolean | null;
          sound_enabled: boolean | null;
          updated_at: string | null;
          user_id: string;
          vibration_enabled: boolean | null;
          wellness_reminders: boolean | null;
          wellness_time: string | null;
        };
        Insert: {
          affirmation_time?: string | null;
          chat_reminders?: boolean | null;
          check_in_time?: string | null;
          community_comments?: boolean | null;
          community_likes?: boolean | null;
          community_mentions?: boolean | null;
          created_at?: string | null;
          cycle_reminders?: boolean | null;
          daily_affirmation?: boolean | null;
          daily_check_in?: boolean | null;
          habit_reminder_time?: string | null;
          habit_reminders?: boolean | null;
          id?: string;
          notifications_enabled?: boolean | null;
          period_predictions?: boolean | null;
          sound_enabled?: boolean | null;
          updated_at?: string | null;
          user_id: string;
          vibration_enabled?: boolean | null;
          wellness_reminders?: boolean | null;
          wellness_time?: string | null;
        };
        Update: {
          affirmation_time?: string | null;
          chat_reminders?: boolean | null;
          check_in_time?: string | null;
          community_comments?: boolean | null;
          community_likes?: boolean | null;
          community_mentions?: boolean | null;
          created_at?: string | null;
          cycle_reminders?: boolean | null;
          daily_affirmation?: boolean | null;
          daily_check_in?: boolean | null;
          habit_reminder_time?: string | null;
          habit_reminders?: boolean | null;
          id?: string;
          notifications_enabled?: boolean | null;
          period_predictions?: boolean | null;
          sound_enabled?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
          vibration_enabled?: boolean | null;
          wellness_reminders?: boolean | null;
          wellness_time?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notification_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      notification_queue: {
        Row: {
          body: string;
          collapse_key: string | null;
          created_at: string | null;
          data: Json | null;
          error_message: string | null;
          id: string;
          notification_type: string;
          priority: number | null;
          retry_count: number | null;
          scheduled_for: string | null;
          sent_at: string | null;
          status: string | null;
          title: string;
          ttl_seconds: number | null;
          user_id: string;
        };
        Insert: {
          body: string;
          collapse_key?: string | null;
          created_at?: string | null;
          data?: Json | null;
          error_message?: string | null;
          id?: string;
          notification_type: string;
          priority?: number | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string | null;
          title: string;
          ttl_seconds?: number | null;
          user_id: string;
        };
        Update: {
          body?: string;
          collapse_key?: string | null;
          created_at?: string | null;
          data?: Json | null;
          error_message?: string | null;
          id?: string;
          notification_type?: string;
          priority?: number | null;
          retry_count?: number | null;
          scheduled_for?: string | null;
          sent_at?: string | null;
          status?: string | null;
          title?: string;
          ttl_seconds?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notification_queue_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notification_queue_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      notification_templates: {
        Row: {
          body_template: string;
          category: string;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          language: string | null;
          template_key: string;
          title_template: string;
          updated_at: string | null;
        };
        Insert: {
          body_template: string;
          category: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          language?: string | null;
          template_key: string;
          title_template: string;
          updated_at?: string | null;
        };
        Update: {
          body_template?: string;
          category?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          language?: string | null;
          template_key?: string;
          title_template?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          created_at: string | null;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "community_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      profiles: {
        Row: {
          age: number | null;
          avatar_url: string | null;
          baby_birth_date: string | null;
          challenges: string[] | null;
          communication_preference: string | null;
          created_at: string | null;
          deleted_at: string | null;
          due_date: string | null;
          email: string | null;
          goals: string[] | null;
          has_accepted_ai_terms: boolean | null;
          has_accepted_terms: boolean | null;
          has_completed_onboarding: boolean | null;
          id: string;
          interests: Database["public"]["Enums"]["user_interest"][] | null;
          is_admin: boolean | null;
          is_deleted: boolean | null;
          location: string | null;
          name: string | null;
          stage: Database["public"]["Enums"]["pregnancy_stage"] | null;
          support_network: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          age?: number | null;
          avatar_url?: string | null;
          baby_birth_date?: string | null;
          challenges?: string[] | null;
          communication_preference?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          due_date?: string | null;
          email?: string | null;
          goals?: string[] | null;
          has_accepted_ai_terms?: boolean | null;
          has_accepted_terms?: boolean | null;
          has_completed_onboarding?: boolean | null;
          id: string;
          interests?: Database["public"]["Enums"]["user_interest"][] | null;
          is_admin?: boolean | null;
          is_deleted?: boolean | null;
          location?: string | null;
          name?: string | null;
          stage?: Database["public"]["Enums"]["pregnancy_stage"] | null;
          support_network?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          age?: number | null;
          avatar_url?: string | null;
          baby_birth_date?: string | null;
          challenges?: string[] | null;
          communication_preference?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          due_date?: string | null;
          email?: string | null;
          goals?: string[] | null;
          has_accepted_ai_terms?: boolean | null;
          has_accepted_terms?: boolean | null;
          has_completed_onboarding?: boolean | null;
          id?: string;
          interests?: Database["public"]["Enums"]["user_interest"][] | null;
          is_admin?: boolean | null;
          is_deleted?: boolean | null;
          location?: string | null;
          name?: string | null;
          stage?: Database["public"]["Enums"]["pregnancy_stage"] | null;
          support_network?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      push_tokens: {
        Row: {
          created_at: string | null;
          device_id: string | null;
          device_name: string | null;
          failed_count: number | null;
          id: string;
          is_active: boolean | null;
          last_error: string | null;
          last_used_at: string | null;
          platform: string;
          token: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          device_id?: string | null;
          device_name?: string | null;
          failed_count?: number | null;
          id?: string;
          is_active?: boolean | null;
          last_error?: string | null;
          last_used_at?: string | null;
          platform: string;
          token: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          device_id?: string | null;
          device_name?: string | null;
          failed_count?: number | null;
          id?: string;
          is_active?: boolean | null;
          last_error?: string | null;
          last_used_at?: string | null;
          platform?: string;
          token?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "push_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_daily_affirmations: {
        Row: {
          affirmation_id: string;
          date: string;
          id: string;
          reaction: string | null;
          shown_at: string | null;
          user_id: string;
          was_read: boolean | null;
          was_shared: boolean | null;
        };
        Insert: {
          affirmation_id: string;
          date: string;
          id?: string;
          reaction?: string | null;
          shown_at?: string | null;
          user_id: string;
          was_read?: boolean | null;
          was_shared?: boolean | null;
        };
        Update: {
          affirmation_id?: string;
          date?: string;
          id?: string;
          reaction?: string | null;
          shown_at?: string | null;
          user_id?: string;
          was_read?: boolean | null;
          was_shared?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_daily_affirmations_affirmation_id_fkey";
            columns: ["affirmation_id"];
            isOneToOne: false;
            referencedRelation: "affirmations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_daily_affirmations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_daily_affirmations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_favorite_affirmations: {
        Row: {
          affirmation_id: string;
          favorited_at: string | null;
          id: string;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          affirmation_id: string;
          favorited_at?: string | null;
          id?: string;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          affirmation_id?: string;
          favorited_at?: string | null;
          id?: string;
          notes?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_favorite_affirmations_affirmation_id_fkey";
            columns: ["affirmation_id"];
            isOneToOne: false;
            referencedRelation: "affirmations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_favorite_affirmations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_favorite_affirmations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_onboarding: {
        Row: {
          birth_date: string | null;
          check_in_time: string | null;
          completed_at: string | null;
          concerns: string[];
          created_at: string | null;
          daily_check_in: boolean | null;
          due_date: string | null;
          emotional_state: string;
          id: string;
          is_founder: boolean | null;
          last_menstruation: string | null;
          needs_extra_care: boolean | null;
          season_name: string;
          stage: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          birth_date?: string | null;
          check_in_time?: string | null;
          completed_at?: string | null;
          concerns?: string[];
          created_at?: string | null;
          daily_check_in?: boolean | null;
          due_date?: string | null;
          emotional_state: string;
          id?: string;
          is_founder?: boolean | null;
          last_menstruation?: string | null;
          needs_extra_care?: boolean | null;
          season_name: string;
          stage: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          birth_date?: string | null;
          check_in_time?: string | null;
          completed_at?: string | null;
          concerns?: string[];
          created_at?: string | null;
          daily_check_in?: boolean | null;
          due_date?: string | null;
          emotional_state?: string;
          id?: string;
          is_founder?: boolean | null;
          last_menstruation?: string | null;
          needs_extra_care?: boolean | null;
          season_name?: string;
          stage?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_streaks: {
        Row: {
          best_streak: number | null;
          created_at: string | null;
          current_streak: number | null;
          id: string;
          last_activity_date: string | null;
          streak_type: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          best_streak?: number | null;
          created_at?: string | null;
          current_streak?: number | null;
          id?: string;
          last_activity_date?: string | null;
          streak_type: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          best_streak?: number | null;
          created_at?: string | null;
          current_streak?: number | null;
          id?: string;
          last_activity_date?: string | null;
          streak_type?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
      weight_logs: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          notes: string | null;
          user_id: string;
          weight_kg: number;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          notes?: string | null;
          user_id: string;
          weight_kg: number;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          notes?: string | null;
          user_id?: string;
          weight_kg?: number;
        };
        Relationships: [
          {
            foreignKeyName: "weight_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "weight_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_context_full";
            referencedColumns: ["user_id"];
          },
        ];
      };
    };
    Views: {
      analytics_conversion_funnel: {
        Row: {
          conversion_event: string | null;
          first_time_conversions: number | null;
          total_conversions: number | null;
          unique_users: number | null;
        };
        Relationships: [];
      };
      analytics_daily_summary: {
        Row: {
          conversions: number | null;
          date: string | null;
          screen_views: number | null;
          total_events: number | null;
          total_sessions: number | null;
          unique_users: number | null;
          user_actions: number | null;
        };
        Relationships: [];
      };
      analytics_top_screens: {
        Row: {
          screen_name: string | null;
          unique_viewers: number | null;
          views: number | null;
        };
        Relationships: [];
      };
      user_context_full: {
        Row: {
          active_conversations: number | null;
          age: number | null;
          baby_age_days: number | null;
          baby_birth_date: string | null;
          best_habit_streak: number | null;
          challenges: string[] | null;
          check_in_streak: number | null;
          context_generated_at: string | null;
          current_phase: string | null;
          cycle_length: number | null;
          days_since_period: number | null;
          days_until_due: number | null;
          due_date: string | null;
          energy_avg_7d: number | null;
          goals: string[] | null;
          habit_completion_rate_week: number | null;
          habits_completed_today: number | null;
          interests: Database["public"]["Enums"]["user_interest"][] | null;
          last_check_in: Json | null;
          last_daily_log: Json | null;
          last_period_start: string | null;
          location: string | null;
          member_since: string | null;
          mood_avg_7d: number | null;
          mood_trend: string | null;
          name: string | null;
          period_length: number | null;
          pregnancy_week: number | null;
          recent_conversations: Json | null;
          recent_moods: Database["public"]["Enums"]["mood_type"][] | null;
          recent_symptoms: Database["public"]["Enums"]["symptom_type"][] | null;
          sleep_avg_7d: number | null;
          stage: Database["public"]["Enums"]["pregnancy_stage"] | null;
          stress_avg_7d: number | null;
          support_network: string[] | null;
          today_affirmation: Json | null;
          total_comments: number | null;
          total_habits: number | null;
          total_posts: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      aggregate_feature_usage: { Args: { p_date?: string }; Returns: undefined };
      build_user_context: { Args: { p_user_id: string }; Returns: Json };
      cleanup_old_analytics: { Args: never; Returns: undefined };
      cleanup_old_audit_logs: { Args: never; Returns: undefined };
      cleanup_old_notifications: { Args: never; Returns: undefined };
      generate_nathia_context_prompt: {
        Args: { p_user_id: string };
        Returns: string;
      };
      get_context_summary: { Args: { p_user_id: string }; Returns: string };
      get_daily_affirmation: {
        Args: { p_user_id: string };
        Returns: {
          author: string | null;
          category: Database["public"]["Enums"]["affirmation_category"];
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          mood_contexts: string[] | null;
          recommended_for: Database["public"]["Enums"]["pregnancy_stage"][] | null;
          source: string | null;
          text: string;
          times_favorited: number | null;
          times_shown: number | null;
        };
        SetofOptions: {
          from: "*";
          to: "affirmations";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_mood_average: {
        Args: { p_days?: number; p_user_id: string };
        Returns: number;
      };
      get_mood_trend: { Args: { p_user_id: string }; Returns: string };
      get_notification_from_template: {
        Args: { p_data: Json; p_language?: string; p_template_key: string };
        Returns: {
          body: string;
          template_key: string;
          title: string;
        }[];
      };
      get_today_habit_status: {
        Args: { p_user_id: string };
        Returns: {
          habit_id: string;
          habit_title: string;
          is_completed: boolean;
        }[];
      };
      get_user_push_tokens: {
        Args: { p_user_id: string };
        Returns: {
          device_name: string;
          platform: string;
          token: string;
        }[];
      };
      get_weekly_habit_summary: {
        Args: { p_user_id: string };
        Returns: {
          completed_this_week: number;
          completion_rate: number;
          total_habits: number;
        }[];
      };
      interpolate_template: {
        Args: { p_data: Json; p_template: string };
        Returns: string;
      };
      mark_token_failed: {
        Args: { p_error: string; p_token: string };
        Returns: undefined;
      };
      queue_daily_check_in_reminders: { Args: never; Returns: number };
      queue_habit_reminders: {
        Args: never;
        Returns: {
          queued_count: number;
          skipped_count: number;
        }[];
      };
      send_notification_via_edge: {
        Args: {
          p_body: string;
          p_data?: Json;
          p_notification_type: string;
          p_title: string;
          p_user_id: string;
        };
        Returns: undefined;
      };
      update_analytics_session: {
        Args: {
          p_event_count?: number;
          p_screen_count?: number;
          p_session_id: string;
          p_user_id_hash: string;
        };
        Returns: undefined;
      };
      upsert_push_token: {
        Args: {
          p_device_id?: string;
          p_device_name?: string;
          p_platform: string;
          p_token: string;
          p_user_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      affirmation_category:
        | "self_love"
        | "strength"
        | "motherhood"
        | "body_positivity"
        | "anxiety_relief"
        | "gratitude"
        | "empowerment"
        | "healing"
        | "patience"
        | "joy";
      conversation_status: "active" | "archived" | "deleted";
      discharge_level: "none" | "light" | "medium" | "heavy" | "egg_white";
      energy_level: "very_low" | "low" | "moderate" | "high" | "very_high";
      flow_level: "spotting" | "light" | "medium" | "heavy" | "very_heavy";
      group_category:
        | "first_time_moms"
        | "experienced_moms"
        | "trying_to_conceive"
        | "pregnancy"
        | "postpartum"
        | "breastfeeding"
        | "twins"
        | "special_needs"
        | "single_moms"
        | "career_moms"
        | "fitness"
        | "mental_health"
        | "recipes"
        | "general";
      habit_category:
        | "self_care"
        | "health"
        | "mindfulness"
        | "connection"
        | "growth"
        | "nutrition"
        | "movement"
        | "rest";
      habit_frequency: "daily" | "weekly" | "custom";
      media_type: "text" | "image" | "video";
      message_content_type: "text" | "audio" | "image";
      message_role: "user" | "assistant" | "system";
      moderation_status: "safe" | "flagged" | "blocked";
      mood_type:
        | "happy"
        | "excited"
        | "grateful"
        | "peaceful"
        | "confident"
        | "energetic"
        | "hopeful"
        | "loving"
        | "neutral"
        | "calm"
        | "tired"
        | "sleepy"
        | "anxious"
        | "worried"
        | "sad"
        | "frustrated"
        | "overwhelmed"
        | "irritable"
        | "lonely"
        | "stressed"
        | "hormonal"
        | "nesting"
        | "bonding"
        | "touched_out"
        | "mom_guilt"
        | "empowered";
      post_status: "draft" | "submitted" | "approved" | "rejected" | "needs_changes";
      post_type: "text" | "image" | "poll" | "question" | "announcement" | "milestone";
      pregnancy_stage: "trying" | "pregnant" | "postpartum";
      sex_activity_type: "protected" | "unprotected" | "none";
      symptom_type:
        | "nausea"
        | "fatigue"
        | "headache"
        | "backache"
        | "cramping"
        | "bloating"
        | "breast_tenderness"
        | "mood_swings"
        | "food_cravings"
        | "food_aversions"
        | "spotting"
        | "heavy_flow"
        | "light_flow"
        | "pms"
        | "postpartum_bleeding"
        | "breastfeeding_pain"
        | "night_sweats"
        | "hair_loss"
        | "insomnia"
        | "dizziness"
        | "swelling"
        | "constipation"
        | "heartburn"
        | "baby_movement"
        | "braxton_hicks"
        | "contractions";
      user_interest:
        | "nutrition"
        | "exercise"
        | "mental_health"
        | "baby_care"
        | "breastfeeding"
        | "sleep"
        | "relationships"
        | "career";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      affirmation_category: [
        "self_love",
        "strength",
        "motherhood",
        "body_positivity",
        "anxiety_relief",
        "gratitude",
        "empowerment",
        "healing",
        "patience",
        "joy",
      ],
      conversation_status: ["active", "archived", "deleted"],
      discharge_level: ["none", "light", "medium", "heavy", "egg_white"],
      energy_level: ["very_low", "low", "moderate", "high", "very_high"],
      flow_level: ["spotting", "light", "medium", "heavy", "very_heavy"],
      group_category: [
        "first_time_moms",
        "experienced_moms",
        "trying_to_conceive",
        "pregnancy",
        "postpartum",
        "breastfeeding",
        "twins",
        "special_needs",
        "single_moms",
        "career_moms",
        "fitness",
        "mental_health",
        "recipes",
        "general",
      ],
      habit_category: [
        "self_care",
        "health",
        "mindfulness",
        "connection",
        "growth",
        "nutrition",
        "movement",
        "rest",
      ],
      habit_frequency: ["daily", "weekly", "custom"],
      media_type: ["text", "image", "video"],
      message_content_type: ["text", "audio", "image"],
      message_role: ["user", "assistant", "system"],
      moderation_status: ["safe", "flagged", "blocked"],
      mood_type: [
        "happy",
        "excited",
        "grateful",
        "peaceful",
        "confident",
        "energetic",
        "hopeful",
        "loving",
        "neutral",
        "calm",
        "tired",
        "sleepy",
        "anxious",
        "worried",
        "sad",
        "frustrated",
        "overwhelmed",
        "irritable",
        "lonely",
        "stressed",
        "hormonal",
        "nesting",
        "bonding",
        "touched_out",
        "mom_guilt",
        "empowered",
      ],
      post_status: ["draft", "submitted", "approved", "rejected", "needs_changes"],
      post_type: ["text", "image", "poll", "question", "announcement", "milestone"],
      pregnancy_stage: ["trying", "pregnant", "postpartum"],
      sex_activity_type: ["protected", "unprotected", "none"],
      symptom_type: [
        "nausea",
        "fatigue",
        "headache",
        "backache",
        "cramping",
        "bloating",
        "breast_tenderness",
        "mood_swings",
        "food_cravings",
        "food_aversions",
        "spotting",
        "heavy_flow",
        "light_flow",
        "pms",
        "postpartum_bleeding",
        "breastfeeding_pain",
        "night_sweats",
        "hair_loss",
        "insomnia",
        "dizziness",
        "swelling",
        "constipation",
        "heartburn",
        "baby_movement",
        "braxton_hicks",
        "contractions",
      ],
      user_interest: [
        "nutrition",
        "exercise",
        "mental_health",
        "baby_care",
        "breastfeeding",
        "sleep",
        "relationships",
        "career",
      ],
    },
  },
} as const;

// ============================================
// CONVENIENCE ALIASES (backward compatibility)
// ============================================

export type TableRow<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TableInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TableUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Legacy aliases (keep for backward compatibility)
export type User = TableRow<"profiles">;
export type UserInsert = TableInsert<"profiles">;
export type UserUpdate = TableUpdate<"profiles">;

// Note: "posts" table was replaced with "community_posts"
// Keep this alias for backward compatibility but map to community_posts
export type Post = CommunityPost;
export type PostInsert = CommunityPostInsert;
export type PostUpdate = CommunityPostUpdate;

export type Habit = Tables<"habits">;
export type HabitInsert = TablesInsert<"habits">;
export type HabitUpdate = TablesUpdate<"habits">;

// NEW: Community types (migration 002)
export type CommunityPost = Tables<"community_posts">;
export type CommunityPostInsert = TablesInsert<"community_posts">;
export type CommunityPostUpdate = TablesUpdate<"community_posts">;

export type PostLike = Tables<"post_likes">;
export type PostComment = Tables<"community_comments">;

// NEW: Onboarding types (migration 028)
export type UserOnboarding = Tables<"user_onboarding">;
export type UserOnboardingInsert = TablesInsert<"user_onboarding">;
export type UserOnboardingUpdate = TablesUpdate<"user_onboarding">;

// NEW: AI types (migration 005)
export type ChatMessage = Tables<"chat_messages">;
export type ChatConversation = Tables<"chat_conversations">;
export type AIContextCache = Tables<"ai_context_cache">;
export type AIInsight = Tables<"ai_insights">;

// NEW: Template types (migrations 004, 016)
export type HabitTemplate = Tables<"habit_templates">;
export type NotificationTemplate = Tables<"notification_templates">;

// Additional legacy aliases for backward compatibility
export type Comment = Tables<"community_comments">;
export type CommentInsert = TablesInsert<"community_comments">;
export type CommentUpdate = TablesUpdate<"community_comments">;

export type Like = Tables<"post_likes">;
export type LikeInsert = TablesInsert<"post_likes">;

export type HabitCompletion = Tables<"habit_completions">;
export type HabitCompletionInsert = TablesInsert<"habit_completions">;
