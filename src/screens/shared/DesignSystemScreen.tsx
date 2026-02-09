/**
 * Design System Viewer - Documentação Visual Interativa
 *
 * Exibe todos os tokens do design system de forma visual e interativa.
 * Útil para:
 * - Desenvolvedores verificarem cores/tipografia
 * - Designers validarem implementação
 * - Onboarding de novos membros
 * - Documentação viva do design system
 */

import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { Tokens } from "@/theme/tokens";
import { useTheme } from "@/hooks/useTheme";
import { logger } from "@/utils/logger";
import { cn } from "@/utils/cn";

type Section = "colors" | "typography" | "spacing" | "shadows" | "gradients" | "maternal";

export default function DesignSystemScreen() {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>("colors");

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("✓ Copiado", `${label} copiado para área de transferência`);
      logger.info("Token copied to clipboard", "DesignSystem", { label });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error("Failed to copy token", "DesignSystem", error);
    }
  };

  const sections: { id: Section; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "colors", label: "Cores", icon: "color-palette" },
    { id: "typography", label: "Tipografia", icon: "text" },
    { id: "spacing", label: "Espaçamento", icon: "resize" },
    { id: "shadows", label: "Sombras", icon: "square" },
    { id: "gradients", label: "Gradientes", icon: "color-filter" },
    { id: "maternal", label: "Maternal", icon: "heart" },
  ];

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "left", "right"]}
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <View className="px-6 py-4 border-b" style={{ borderBottomColor: colors.border.default }}>
        <Text
          className="text-2xl mb-1"
          style={{
            fontFamily: Tokens.typography.fontFamily.display,
            color: colors.text.primary,
          }}
        >
          Design System
        </Text>
        <Text
          className="text-sm"
          style={{
            fontFamily: Tokens.typography.fontFamily.base,
            color: colors.text.secondary,
          }}
        >
          Pink Clean + Blue Clean - Tokens 2025
        </Text>
      </View>

      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 py-3 border-b"
        style={{ borderBottomColor: colors.border.default }}
      >
        {sections.map((section) => (
          <Pressable
            key={section.id}
            onPress={() => setActiveSection(section.id)}
            className={cn(
              "flex-row items-center px-4 py-2 mr-2 rounded-full",
              activeSection === section.id ? "bg-opacity-100" : "bg-opacity-0"
            )}
            style={{
              backgroundColor:
                activeSection === section.id ? Tokens.brand.primary[100] : "transparent",
            }}
          >
            <Ionicons
              name={section.icon}
              size={16}
              color={
                activeSection === section.id ? Tokens.brand.primary[700] : colors.text.secondary
              }
            />
            <Text
              className="ml-2"
              style={{
                fontFamily: Tokens.typography.fontFamily.semibold,
                fontSize: 14,
                color:
                  activeSection === section.id ? Tokens.brand.primary[700] : colors.text.secondary,
              }}
            >
              {section.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-4">
        {activeSection === "colors" && (
          <ColorsSection copyToClipboard={copyToClipboard} colors={colors} />
        )}
        {activeSection === "typography" && (
          <TypographySection copyToClipboard={copyToClipboard} colors={colors} />
        )}
        {activeSection === "spacing" && (
          <SpacingSection copyToClipboard={copyToClipboard} colors={colors} />
        )}
        {activeSection === "shadows" && (
          <ShadowsSection copyToClipboard={copyToClipboard} colors={colors} />
        )}
        {activeSection === "gradients" && (
          <GradientsSection copyToClipboard={copyToClipboard} colors={colors} />
        )}
        {activeSection === "maternal" && (
          <MaternalSection copyToClipboard={copyToClipboard} colors={colors} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================
// COLORS SECTION
// ============================================

interface SectionProps {
  copyToClipboard: (text: string, label: string) => void;
  colors: ReturnType<typeof useTheme>["colors"];
}

function ColorsSection({ copyToClipboard, colors }: SectionProps) {
  const colorPalettes = [
    { name: "Primary (Blue Clean)", colors: Tokens.brand.primary, prefix: "brand.primary" },
    { name: "Accent (Pink)", colors: Tokens.brand.accent, prefix: "brand.accent" },
    { name: "Secondary (Lilac)", colors: Tokens.brand.secondary, prefix: "brand.secondary" },
    { name: "Teal", colors: Tokens.brand.teal, prefix: "brand.teal" },
  ];

  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Brand Colors
      </Text>

      {colorPalettes.map((palette) => (
        <View key={palette.name} className="mb-6">
          <Text
            className="text-sm mb-3"
            style={{
              fontFamily: Tokens.typography.fontFamily.semibold,
              color: colors.text.secondary,
            }}
          >
            {palette.name}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(palette.colors).map(([key, value]) => (
              <Pressable
                key={key}
                onPress={() =>
                  copyToClipboard(`Tokens.${palette.prefix}[${key}]`, `${palette.prefix}[${key}]`)
                }
                className="items-center"
              >
                <View
                  className="w-16 h-16 rounded-xl mb-1"
                  style={{
                    backgroundColor: value,
                    ...Tokens.shadows.sm,
                  }}
                />
                <Text
                  className="text-xs"
                  style={{
                    fontFamily: Tokens.typography.fontFamily.base,
                    color: colors.text.secondary,
                  }}
                >
                  {key}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Semantic Colors */}
      <View className="mt-4">
        <Text
          className="text-sm mb-3"
          style={{
            fontFamily: Tokens.typography.fontFamily.semibold,
            color: colors.text.secondary,
          }}
        >
          Semantic Colors
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[
            { name: "Success", color: Tokens.semantic.light.success },
            { name: "Warning", color: Tokens.semantic.light.warning },
            { name: "Error", color: Tokens.semantic.light.error },
            { name: "Info", color: Tokens.semantic.light.info },
          ].map((item) => (
            <Pressable
              key={item.name}
              onPress={() =>
                copyToClipboard(`Tokens.semantic.light.${item.name.toLowerCase()}`, item.name)
              }
              className="items-center"
            >
              <View
                className="w-16 h-16 rounded-xl mb-1"
                style={{
                  backgroundColor: item.color,
                  ...Tokens.shadows.sm,
                }}
              />
              <Text
                className="text-xs"
                style={{
                  fontFamily: Tokens.typography.fontFamily.base,
                  color: colors.text.secondary,
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

// ============================================
// TYPOGRAPHY SECTION
// ============================================

function TypographySection({ copyToClipboard, colors }: SectionProps) {
  const typographyStyles = [
    {
      name: "Display Large",
      style: Tokens.typography.displayLarge,
      token: "typography.displayLarge",
    },
    {
      name: "Display Medium",
      style: Tokens.typography.displayMedium,
      token: "typography.displayMedium",
    },
    {
      name: "Display Small",
      style: Tokens.typography.displaySmall,
      token: "typography.displaySmall",
    },
    {
      name: "Headline Large",
      style: Tokens.typography.headlineLarge,
      token: "typography.headlineLarge",
    },
    {
      name: "Headline Medium",
      style: Tokens.typography.headlineMedium,
      token: "typography.headlineMedium",
    },
    {
      name: "Headline Small",
      style: Tokens.typography.headlineSmall,
      token: "typography.headlineSmall",
    },
    { name: "Body Large", style: Tokens.typography.bodyLarge, token: "typography.bodyLarge" },
    { name: "Body Medium", style: Tokens.typography.bodyMedium, token: "typography.bodyMedium" },
    { name: "Body Small", style: Tokens.typography.bodySmall, token: "typography.bodySmall" },
    { name: "Label Large", style: Tokens.typography.labelLarge, token: "typography.labelLarge" },
    { name: "Caption", style: Tokens.typography.caption, token: "typography.caption" },
  ];

  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Typography Scale
      </Text>

      {typographyStyles.map((item) => (
        <Pressable
          key={item.name}
          onPress={() => copyToClipboard(`Tokens.${item.token}`, item.name)}
          className="mb-4 p-4 rounded-xl"
          style={{
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: colors.border.default,
          }}
        >
          <Text
            className="mb-2"
            style={{
              fontFamily: Tokens.typography.fontFamily.base,
              fontSize: 12,
              color: colors.text.secondary,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              ...item.style,
              color: colors.text.primary,
            }}
          >
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text
            className="mt-2"
            style={{
              fontFamily: Tokens.typography.fontFamily.base,
              fontSize: 11,
              color: colors.text.tertiary,
            }}
          >
            {item.style.fontSize}px / {item.style.lineHeight}px • {item.style.fontWeight}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================
// SPACING SECTION
// ============================================

function SpacingSection({ copyToClipboard, colors }: SectionProps) {
  const spacingTokens = Object.entries(Tokens.spacing);

  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Spacing (8pt Grid)
      </Text>

      {spacingTokens.map(([key, value]) => (
        <Pressable
          key={key}
          onPress={() => copyToClipboard(`Tokens.spacing.${key}`, `spacing.${key}`)}
          className="mb-3 p-4 rounded-xl flex-row items-center"
          style={{
            backgroundColor: colors.background.card,
            borderWidth: 1,
            borderColor: colors.border.default,
          }}
        >
          <View
            className="rounded"
            style={{
              width: value,
              height: value,
              backgroundColor: Tokens.brand.primary[400],
            }}
          />
          <View className="ml-4 flex-1">
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.semibold,
                fontSize: 14,
                color: colors.text.primary,
              }}
            >
              {key}
            </Text>
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.base,
                fontSize: 12,
                color: colors.text.secondary,
              }}
            >
              {value}px
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================
// SHADOWS SECTION
// ============================================

function ShadowsSection({ copyToClipboard, colors }: SectionProps) {
  const shadowLevels = [
    { name: "None", shadow: Tokens.shadows.none },
    { name: "Small", shadow: Tokens.shadows.sm },
    { name: "Medium", shadow: Tokens.shadows.md },
    { name: "Large", shadow: Tokens.shadows.lg },
    { name: "Extra Large", shadow: Tokens.shadows.xl },
  ];

  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Shadow Elevation
      </Text>

      {shadowLevels.map((item) => (
        <Pressable
          key={item.name}
          onPress={() =>
            copyToClipboard(`Tokens.shadows.${item.name.toLowerCase().replace(" ", "")}`, item.name)
          }
          className="mb-4"
        >
          <Text
            className="mb-2"
            style={{
              fontFamily: Tokens.typography.fontFamily.semibold,
              fontSize: 14,
              color: colors.text.secondary,
            }}
          >
            {item.name}
          </Text>
          <View
            className="h-24 rounded-xl items-center justify-center"
            style={{
              backgroundColor: colors.background.card,
              ...item.shadow,
            }}
          >
            <Text
              style={{
                fontFamily: Tokens.typography.fontFamily.base,
                fontSize: 12,
                color: colors.text.secondary,
              }}
            >
              Elevation {item.shadow.elevation}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================
// GRADIENTS SECTION
// ============================================

function GradientsSection({ copyToClipboard, colors }: SectionProps) {
  const gradients = [
    { name: "Primary", colors: Tokens.gradients.primary, token: "gradients.primary" },
    { name: "Accent", colors: Tokens.gradients.accent, token: "gradients.accent" },
    { name: "Hero Light", colors: Tokens.gradients.heroLight, token: "gradients.heroLight" },
    { name: "Calm", colors: Tokens.gradients.calm, token: "gradients.calm" },
    { name: "Warmth", colors: Tokens.gradients.warmth, token: "gradients.warmth" },
  ];

  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Gradients
      </Text>

      {gradients.map((item) => (
        <Pressable
          key={item.name}
          onPress={() => copyToClipboard(`Tokens.${item.token}`, item.name)}
          className="mb-4"
        >
          <Text
            className="mb-2"
            style={{
              fontFamily: Tokens.typography.fontFamily.semibold,
              fontSize: 14,
              color: colors.text.secondary,
            }}
          >
            {item.name}
          </Text>
          <View
            className="h-24 rounded-xl p-4 justify-end"
            style={{
              backgroundColor: item.colors[0],
            }}
          >
            <View className="flex-row gap-2">
              {item.colors.map((color, index) => (
                <View
                  key={index}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// ============================================
// MATERNAL SECTION
// ============================================

function MaternalSection({ copyToClipboard, colors }: SectionProps) {
  return (
    <View>
      <Text
        className="text-xl mb-4"
        style={{
          fontFamily: Tokens.typography.fontFamily.bold,
          color: colors.text.primary,
        }}
      >
        Maternal Colors
      </Text>

      {/* Feeling Colors */}
      <View className="mb-6">
        <Text
          className="text-sm mb-3"
          style={{
            fontFamily: Tokens.typography.fontFamily.semibold,
            color: colors.text.secondary,
          }}
        >
          Feelings (Check-in Emocional)
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(Tokens.feeling).map(([key, value]) => (
            <Pressable
              key={key}
              onPress={() => copyToClipboard(`Tokens.feeling.${key}`, key)}
              className="items-center"
            >
              <View
                className="w-20 h-20 rounded-2xl mb-1 items-center justify-center"
                style={{
                  backgroundColor: value.color,
                  ...Tokens.shadows.sm,
                }}
              >
                <Ionicons
                  name={value.icon as keyof typeof Ionicons.glyphMap}
                  size={32}
                  color={value.icon}
                />
              </View>
              <Text
                className="text-xs capitalize"
                style={{
                  fontFamily: Tokens.typography.fontFamily.base,
                  color: colors.text.secondary,
                }}
              >
                {key}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Journey Colors */}
      <View className="mb-6">
        <Text
          className="text-sm mb-3"
          style={{
            fontFamily: Tokens.typography.fontFamily.semibold,
            color: colors.text.secondary,
          }}
        >
          Jornada Maternal
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {Object.entries(Tokens.maternal.journey).map(([key, value]) => (
            <Pressable
              key={key}
              onPress={() => copyToClipboard(`Tokens.maternal.journey.${key}`, key)}
              className="items-center"
            >
              <View
                className="w-20 h-20 rounded-2xl mb-1"
                style={{
                  backgroundColor: value,
                  ...Tokens.shadows.sm,
                }}
              />
              <Text
                className="text-xs capitalize"
                style={{
                  fontFamily: Tokens.typography.fontFamily.base,
                  color: colors.text.secondary,
                }}
              >
                {key}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
