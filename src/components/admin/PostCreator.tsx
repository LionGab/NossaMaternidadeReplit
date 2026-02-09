import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { GradientBackground } from "../ui/GradientBackground";

// Backward compatibility mapping
const LOCAL_COLORS = {
  slate: Tokens.neutral,
  rose: Tokens.brand.primary,
  sky: Tokens.brand.secondary,
  amber: Tokens.brand.accent,
};

interface PostCreatorProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (post: {
    title: string;
    body: string;
    category: string;
    type: "text" | "image" | "video";
  }) => void;
}

export const PostCreator: React.FC<PostCreatorProps> = ({ visible, onClose, onSubmit }) => {
  const theme = useTheme();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<"duvida" | "desabafo" | "vitoria">("duvida");
  const [type, setType] = useState<"text" | "video" | "image">("text");

  const handleSubmit = () => {
    if (!title || !body) return;

    onSubmit({
      title,
      body,
      category,
      type,
    });

    // Reset
    setTitle("");
    setBody("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <GradientBackground style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Novo Post (Admin)</Text>
            <Pressable onPress={handleSubmit} disabled={!title || !body}>
              <Text style={[styles.submitText, (!title || !body) && styles.disabledText]}>
                Publicar
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.surface.elevated,
                    borderColor: theme.border.default,
                    color: theme.text.primary,
                  },
                ]}
                placeholder="Ex: Como lidar com..."
                placeholderTextColor={theme.text.tertiary}
                value={title}
                onChangeText={setTitle}
                maxLength={60}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Conteúdo</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.surface.elevated,
                    borderColor: theme.border.default,
                    color: theme.text.primary,
                  },
                ]}
                placeholder="Escreva o conteúdo aqui..."
                placeholderTextColor={theme.text.tertiary}
                value={body}
                onChangeText={setBody}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.pillsRow}>
                {(["duvida", "desabafo", "vitoria"] as const).map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: theme.surface.elevated,
                        borderColor: theme.border.default,
                      },
                      category === cat && styles.pillActive,
                      category === cat && { backgroundColor: getCategoryColor(cat) },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        category === cat && {
                          color: cat === "vitoria" ? theme.text.onAccent : theme.text.inverse,
                        },
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de Mídia</Text>
              <View style={styles.pillsRow}>
                {(["text", "image", "video"] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: theme.surface.elevated,
                        borderColor: theme.border.default,
                      },
                      type === t && styles.pillActive,
                      type === t && { backgroundColor: LOCAL_COLORS.slate[800] },
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Ionicons
                      name={getMediaTypeIcon(t)}
                      size={16}
                      color={type === t ? theme.text.inverse : LOCAL_COLORS.slate[500]}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.pillText, type === t && { color: theme.text.inverse }]}>
                      {t === "text" ? "Texto" : t === "image" ? "Imagem" : "Vídeo"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </Modal>
  );
};

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case "vitoria":
      return LOCAL_COLORS.amber[500];
    case "desabafo":
      return LOCAL_COLORS.rose[500];
    default:
      return LOCAL_COLORS.sky[500];
  }
};

const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "image":
      return "image";
    case "video":
      return "videocam";
    default:
      return "document-text";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: LOCAL_COLORS.slate[200],
  },
  headerTitle: {
    ...Tokens.typography.headlineSmall,
    color: LOCAL_COLORS.slate[800],
  },
  cancelText: {
    ...Tokens.typography.bodyMedium,
    color: LOCAL_COLORS.slate[500],
  },
  submitText: {
    ...Tokens.typography.bodyMedium,
    fontWeight: "600",
    color: LOCAL_COLORS.rose[500],
  },
  disabledText: {
    opacity: 0.5,
  },
  content: {
    padding: Tokens.spacing.lg,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    ...Tokens.typography.labelLarge,
    color: LOCAL_COLORS.slate[500],
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderRadius: Tokens.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: LOCAL_COLORS.slate[200],
    fontSize: 16,
    color: LOCAL_COLORS.slate[800],
  },
  textArea: {
    height: 150,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Tokens.radius.full,
    borderWidth: 1,
    borderColor: LOCAL_COLORS.slate[200],
  },
  pillActive: {
    borderColor: "transparent",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: LOCAL_COLORS.slate[600],
  },
  pillTextActive: {},
});
