import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatMessage } from "../types/navigation";

// Conversation type for chat history
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  // Sync fields (for Supabase backend)
  remoteId?: string;
  lastSyncedAt?: string;
  syncStatus?: "synced" | "pending" | "syncing" | "error";
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  isHistoryOpen: boolean;

  // Streaming state (SSE)
  isStreaming: boolean;
  currentStreamText: string;

  // Actions
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, patch: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  clearCurrentChat: () => void;
  toggleHistory: () => void;
  getCurrentMessages: () => ChatMessage[];
  updateConversationTitle: (id: string, title: string) => void;

  // Sync actions (for Supabase backend)
  setConversationRemoteId: (localId: string, remoteId: string) => void;
  markConversationSynced: (conversationId: string) => void;
  setConversationSyncStatus: (conversationId: string, status: Conversation["syncStatus"]) => void;

  // Streaming actions
  setStreaming: (streaming: boolean) => void;
  updateStreamText: (text: string) => void;
  appendStreamText: (chunk: string) => void;
  clearStreamText: () => void;
}

// Chat Store (persisted for message history)
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      isHistoryOpen: false,

      // Streaming state (SSE) - not persisted
      isStreaming: false,
      currentStreamText: "",

      createConversation: () => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: "Nova conversa",
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));
        return newConversation.id;
      },

      deleteConversation: (id) =>
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            currentConversationId:
              state.currentConversationId === id
                ? newConversations[0]?.id || null
                : state.currentConversationId,
          };
        }),

      setCurrentConversation: (id) => set({ currentConversationId: id }),

      addMessage: (message) =>
        set((state) => {
          const conversationId = state.currentConversationId;

          // If no current conversation, create one
          if (!conversationId) {
            const newConversation: Conversation = {
              id: Date.now().toString(),
              title:
                message.role === "user" ? message.content.slice(0, 30) + "..." : "Nova conversa",
              messages: [message],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return {
              conversations: [newConversation, ...state.conversations],
              currentConversationId: newConversation.id,
            };
          }

          // Add to existing conversation
          return {
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, message],
                    updatedAt: new Date().toISOString(),
                    syncStatus: "pending" as const,
                    title:
                      conv.messages.length === 0 && message.role === "user"
                        ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                        : conv.title,
                  }
                : conv
            ),
          };
        }),

      updateMessage: (messageId, patch) =>
        set((state) => {
          const conversationId = state.currentConversationId;
          if (!conversationId) return state;

          return {
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: conv.messages.map((msg) =>
                      msg.id === messageId ? { ...msg, ...patch } : msg
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : conv
            ),
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearCurrentChat: () =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== state.currentConversationId),
          currentConversationId: null,
        })),

      toggleHistory: () => set((state) => ({ isHistoryOpen: !state.isHistoryOpen })),

      getCurrentMessages: () => {
        const state = get();
        const currentConv = state.conversations.find((c) => c.id === state.currentConversationId);
        return currentConv?.messages || [];
      },

      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        })),

      // Sync actions (for Supabase backend)
      setConversationRemoteId: (localId, remoteId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === localId ? { ...conv, remoteId } : conv
          ),
        })),

      markConversationSynced: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, syncStatus: "synced" as const, lastSyncedAt: new Date().toISOString() }
              : conv
          ),
        })),

      setConversationSyncStatus: (conversationId, status) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, syncStatus: status } : conv
          ),
        })),

      // Streaming actions (SSE)
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      updateStreamText: (text) => set({ currentStreamText: text }),
      appendStreamText: (chunk) =>
        set((state) => ({ currentStreamText: state.currentStreamText + chunk })),
      clearStreamText: () => set({ currentStreamText: "", isStreaming: false }),
    }),
    {
      name: "nossa-maternidade-chat",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
