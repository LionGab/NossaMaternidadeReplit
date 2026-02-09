import React from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Tokens } from "@/theme/tokens";
import { cn } from "@/utils/cn";

interface FloCardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export function FloCard({
  children,
  className,
  onPress,
  style,
  accessibilityLabel,
  testID,
}: FloCardProps) {
  const Component = onPress ? Pressable : View;

  return (
    <Component
      testID={testID}
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? accessibilityLabel : undefined}
      className={cn("rounded-2xl bg-white p-4", "border border-neutral-100", className)}
      style={[Tokens.shadows.floClean.card, style]}
    >
      {children}
    </Component>
  );
}
