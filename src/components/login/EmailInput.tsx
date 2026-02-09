/**
 * EmailInput - Email input with validation and animated border
 */

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { brand, premium, semantic, typography } from "../../theme/tokens";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = React.memo(
  ({ value, onChange, error, disabled }) => {
    const [focused, setFocused] = useState(false);
    const borderColor = useSharedValue(0);

    useEffect(() => {
      borderColor.value = withTiming(focused ? 1 : 0, { duration: 200 });
    }, [focused, borderColor]);

    const animatedBorderStyle = useAnimatedStyle(() => ({
      borderColor:
        interpolate(borderColor.value, [0, 1], [0, 1]) === 1
          ? brand.accent[400]
          : premium.input.border,
    }));

    return (
      <View>
        <Animated.View
          style={[styles.inputContainer, animatedBorderStyle, error && styles.inputError]}
        >
          <Ionicons
            name="mail-outline"
            size={18}
            color={focused ? brand.accent[400] : premium.text.muted}
          />
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="seu@email.com"
            placeholderTextColor={premium.text.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            editable={!disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.input}
            accessibilityLabel="Email"
          />
        </Animated.View>
        {error && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={semantic.dark.error} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}
      </View>
    );
  }
);

EmailInput.displayName = "EmailInput";

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: premium.input.background,
    borderWidth: 1.5,
    borderColor: premium.input.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  inputError: {
    borderColor: semantic.dark.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: premium.text.primary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    color: semantic.dark.error,
  },
});
