# Code Patterns

> Nossa Maternidade — Padrões de código

---

## Component Pattern

### Basic Component

```typescript
// src/components/ui/Card.tsx
import { View, Text, Pressable } from "react-native";
import { cn } from "@/utils/cn";
import { Tokens } from "@/theme/tokens";

interface CardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  title,
  description,
  onPress,
  variant = "default",
  className,
  children,
}: CardProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      className={cn(
        "rounded-2xl p-4",
        // Variant styles
        variant === "default" && "bg-white",
        variant === "elevated" && "bg-white shadow-md",
        variant === "outlined" && "bg-transparent border border-neutral-200",
        // Custom classes
        className
      )}
    >
      <Text
        className="text-lg font-semibold text-neutral-900"
        style={{ fontFamily: Tokens.fontFamily.bodySemiBold }}
      >
        {title}
      </Text>

      {description && (
        <Text
          className="mt-1 text-sm text-neutral-600"
          style={{ fontFamily: Tokens.fontFamily.body }}
        >
          {description}
        </Text>
      )}

      {children}
    </Container>
  );
}
```

### Screen Component

```typescript
// src/screens/HomeScreen.tsx
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainTabScreenProps } from "@/types/navigation";
import { useAppStore } from "@/state";
import { useThemeColors } from "@/hooks/useTheme";
import { logger } from "@/utils/logger";
import { Header } from "@/components/shared/Header";
import { WelcomeCard } from "@/components/home/WelcomeCard";
import { QuickActions } from "@/components/home/QuickActions";

export function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  // Zustand selectors (individual)
  const user = useAppStore((s) => s.user);
  const isOnboardingComplete = useAppStore((s) => s.isOnboardingComplete);

  // Theme
  const colors = useThemeColors();

  // Handlers
  const handleQuickAction = (action: string) => {
    logger.info("Quick action pressed", "HomeScreen", { action });

    switch (action) {
      case "chat":
        navigation.navigate("MainTabs", { screen: "Assistant" });
        break;
      case "log":
        navigation.navigate("DailyLog", { date: new Date().toISOString() });
        break;
      default:
        logger.warn("Unknown action", "HomeScreen", { action });
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <Header title="Início" />

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeCard
          userName={user?.full_name || ""}
          isOnboardingComplete={isOnboardingComplete}
        />

        <QuickActions onAction={handleQuickAction} />
      </ScrollView>
    </SafeAreaView>
  );
}
```

### List Component (FlashList)

```typescript
// src/components/community/PostList.tsx
import { FlashList } from "@shopify/flash-list";
import { View, Text, RefreshControl } from "react-native";
import { useCallback, useState } from "react";
import { Post } from "@/types/navigation";
import { PostCard } from "./PostCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { logger } from "@/utils/logger";

interface PostListProps {
  posts: Post[];
  onRefresh: () => Promise<void>;
  onEndReached?: () => void;
  onPostPress: (postId: string) => void;
}

export function PostList({
  posts,
  onRefresh,
  onEndReached,
  onPostPress,
}: PostListProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      logger.error("Failed to refresh posts", "PostList", { error });
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        post={item}
        onPress={() => onPostPress(item.id)}
      />
    ),
    [onPostPress]
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Nenhum post ainda"
        description="Seja a primeira a compartilhar!"
        icon="chatbubble-outline"
      />
    );
  }

  return (
    <FlashList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={200}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}
```

---

## Hook Pattern

### Data Fetching Hook

```typescript
// src/hooks/usePosts.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/api/supabase";
import { Post } from "@/types/navigation";
import { logger } from "@/utils/logger";

interface UsePostsOptions {
  groupId?: string;
  limit?: number;
}

interface UsePostsReturn {
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { groupId, limit = 20 } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setIsLoading(true);
          setOffset(0);
        }

        const currentOffset = reset ? 0 : offset;

        let query = supabase
          .from("community_posts")
          .select(
            `
          *,
          author:profiles(id, full_name, avatar_url)
        `
          )
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .range(currentOffset, currentOffset + limit - 1);

        if (groupId) {
          query = query.eq("group_id", groupId);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const newPosts = data || [];

        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(newPosts.length === limit);
        setOffset(currentOffset + newPosts.length);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        logger.error("Failed to fetch posts", "usePosts", { error, groupId });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [groupId, limit, offset]
  );

  const refetch = useCallback(() => fetchPosts(true), [fetchPosts]);

  const fetchMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchPosts(false);
    }
  }, [fetchPosts, isLoading, hasMore]);

  useEffect(() => {
    fetchPosts(true);
  }, [groupId]); // Reset when groupId changes

  return { posts, isLoading, error, refetch, fetchMore, hasMore };
}
```

### Form Hook

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validate
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    handleSubmit,
    reset,
  };
}
```

---

## API Service Pattern

### Basic Service

```typescript
// src/api/posts-service.ts
import { supabase } from "./supabase";
import { Post } from "@/types/navigation";
import { logger } from "@/utils/logger";

interface CreatePostInput {
  content: string;
  imageUrl?: string;
  groupId?: string;
}

interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

export async function createPost(input: CreatePostInput): Promise<ServiceResponse<Post>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session?.session?.user) {
      return { data: null, error: new Error("Not authenticated") };
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        author_id: session.session.user.id,
        content: input.content,
        image_url: input.imageUrl,
        group_id: input.groupId,
        status: "pending", // Goes through moderation
      })
      .select()
      .single();

    if (error) {
      logger.error("Failed to create post", "createPost", { error });
      return { data: null, error };
    }

    logger.info("Post created", "createPost", { postId: data.id });
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    logger.error("Unexpected error creating post", "createPost", { error });
    return { data: null, error };
  }
}

export async function likePost(postId: string): Promise<ServiceResponse<void>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session?.session?.user) {
      return { data: null, error: new Error("Not authenticated") };
    }

    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: session.session.user.id,
    });

    if (error) {
      // If already liked, just return success
      if (error.code === "23505") {
        return { data: null, error: null };
      }
      return { data: null, error };
    }

    // Increment likes_count
    await supabase.rpc("increment_likes", { post_id: postId });

    return { data: null, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return { data: null, error };
  }
}

export async function unlikePost(postId: string): Promise<ServiceResponse<void>> {
  try {
    const { data: session } = await supabase.auth.getSession();

    if (!session?.session?.user) {
      return { data: null, error: new Error("Not authenticated") };
    }

    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", session.session.user.id);

    if (error) {
      return { data: null, error };
    }

    // Decrement likes_count
    await supabase.rpc("decrement_likes", { post_id: postId });

    return { data: null, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return { data: null, error };
  }
}
```

---

## Store Pattern (Zustand)

### Basic Store

```typescript
// src/state/example-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@/utils/logger";

interface ExampleState {
  // State
  items: string[];
  selectedId: string | null;
  isLoading: boolean;

  // Actions
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  selectItem: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  selectedId: null,
  isLoading: false,
};

export const useExampleStore = create<ExampleState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, item],
        }));
        logger.debug("Item added", "ExampleStore", { item });
      },

      removeItem: (item) => {
        set((state) => ({
          items: state.items.filter((i) => i !== item),
        }));
        logger.debug("Item removed", "ExampleStore", { item });
      },

      selectItem: (id) => {
        set({ selectedId: id });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      reset: () => {
        set(initialState);
        logger.info("Store reset", "ExampleStore");
      },
    }),
    {
      name: "example-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        items: state.items,
        selectedId: state.selectedId,
      }),
    }
  )
);
```

### Store with Async Actions

```typescript
// src/state/premium-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { logger } from "@/utils/logger";

interface PremiumState {
  isPremium: boolean;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;
  error: string | null;

  // Actions
  syncWithRevenueCat: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  reset: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      isLoading: false,
      offerings: null,
      customerInfo: null,
      error: null,

      syncWithRevenueCat: async () => {
        set({ isLoading: true, error: null });

        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const offerings = await Purchases.getOfferings();

          const isPremium = customerInfo.entitlements.active["premium"] !== undefined;

          set({
            customerInfo,
            offerings,
            isPremium,
            isLoading: false,
          });

          logger.info("RevenueCat synced", "PremiumStore", { isPremium });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          logger.error("Failed to sync RevenueCat", "PremiumStore", { error });
          set({ error: errorMessage, isLoading: false });
        }
      },

      purchasePackage: async (pkg) => {
        set({ isLoading: true, error: null });

        try {
          const { customerInfo } = await Purchases.purchasePackage(pkg);
          const isPremium = customerInfo.entitlements.active["premium"] !== undefined;

          set({
            customerInfo,
            isPremium,
            isLoading: false,
          });

          logger.info("Purchase completed", "PremiumStore", { isPremium });
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          logger.error("Purchase failed", "PremiumStore", { error });
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      restorePurchases: async () => {
        set({ isLoading: true, error: null });

        try {
          const customerInfo = await Purchases.restorePurchases();
          const isPremium = customerInfo.entitlements.active["premium"] !== undefined;

          set({
            customerInfo,
            isPremium,
            isLoading: false,
          });

          logger.info("Purchases restored", "PremiumStore", { isPremium });
          return isPremium;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          logger.error("Restore failed", "PremiumStore", { error });
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      reset: () => {
        set({
          isPremium: false,
          isLoading: false,
          offerings: null,
          customerInfo: null,
          error: null,
        });
      },
    }),
    {
      name: "premium-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isPremium: state.isPremium,
      }),
    }
  )
);
```

---

## Error Handling Pattern

```typescript
// Pattern for all async operations
async function safeOperation<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    logger.error(`Operation failed: ${context}`, context, { error });
    return { data: null, error };
  }
}

// Usage
const { data, error } = await safeOperation(() => supabase.from("posts").select("*"), "fetchPosts");

if (error) {
  // Handle error
  return;
}

// Use data safely
```

---

## Logging Pattern

```typescript
// NEVER use console.log
// ALWAYS use logger

// Debug (development only)
logger.debug("Detailed info", "ComponentName", { data });

// Info (important events)
logger.info("User logged in", "AuthService", { userId });

// Warn (potential issues)
logger.warn("Rate limit approaching", "ChatService", { remaining: 2 });

// Error (failures)
logger.error("Failed to save", "PostService", { error, postId });
```
