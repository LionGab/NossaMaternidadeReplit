// UI Components - Barrel Export
export { AlertModal } from "./AlertModal";
export { AnimatedBadge, StreakBadge, AchievementBadge } from "./AnimatedBadge";
export { AppPressable } from "./AppPressable";
export { Badge } from "./Badge";
export { Button } from "./Button";
export { Card } from "./Card";

// Nathia Design System Components (2026)
export {
  NathText,
  Title,
  Subtitle,
  Body,
  Caption,
  Label,
  DataText,
  Typography,
} from "./NathTypography";
export { NathCard } from "./NathCard";
export { NathBadge } from "./NathBadge";
export { NathProgressBar } from "./NathProgressBar";
export { NathAvatar } from "./NathAvatar";
export { NathButton } from "./NathButton";
export { EmptyState } from "./EmptyState";
export { ErrorState } from "./ErrorState";
export { FAB } from "./FAB";
export { FloCleanCard } from "./FloCleanCard";
export { GlowEffect } from "./GlowEffect";
export { GradientBackground } from "./GradientBackground";

// Flo Health Style Components (2025 Redesign)
export { FloScreenWrapper } from "./FloScreenWrapper";
export { FloHeader } from "./FloHeader";
export { FloActionCard } from "./FloActionCard";
export { FloStatusCard } from "./FloStatusCard";
export { FloMotivationalCard } from "./FloMotivationalCard";
export { FloSectionTitle } from "./FloSectionTitle";
export { FloCard } from "./FloCard";
export { Input } from "./Input";
export { LoadingDots } from "./LoadingDots";
export { LoadingState } from "./LoadingState";
export { PremiumCard } from "./PremiumCard";
export { PremiumEmptyState } from "./PremiumEmptyState";
export { PressableScale } from "./PressableScale";
export { RowCard } from "./RowCard";
export { ScreenHeader } from "./ScreenHeader";
export {
  SkeletonLoader,
  AvatarSkeleton,
  CardSkeleton,
  RowCardSkeleton,
  ChatMessageSkeleton,
  HeroCardSkeleton,
  PostSkeleton,
  ListSkeleton,
} from "./SkeletonLoader";
export { SoftCard } from "./SoftCard";
export { StickerButton } from "./StickerButton";
export { Text } from "./Text";
export { Toast } from "./Toast";

// Default exports (for components using export default)
export { default as AppButton } from "./AppButton";
export { default as AppCard } from "./AppCard";
export { default as Avatar } from "./Avatar";
export { default as Chip } from "./Chip";
export { default as IconButton } from "./IconButton";
export { SectionHeader } from "./SectionHeader";

// Constants and helpers
export const AVATAR_SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
} as const;
