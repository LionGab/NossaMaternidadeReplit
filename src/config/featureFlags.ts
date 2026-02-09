import { isEnvEnabled, isEnvDisabled } from "./env";

/**
 * Feature flags para controle de features
 *
 * REDESIGN flags: Default TRUE (redesigns são a versão principal)
 * Para desabilitar um redesign, setar EXPO_PUBLIC_REDESIGN_*=0
 *
 * FEATURE flags: Default FALSE (features experimentais)
 * Para habilitar uma feature, setar EXPO_PUBLIC_FEATURE_*=1
 */
export const FEATURE_FLAGS = {
  // Existing flags (Fase 1) - Default: FALSE
  get MUNDO_NATH_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_MUNDO_NATH");
  },
  get COMMUNITY_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_COMMUNITY");
  },
  get NATHIA_NEW_UI_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_NATHIA_NEW_UI");
  },

  // Redesign flags - Default: TRUE (redesigns são a versão principal agora)
  // Para forçar versão legacy, setar EXPO_PUBLIC_REDESIGN_*=0
  get REDESIGN_HOME() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_HOME");
  },
  get REDESIGN_ASSISTANT() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_ASSISTANT");
  },
  get REDESIGN_MUNDONATH() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_MUNDONATH");
  },
  get REDESIGN_MEUSHABITOS() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_MEUSHABITOS");
  },
  get REDESIGN_MAEVALENTE() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_MAEVALENTE");
  },
  get REDESIGN_PAYWALL() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_PAYWALL");
  },
  get REDESIGN_ONBOARDING() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_ONBOARDING");
  },
  get REDESIGN_S8() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_S8");
  },
  get REDESIGN_S9() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_S9");
  },
  get REDESIGN_S10() {
    return !isEnvDisabled("EXPO_PUBLIC_REDESIGN_S10");
  },
} as const;
