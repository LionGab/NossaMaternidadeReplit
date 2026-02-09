/**
 * MarkdownRenderer - Wrapper customizado para react-native-markdown-display
 *
 * Features:
 * - Estilos do Design System (Tokens)
 * - Suporte a headers, bold, italic, listas, code blocks
 * - Cores adaptadas ao tema (light/dark)
 * - Performance otimizada com memoização
 *
 * @version 1.0
 */

import React, { useMemo } from "react";
import { StyleSheet, Platform } from "react-native";
import Markdown, { MarkdownIt } from "react-native-markdown-display";
import { brand, neutral, typography, spacing, radius } from "../../theme/tokens";

interface MarkdownRendererProps {
  children: string;
  textColor?: string;
}

// Configure markdown-it for better parsing
const markdownItInstance = MarkdownIt({
  typographer: true,
  linkify: true,
  breaks: true,
});

/**
 * Cria estilos de markdown baseados na cor do texto
 */
function createMarkdownStyles(textColor: string) {
  return StyleSheet.create({
    // Text styles
    body: {
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: typography.fontFamily.base,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: spacing.sm,
    },

    // Headers
    heading1: {
      color: textColor,
      fontSize: 20,
      fontWeight: "700",
      fontFamily: typography.fontFamily.bold,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      lineHeight: 28,
    },
    heading2: {
      color: textColor,
      fontSize: 18,
      fontWeight: "600",
      fontFamily: typography.fontFamily.semibold,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      lineHeight: 26,
    },
    heading3: {
      color: textColor,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: typography.fontFamily.semibold,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
      lineHeight: 24,
    },

    // Inline styles
    strong: {
      fontWeight: "700",
      fontFamily: typography.fontFamily.bold,
    },
    em: {
      fontStyle: "italic",
    },
    s: {
      textDecorationLine: "line-through",
    },

    // Links
    link: {
      color: brand.primary[600],
      textDecorationLine: "underline",
    },

    // Lists
    bullet_list: {
      marginBottom: spacing.sm,
    },
    ordered_list: {
      marginBottom: spacing.sm,
    },
    list_item: {
      flexDirection: "row",
      marginBottom: spacing.xs,
    },
    bullet_list_icon: {
      color: brand.accent[500],
      fontSize: 15,
      lineHeight: 22,
      marginRight: spacing.xs,
    },
    ordered_list_icon: {
      color: brand.accent[500],
      fontSize: 15,
      lineHeight: 22,
      marginRight: spacing.xs,
      fontWeight: "600",
    },
    bullet_list_content: {
      flex: 1,
    },
    ordered_list_content: {
      flex: 1,
    },

    // Code
    code_inline: {
      backgroundColor: neutral[100],
      color: brand.primary[700],
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    code_block: {
      backgroundColor: neutral[100],
      color: neutral[800],
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      padding: spacing.sm,
      borderRadius: radius.md,
      marginVertical: spacing.sm,
      overflow: "hidden",
    },
    fence: {
      backgroundColor: neutral[100],
      color: neutral[800],
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: 13,
      padding: spacing.sm,
      borderRadius: radius.md,
      marginVertical: spacing.sm,
      overflow: "hidden",
    },

    // Blockquote
    blockquote: {
      backgroundColor: brand.accent[50],
      borderLeftWidth: 3,
      borderLeftColor: brand.accent[400],
      paddingLeft: spacing.sm,
      paddingVertical: spacing.xs,
      marginVertical: spacing.sm,
      borderRadius: radius.sm,
    },

    // Horizontal rule
    hr: {
      backgroundColor: neutral[200],
      height: 1,
      marginVertical: spacing.md,
    },

    // Table (basic support)
    table: {
      borderWidth: 1,
      borderColor: neutral[200],
      borderRadius: radius.sm,
      marginVertical: spacing.sm,
    },
    thead: {
      backgroundColor: neutral[100],
    },
    th: {
      padding: spacing.xs,
      fontWeight: "600",
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: neutral[200],
    },
    td: {
      padding: spacing.xs,
    },
  });
}

const MarkdownRendererComponent: React.FC<MarkdownRendererProps> = ({
  children,
  textColor = neutral[800],
}) => {
  // Memoize styles based on textColor
  const markdownStyles = useMemo(() => createMarkdownStyles(textColor), [textColor]);

  // Handle empty content
  if (!children || children.trim() === "") {
    return null;
  }

  return (
    <Markdown style={markdownStyles} markdownit={markdownItInstance} mergeStyle>
      {children}
    </Markdown>
  );
};

export const MarkdownRenderer = React.memo(MarkdownRendererComponent);
MarkdownRenderer.displayName = "MarkdownRenderer";
