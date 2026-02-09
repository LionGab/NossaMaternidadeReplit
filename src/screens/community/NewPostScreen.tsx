/**
 * NewPostScreen - Criar novo post na comunidade
 *
 * Versão Fase 2 com suporte a Vídeo e Imagem + Moderação
 */

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { communityService } from "@/services/community";
import { Tokens, radius, spacing, surface } from "@/theme/tokens";
import { RootStackScreenProps } from "@/types/navigation";
import { MediaType } from "@/types/community";

const SPACING = spacing;
const RADIUS = radius;

export default function NewPostScreen({ navigation }: RootStackScreenProps<"NewPost">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [text, setText] = useState("");
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("text");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const bgPrimary = isDark ? surface.dark.base : surface.light.base;
  const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  const handlePickMedia = async (type: "image" | "video") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: type === "image",
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType(type);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !mediaUri) {
      Alert.alert("Erro", "O post precisa ter texto ou mídia.");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert("Termos", "Você precisa aceitar os termos da comunidade.");
      return;
    }

    try {
      setLoading(true);
      const result = await communityService.createPost(text, mediaUri, mediaType, []);

      if (!result.success) {
        // Handle auto-blocked posts with appropriate feedback
        if (result.moderationStatus === "auto_blocked") {
          Alert.alert(
            "Conteúdo Não Permitido",
            result.error || "Seu conteúdo não atende às diretrizes da comunidade. Por favor, revise e tente novamente.",
            [{ text: "Entendi", style: "cancel" }]
          );
        } else {
          throw new Error(result.error);
        }
        return;
      }

      // Success - show appropriate message based on moderation status
      const title = result.moderationStatus === "auto_approved" 
        ? "Publicado!" 
        : "Enviado para Revisão";
      const message = result.message || 
        (result.moderationStatus === "auto_approved"
          ? "Seu post foi publicado com sucesso!"
          : "Seu post foi enviado e será analisado. Você será notificada quando for aprovado.");

      Alert.alert(title, message, [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch {
      Alert.alert("Erro", "Não foi possível enviar o post. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: bgPrimary }}
    >
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: insets.bottom + 100 }}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: textPrimary,
              backgroundColor: isDark ? Tokens.neutral[800] : Tokens.neutral[50],
              borderColor: borderColor,
            },
          ]}
          placeholder="O que você quer compartilhar?"
          placeholderTextColor={textSecondary}
          multiline
          value={text}
          onChangeText={setText}
          maxLength={1000}
          accessibilityLabel="Conteúdo do post"
          accessibilityHint="Digite o texto que deseja compartilhar com a comunidade"
        />

        {mediaUri ? (
          <View style={styles.mediaPreview}>
            {mediaType === "video" ? (
              <View style={[styles.videoPlaceholder, { borderColor }]}>
                <Ionicons name="videocam" size={48} color={Tokens.brand.primary[500]} />
                <Text style={{ color: textPrimary, marginTop: 8 }}>Vídeo selecionado</Text>
              </View>
            ) : (
              <Image
                source={{ uri: mediaUri }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel="Preview da imagem selecionada"
              />
            )}
            <Pressable
              style={styles.removeMedia}
              onPress={() => {
                setMediaUri(null);
                setMediaType("text");
              }}
              accessibilityRole="button"
              accessibilityLabel="Remover mídia selecionada"
            >
              <Ionicons name="close" size={20} color={Tokens.neutral[0]} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.mediaButtons}>
            <Pressable
              style={[styles.mediaBtn, { borderColor }]}
              onPress={() => handlePickMedia("image")}
              accessibilityRole="button"
              accessibilityLabel="Adicionar foto"
            >
              <Ionicons name="image-outline" size={24} color={Tokens.brand.primary[500]} />
              <Text style={[styles.mediaBtnText, { color: textPrimary }]}>Foto</Text>
            </Pressable>
            <Pressable
              style={[styles.mediaBtn, { borderColor }]}
              onPress={() => handlePickMedia("video")}
              accessibilityRole="button"
              accessibilityLabel="Adicionar vídeo"
            >
              <Ionicons name="videocam-outline" size={24} color={Tokens.brand.primary[500]} />
              <Text style={[styles.mediaBtnText, { color: textPrimary }]}>Vídeo</Text>
            </Pressable>
          </View>
        )}

        <View
          style={[
            styles.termsBox,
            { backgroundColor: isDark ? Tokens.neutral[800] : Tokens.neutral[50], borderColor },
          ]}
        >
          <View style={styles.warningRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Tokens.brand.primary[500]} />
            <Text style={[styles.warningTitle, { color: textPrimary }]}>Segurança</Text>
          </View>
          <Text style={[styles.warningText, { color: textSecondary }]}>
            Seu post será revisado antes de aparecer para outras mães. Evite dados sensíveis.
          </Text>
          <View style={styles.switchRow}>
            <Switch
              value={acceptedTerms}
              onValueChange={setAcceptedTerms}
              trackColor={{ false: Tokens.neutral[300], true: Tokens.brand.primary[500] }}
              accessibilityLabel="Aceitar regras da comunidade"
              accessibilityRole="switch"
              accessibilityState={{ checked: acceptedTerms }}
            />
            <Text style={[styles.switchLabel, { color: textPrimary }]}>
              Aceito as regras da comunidade.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: bgPrimary,
            borderTopColor: borderColor,
            paddingBottom: insets.bottom || SPACING.lg,
          },
        ]}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={loading || (!text.trim() && !mediaUri) || !acceptedTerms}
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                (!text.trim() && !mediaUri) || !acceptedTerms
                  ? Tokens.neutral[300]
                  : Tokens.brand.primary[500],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Publicar post"
          accessibilityState={{
            disabled: loading || (!text.trim() && !mediaUri) || !acceptedTerms,
          }}
        >
          {loading ? (
            <ActivityIndicator color={Tokens.neutral[0]} />
          ) : (
            <Text style={styles.submitBtnText}>Publicar</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 150,
    textAlignVertical: "top",
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: SPACING.lg,
  },
  mediaButtons: { flexDirection: "row", gap: SPACING.md, marginBottom: SPACING.lg },
  mediaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  mediaBtnText: { fontSize: 14, fontWeight: "600" },
  mediaPreview: { position: "relative", marginBottom: SPACING.lg },
  image: { width: "100%", height: 250, borderRadius: RADIUS.lg },
  videoPlaceholder: {
    width: "100%",
    height: 250,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  removeMedia: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: Tokens.overlay.dark,
    padding: 6,
    borderRadius: RADIUS.full,
  },
  termsBox: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.xl,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  warningTitle: { fontSize: 16, fontWeight: "700" },
  warningText: { fontSize: 14, lineHeight: 20, marginBottom: SPACING.lg },
  switchRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  switchLabel: { flex: 1, fontSize: 14 },
  footer: { padding: SPACING.lg, borderTopWidth: 1 },
  submitBtn: { padding: SPACING.lg, borderRadius: RADIUS.full, alignItems: "center" },
  submitBtnText: { color: Tokens.neutral[0], fontSize: 16, fontWeight: "700" },
});
