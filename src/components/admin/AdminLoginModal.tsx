import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";

// Backward compatibility mapping
const LOCAL_COLORS = {
  slate: Tokens.neutral,
  rose: Tokens.brand.primary,
};

interface AdminLoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const ADMIN_PIN = "1234"; // Simple PIN for demo (DEV only)
const isAdminEnabled = __DEV__;

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ visible, onClose, onLogin }) => {
  const theme = useTheme();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isAdminEnabled) return null;

  const handleVerify = () => {
    if (pin === ADMIN_PIN) {
      onLogin();
      setPin("");
      setError(false);
      onClose();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />

        <View
          style={[
            styles.content,
            {
              backgroundColor: theme.surface.elevated,
              shadowColor: Tokens.neutral[900],
            },
          ]}
        >
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={LOCAL_COLORS.slate[400]} />
          </Pressable>

          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={32} color={LOCAL_COLORS.rose[500]} />
          </View>

          <Text style={styles.title}>Área da Nathália</Text>
          <Text style={styles.subtitle}>Digite o PIN para acessar o modo Admin</Text>

          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={pin}
            onChangeText={(t) => {
              setPin(t);
              setError(false);
            }}
            placeholder="PIN"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            autoFocus
          />

          {error && <Text style={styles.errorText}>PIN incorreto</Text>}

          <Pressable style={styles.button} onPress={handleVerify}>
            <Text style={[styles.buttonText, { color: theme.text.inverse }]}>Entrar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Tokens.spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: 340,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.xl,
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: Tokens.spacing.lg,
    right: Tokens.spacing.lg,
    zIndex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: LOCAL_COLORS.rose[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing.lg,
  },
  title: {
    ...Tokens.typography.headlineMedium,
    color: LOCAL_COLORS.slate[700],
    marginBottom: 8,
  },
  subtitle: {
    ...Tokens.typography.bodySmall,
    color: LOCAL_COLORS.slate[500],
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: LOCAL_COLORS.slate[200],
    borderRadius: Tokens.radius.md,
    paddingHorizontal: 16,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 16,
    color: LOCAL_COLORS.slate[800],
    backgroundColor: LOCAL_COLORS.slate[50],
  },
  inputError: {
    borderColor: LOCAL_COLORS.rose[500],
    backgroundColor: LOCAL_COLORS.rose[50],
  },
  errorText: {
    color: LOCAL_COLORS.rose[500],
    ...Tokens.typography.labelLarge,
    marginTop: -8,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: LOCAL_COLORS.rose[500],
    borderRadius: Tokens.radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    ...Tokens.typography.bodyMedium,
    fontWeight: "600",
  },
});
