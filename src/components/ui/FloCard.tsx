import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Tokens } from "@/theme/tokens";
import { cn } from "@/utils/cn";
import { PressableScale } from "./PressableScale";

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
  const Component = onPress ? PressableScale : View;

  return (
    <Component
      testID={testID}
      onPress={onPress}
      spring="snappy"
      accessibilityLabel={onPress ? accessibilityLabel : undefined}
      className={cn("rounded-2xl bg-white p-4", "border border-neutral-100", className)}
      style={[Tokens.shadows.floClean.card, style]}
    >
      {children}
    </Component>
  );
}
