/**
 * SkeletonLoader - Premium Skeleton Loading Components (NativeWind 2025)
 *
 * Animated loading placeholders with multiple presets:
 * - SkeletonLoader: Base shimmer element
 * - CardSkeleton: FloCard-style card
 * - RowCardSkeleton: Horizontal list item
 * - ListSkeleton: Multiple cards
 * - AvatarSkeleton: Circular avatar
 * - ChatMessageSkeleton: Chat bubble
 * - HeroCardSkeleton: Large hero card
 * - PostSkeleton: Community post
 *
 * @example
 * ```tsx
 * <SkeletonLoader width="100%" height={20} />
 * <CardSkeleton />
 * <ListSkeleton count={3} />
 * <AvatarSkeleton size="lg" />
 * ```
 */

import React, { useEffect } from "react";
import { View, DimensionValue, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import { cn } from "../../utils/cn";
import { useOptimizedAnimation } from "../../hooks/useOptimizedAnimation";

// ===========================================
// BASE SKELETON LOADER
// ===========================================

interface SkeletonLoaderProps {
  /** Width (number in px or string like "100%") */
  width?: number | string;
  /** Height in px */
  height?: number;
  /** Border radius in px */
  borderRadius?: number;
  /** Circular shape */
  circular?: boolean;
  /** Additional className for NativeWind */
  className?: string;
}

/**
 * Base skeleton shimmer element
 */
export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 12,
  circular = false,
  className,
}: SkeletonLoaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { shouldAnimate, maxIterations } = useOptimizedAnimation();
  const shimmerAnim = useSharedValue(0);

  useEffect(() => {
    if (shouldAnimate) {
      shimmerAnim.value = withRepeat(
        withSequence(withTiming(1, { duration: 1000 }), withTiming(0, { duration: 1000 })),
        maxIterations,
        false
      );
    }
    return () => cancelAnimation(shimmerAnim);
  }, [shimmerAnim, shouldAnimate, maxIterations]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerAnim.value * 0.4 + 0.3, // 0.3 → 0.7
  }));

  const computedRadius = circular ? height / 2 : borderRadius;

  return (
    <Animated.View
      className={cn(isDark ? "bg-neutral-700" : "bg-neutral-200", className)}
      style={[
        {
          width: width as DimensionValue,
          height,
          borderRadius: computedRadius,
        },
        animatedStyle,
      ]}
    />
  );
}

// ===========================================
// AVATAR SKELETON
// ===========================================

interface AvatarSkeletonProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const AVATAR_SIZES = {
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
};

/**
 * Circular avatar skeleton
 */
export function AvatarSkeleton({ size = "md", className }: AvatarSkeletonProps) {
  const sizeValue = AVATAR_SIZES[size];
  return <SkeletonLoader width={sizeValue} height={sizeValue} circular className={className} />;
}

// ===========================================
// CARD SKELETON
// ===========================================

interface CardSkeletonProps {
  className?: string;
}

/**
 * FloCard-style skeleton
 */
export function CardSkeleton({ className }: CardSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={cn("p-4 rounded-2xl mb-4", isDark ? "bg-neutral-800" : "bg-white", className)}>
      <SkeletonLoader width="60%" height={20} className="mb-3" />
      <SkeletonLoader width="100%" height={16} className="mb-2" />
      <SkeletonLoader width="80%" height={16} />
    </View>
  );
}

// ===========================================
// ROW CARD SKELETON
// ===========================================

interface RowCardSkeletonProps {
  showAvatar?: boolean;
  className?: string;
}

/**
 * Horizontal row/list item skeleton
 */
export function RowCardSkeleton({ showAvatar = true, className }: RowCardSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={cn(
        "flex-row items-center p-3 rounded-xl mb-3",
        isDark ? "bg-neutral-800" : "bg-white",
        className
      )}
    >
      {showAvatar && <AvatarSkeleton size="md" className="mr-3" />}
      <View className="flex-1">
        <SkeletonLoader width="70%" height={16} className="mb-2" />
        <SkeletonLoader width="50%" height={14} />
      </View>
      <SkeletonLoader width={24} height={24} borderRadius={6} />
    </View>
  );
}

// ===========================================
// CHAT MESSAGE SKELETON
// ===========================================

interface ChatMessageSkeletonProps {
  isUser?: boolean;
  className?: string;
}

/**
 * Chat bubble skeleton
 */
export function ChatMessageSkeleton({ isUser = false, className }: ChatMessageSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={cn("mb-3 max-w-[80%]", isUser ? "self-end" : "self-start", className)}>
      <View
        className={cn(
          "p-3 rounded-2xl",
          isUser
            ? isDark
              ? "bg-primary-800"
              : "bg-primary-100"
            : isDark
              ? "bg-neutral-800"
              : "bg-neutral-100"
        )}
      >
        <SkeletonLoader width={200} height={14} className="mb-2" />
        <SkeletonLoader width={150} height={14} className="mb-2" />
        <SkeletonLoader width={100} height={14} />
      </View>
    </View>
  );
}

// ===========================================
// HERO CARD SKELETON
// ===========================================

interface HeroCardSkeletonProps {
  className?: string;
}

/**
 * Large hero/feature card skeleton
 */
export function HeroCardSkeleton({ className }: HeroCardSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={cn(
        "rounded-3xl p-5 mb-4 overflow-hidden",
        isDark ? "bg-neutral-800" : "bg-white",
        className
      )}
    >
      {/* Hero image placeholder */}
      <SkeletonLoader width="100%" height={140} borderRadius={16} className="mb-4" />

      {/* Content */}
      <SkeletonLoader width="40%" height={24} className="mb-3" />
      <SkeletonLoader width="100%" height={16} className="mb-2" />
      <SkeletonLoader width="90%" height={16} className="mb-4" />

      {/* CTA button placeholder */}
      <SkeletonLoader width="50%" height={44} borderRadius={16} />
    </View>
  );
}

// ===========================================
// POST SKELETON (Community)
// ===========================================

interface PostSkeletonProps {
  className?: string;
}

/**
 * Community post skeleton
 */
export function PostSkeleton({ className }: PostSkeletonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className={cn("rounded-2xl p-4 mb-4", isDark ? "bg-neutral-800" : "bg-white", className)}>
      {/* Author row */}
      <View className="flex-row items-center mb-3">
        <AvatarSkeleton size="md" className="mr-3" />
        <View className="flex-1">
          <SkeletonLoader width={120} height={14} className="mb-1" />
          <SkeletonLoader width={80} height={12} />
        </View>
      </View>

      {/* Content */}
      <SkeletonLoader width="100%" height={14} className="mb-2" />
      <SkeletonLoader width="95%" height={14} className="mb-2" />
      <SkeletonLoader width="60%" height={14} className="mb-4" />

      {/* Actions row */}
      <View className="flex-row items-center gap-4">
        <SkeletonLoader width={60} height={24} borderRadius={12} />
        <SkeletonLoader width={60} height={24} borderRadius={12} />
        <SkeletonLoader width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

// ===========================================
// LIST SKELETON
// ===========================================

interface ListSkeletonProps {
  /** Number of skeleton items */
  count?: number;
  /** Type of skeleton to render */
  type?: "card" | "row" | "post" | "hero" | "chat";
  className?: string;
}

/**
 * Multiple skeleton items
 */
export function ListSkeleton({ count = 3, type = "card", className }: ListSkeletonProps) {
  const SkeletonComponent = {
    card: CardSkeleton,
    row: RowCardSkeleton,
    post: PostSkeleton,
    hero: HeroCardSkeleton,
    chat: ChatMessageSkeleton,
  }[type];

  return (
    <View className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </View>
  );
}

export default SkeletonLoader;
