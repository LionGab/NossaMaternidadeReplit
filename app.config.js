// HOTFIX: Desabilitar OTA updates para TestFlight para corrigir startup crash
// EAS_NO_UPDATES é setado no eas.json para o profile ios_testflight
const disableUpdates = process.env.EAS_NO_UPDATES === "true";

// Determinar se é build de produção para desabilitar updates no nível nativo
const isProduction = process.env.EXPO_PUBLIC_ENV === "production";

// Fallback para dev local quando .env não existe (valores do projeto, anon key é pública)
const isDev = process.env.NODE_ENV === "development";
const DEV_SUPABASE_URL = "https://lqahkqfpynypbmhtffyi.supabase.co";
const DEV_SUPABASE_ANON_KEY =
  "***REMOVED***";
const DEV_SUPABASE_FUNCTIONS_URL = `${DEV_SUPABASE_URL}/functions/v1`;

module.exports = ({ config }) => {
  return {
    ...config,
    name: "Nossa Maternidade",
    slug: "nossamaternidade",
    owner: "liongab",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "br.com.nossamaternidade.app",
      // Build number vem do CI (timestamp) e evita duplicidade no App Store Connect.
      buildNumber: process.env.IOS_BUILD_NUMBER ?? "1",
      // CRÍTICO: Habilitar Sign in with Apple (obrigatório para apps com login social)
      usesAppleSignIn: true,
      // Associated Domains para deep linking e universal links
      // TEMPORARIAMENTE DESABILITADO - provisioning profile precisa ser regenerado
      // Regenerar profile iOS: `npm run eas:credentials:regen:ios`
      // associatedDomains: [
      //   "applinks:nossamaternidade.app",
      //   "applinks:www.nossamaternidade.app",
      //   "applinks:lqahkqfpynypbmhtffyi.supabase.co",
      // ],
      // Entitlements explícitos para capabilities
      entitlements: {
        "aps-environment": "production",
        "com.apple.developer.applesignin": ["Default"],
      },
      // Privacy Manifest (iOS 17+ obrigatório para App Store)
      // Documenta quais APIs de privacidade o app usa e por quê
      privacyManifests: {
        NSPrivacyTracking: false,
        NSPrivacyTrackingDomains: [],
        NSPrivacyCollectedDataTypes: [
          {
            NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeEmailAddress",
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
          {
            NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeName",
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
          {
            NSPrivacyCollectedDataType: "NSPrivacyCollectedDataTypeHealth",
            NSPrivacyCollectedDataTypeLinked: true,
            NSPrivacyCollectedDataTypeTracking: false,
            NSPrivacyCollectedDataTypePurposes: [
              "NSPrivacyCollectedDataTypePurposeAppFunctionality",
            ],
          },
        ],
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPITypeReasons: ["C617.1"],
          },
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
          },
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
            NSPrivacyAccessedAPITypeReasons: ["E174.1"],
          },
        ],
      },
      infoPlist: {
        NSCameraUsageDescription: "Este aplicativo precisa acessar a câmera para capturar fotos.",
        NSPhotoLibraryUsageDescription:
          "Este aplicativo precisa acessar a biblioteca de fotos para selecionar imagens.",
        NSPhotoLibraryAddUsageDescription:
          "Este aplicativo precisa salvar fotos na sua biblioteca.",
        // Privacy strings obrigatórias (Apple requer mesmo se não usadas diretamente)
        NSContactsUsageDescription:
          "O Nossa Maternidade pode precisar acessar seus contatos para funcionalidades futuras de compartilhamento e convites para grupos da comunidade.",
        NSCalendarsUsageDescription:
          "O Nossa Maternidade pode precisar acessar seu calendário para lembrá-la de consultas médicas, check-ins diários e eventos importantes da sua jornada de maternidade.",
        NSLocationWhenInUseUsageDescription:
          "O Nossa Maternidade pode usar sua localização para recomendar grupos da comunidade próximos a você e personalizar conteúdo regional.",
        ITSAppUsesNonExemptEncryption: false,
        // CRÍTICO: Desabilitar expo-updates no nível NATIVO para evitar crash
        // Isso previne que o ErrorRecovery.swift tente usar cache OTA corrompido
        EXUpdatesEnabled: isProduction ? false : true,
        // Background Modes para push notifications
        UIBackgroundModes: ["remote-notification"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.liongab.nossamaternidade",
      // A cada release Android para Play Store, incrementar versionCode (obrigatório)
      versionCode: 1,
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_MEDIA_IMAGES",
      ],
    },
    // Web desabilitado: foco iOS/Android; privacidade/suporte em pasta separada (legal-pages, archive/privacy-support)
    plugins: [
      // SDK 55: plugins list must be declared manually because this is a dynamic (JS) config.
      "@react-native-community/datetimepicker",
      "@sentry/react-native",
      "expo-asset",
      "expo-audio",
      "expo-font",
      "expo-image",
      "expo-localization",
      "expo-mail-composer",
      "expo-secure-store",
      "expo-sharing",
      "expo-sqlite",
      "expo-tracking-transparency",
      "expo-video",
      "expo-web-browser",
      "expo-notifications",
      [
        "expo-image-picker",
        {
          photosPermission:
            "Este aplicativo precisa acessar suas fotos para você poder compartilhar imagens.",
          cameraPermission: "Este aplicativo precisa acessar a câmera para você poder tirar fotos.",
        },
      ],
      // expo-build-properties para configurações nativas avançadas
      [
        "expo-build-properties",
        {
          ios: {
            // Deployment target mínimo 15.1 (requerido por expo-build-properties)
            deploymentTarget: "15.1",
          },
          android: {
            // SDK 55 / RN 0.83.1 requer compileSdk e targetSdk 36
            compileSdkVersion: 36,
            targetSdkVersion: 36,
          },
        },
      ],
    ],
    updates: {
      // HOTFIX: Desabilitado completamente para produção
      // ErrorRecovery.crash() causava crash em 0.7s após launch devido cache OTA corrompido
      // Solução: desabilitar no JS E no nativo (via EXUpdatesEnabled no infoPlist)
      enabled: !disableUpdates && !isProduction,
      // Enable bsdiff patches for smaller EAS Update downloads (only used when updates are enabled).
      enableBsdiffPatchSupport: true,
      // CRÍTICO: "NEVER" para produção - não verificar updates automaticamente
      checkAutomatically: isProduction ? "NEVER" : "ON_ERROR_RECOVERY",
      // fallbackToCacheTimeout: 0 = usa embedded bundle imediatamente se cache falhar
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/ec07a024-3e98-4023-af9b-1c5ecb9df2af",
      requestHeaders: {
        "expo-platform": "ios",
      },
    },
    // Mantido fixo temporariamente para previsibilidade durante estabilização pós SDK 55.
    // Política final (appVersion/fingerprint) será definida em etapa posterior.
    runtimeVersion: "3.0.0",
    extra: {
      eas: {
        projectId: "ec07a024-3e98-4023-af9b-1c5ecb9df2af",
      },
      // Mapear variáveis de ambiente para extra (runtime access)
      // Necessário porque getEnv() em src/config/env.ts lê de Constants.expoConfig.extra
      // CRÍTICO: No EAS Build, essas variáveis são injetadas como process.env durante o build
      // Em dev local sem .env: fallback com valores do projeto para evitar "[env] Critical... missing"
      env: process.env.EXPO_PUBLIC_ENV || "production",
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || (isDev ? DEV_SUPABASE_URL : ""),
      supabaseAnonKey:
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || (isDev ? DEV_SUPABASE_ANON_KEY : ""),
      supabaseFunctionsUrl:
        process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL || (isDev ? DEV_SUPABASE_FUNCTIONS_URL : ""),
      revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "",
      revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
      sentry: {
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",
      },
      safeBoot: process.env.EXPO_PUBLIC_SAFE_BOOT || "false",
      enableAIFeatures: process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES,
      enableAppleFoundationModels: process.env.EXPO_PUBLIC_ENABLE_APPLE_FOUNDATION_MODELS,
      enableGamification: process.env.EXPO_PUBLIC_ENABLE_GAMIFICATION,
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS,
      socialLoginEnabled: process.env.EXPO_PUBLIC_SOCIAL_LOGIN_ENABLED,
    },
  };
};
