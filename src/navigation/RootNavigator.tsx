/**
 * Nossa Maternidade - Root Navigator
 * Flow:
 * 1) Auth (Landing + Email)
 * 2) Notification Permission
 * 3) Nath Journey Onboarding
 * 4) Main App (Tabs + secondary screens)
 */

import { screenToggle } from "@/navigation/screenToggle";
import { RootStackParamList } from "@/navigation/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { ComponentType, lazy, Suspense, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import {
  isDevBypassActive,
  isLoginBypassActive,
  isNotificationBypassActive,
  isOnboardingBypassActive,
} from "../config/dev-bypass";
import { useNotificationSetup } from "../hooks/useNotificationSetup";
import { useAppStore } from "../state";
import { COLORS } from "../theme/tokens";
import { FlowState, resolveNavigationFlags } from "./flowResolver";

// Auth Screens
import { AuthLandingScreen, EmailAuthScreen } from "../screens/auth";
import AuthLandingScreenNathia from "../screens/auth/AuthLandingScreenNathia";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import NotificationPermissionScreen from "../screens/shared/NotificationPermissionScreen";

// Nath Journey Onboarding - Modular Screens (12 screens com Movimento Valente + Nathia Design 2026)
import OnboardingCheckIn from "../screens/onboarding/OnboardingCheckIn";
import OnboardingCheckInNathia from "../screens/onboarding/OnboardingCheckInNathia";
import OnboardingConcerns from "../screens/onboarding/OnboardingConcerns";
import OnboardingConcernsNathia from "../screens/onboarding/OnboardingConcernsNathia";
import OnboardingDate from "../screens/onboarding/OnboardingDate";
import OnboardingDateNathia from "../screens/onboarding/OnboardingDateNathia";
import OnboardingEmotionalState from "../screens/onboarding/OnboardingEmotionalState";
import OnboardingEmotionalStateNathia from "../screens/onboarding/OnboardingEmotionalStateNathia";
import OnboardingJourneySelect from "../screens/onboarding/OnboardingJourneySelect";
import OnboardingJourneySelectNathia from "../screens/onboarding/OnboardingJourneySelectNathia";
import OnboardingMaternityStage from "../screens/onboarding/OnboardingMaternityStage";
import OnboardingMaternityStageNathia from "../screens/onboarding/OnboardingMaternityStageNathia";
import OnboardingPaywall from "../screens/onboarding/OnboardingPaywall";
import OnboardingPaywallNathia from "../screens/onboarding/OnboardingPaywallNathia";
import OnboardingSeason from "../screens/onboarding/OnboardingSeason";
import OnboardingSeasonNathia from "../screens/onboarding/OnboardingSeasonNathia";
import OnboardingStage from "../screens/onboarding/OnboardingStage";
import OnboardingStageNathia from "../screens/onboarding/OnboardingStageNathia";
import OnboardingSummary from "../screens/onboarding/OnboardingSummary";
import OnboardingSummaryNathia from "../screens/onboarding/OnboardingSummaryNathia";
import OnboardingWelcome from "../screens/onboarding/OnboardingWelcome";
import OnboardingWelcomeNathia from "../screens/onboarding/OnboardingWelcomeNathia";
import { useNathJourneyOnboardingStore } from "../state/nath-journey-onboarding-store";

// Main Navigator
import MainTabNavigator from "./MainTabNavigator";

// ===========================================
// LAZY LOADING - Secondary screens (loaded on-demand)
// ===========================================

// Loading fallback for lazy screens
const LazyLoadingFallback = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.background.primary,
    }}
  >
    <ActivityIndicator size="large" color={COLORS.primary[500]} />
  </View>
);

// Helper to wrap lazy components with Suspense
function withSuspense<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>
) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={<LazyLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Feature Screens - Lazy loaded for better initial bundle size (organized by feature)
// Care screens
const AffirmationsScreenLegacy = withSuspense(
  lazy(() => import("../screens/care/AffirmationsScreen"))
);
const AffirmationsScreenRedesign = withSuspense(
  lazy(() => import("../screens/care/AffirmationsScreenRedesign"))
);
const DailyLogScreenLegacy = withSuspense(lazy(() => import("../screens/care/DailyLogScreen")));
const HabitsEnhancedScreen = withSuspense(
  lazy(() => import("../screens/care/HabitsEnhancedScreen"))
);

// Community screens
const MyPostsScreen = withSuspense(lazy(() => import("../screens/community/MyPostsScreen")));
const NewPostScreen = withSuspense(lazy(() => import("../screens/community/NewPostScreen")));
const PostDetailScreen = withSuspense(lazy(() => import("../screens/community/PostDetailScreen")));

// Profile screens
const ProfileScreenLegacy = withSuspense(lazy(() => import("../screens/profile/ProfileScreen")));

// Shared screens
const ComingSoonScreen = withSuspense(lazy(() => import("../screens/shared/ComingSoonScreen")));
const DesignSystemScreen = withSuspense(lazy(() => import("../screens/shared/DesignSystemScreen")));
const NotificationPreferencesScreen = withSuspense(
  lazy(() => import("../screens/shared/NotificationPreferencesScreen"))
);

// Premium/Wellness screens
const BreathingExerciseScreen = withSuspense(
  lazy(() => import("../screens/wellness/BreathingExerciseScreen"))
);
const MaeValenteProgressScreen = withSuspense(
  lazy(() => import("../screens/wellness/MaeValenteProgressScreen"))
);
const RestSoundsScreen = withSuspense(lazy(() => import("../screens/wellness/RestSoundsScreen")));

// Mundo da Nath screens
const MundoDaNathScreenRedesign = withSuspense(
  lazy(() => import("../screens/mundo/MundoDaNathScreenRedesign"))
);

// Paywall screen
const PaywallScreen = withSuspense(lazy(() => import("../screens/premium/PaywallScreenRedesign")));

// Legal screens
const PrivacyPolicyScreen = withSuspense(
  lazy(() => import("../screens/legal/PrivacyPolicyScreen"))
);
const TermsOfServiceScreen = withSuspense(
  lazy(() => import("../screens/legal/TermsOfServiceScreen"))
);

// Admin Screens - Lazy loaded (restricted access)
const AdminDashboardScreen = withSuspense(
  lazy(() => import("../screens/admin/AdminDashboardScreen"))
);
const ModerationScreen = withSuspense(lazy(() => import("../screens/admin/ModerationScreen")));
const AdminPostsListScreen = withSuspense(
  lazy(() => import("../screens/admin/AdminPostsListScreen"))
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  // App state (reactive - triggers re-render on change)
  const isAuthenticatedFromStore = useAppStore((s) => s.isAuthenticated);

  // Nath Journey onboarding state (reactive)
  // CRITICAL: Use stable selector to prevent unnecessary re-renders
  const isNathJourneyOnboardingCompleteFromStore = useNathJourneyOnboardingStore(
    (s) => s.isComplete
  );

  // Notification permission state (reactive - no polling needed)
  const { isSetupDone: notificationSetupDoneFromHook } = useNotificationSetup();

  // Apply granular dev bypasses for testing
  const isAuthenticated = isAuthenticatedFromStore || isLoginBypassActive();
  const notificationSetupDone = notificationSetupDoneFromHook || isNotificationBypassActive();
  const isNathJourneyOnboardingComplete =
    isNathJourneyOnboardingCompleteFromStore || isOnboardingBypassActive();

  // Build flow state for resolver (simplified - no more legacy onboarding or NathIA)
  const flowState: FlowState = {
    isAuthenticated,
    notificationSetupDone,
    isNathJourneyOnboardingComplete,
    // These are now always true since we removed the duplicates
    isOnboardingComplete: true,
    isNathIAOnboardingComplete: true,
  };

  // Use flowResolver for deterministic navigation (no polling, no race conditions)
  const devBypassActive = isDevBypassActive();
  const {
    shouldShowLogin,
    shouldShowNotificationPermission,
    shouldShowNathJourneyOnboarding,
    shouldShowMainApp,
  } = resolveNavigationFlags(flowState, devBypassActive);

  // CRITICAL: Memoize flags to prevent unnecessary re-renders
  // This prevents React Navigation from resetting when flags haven't actually changed
  // NOTE: Must be before any early returns to comply with Rules of Hooks
  const stableFlags = useMemo(
    () => ({
      shouldShowLogin,
      shouldShowNotificationPermission,
      shouldShowNathJourneyOnboarding,
      shouldShowMainApp,
    }),
    [
      shouldShowLogin,
      shouldShowNotificationPermission,
      shouldShowNathJourneyOnboarding,
      shouldShowMainApp,
    ]
  );

  // Loading state while checking notification permission (after all hooks)
  if (notificationSetupDoneFromHook === null) {
    return <LazyLoadingFallback />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // Animação premium: slide suave do iOS
        animation: "slide_from_right",
        contentStyle: { backgroundColor: COLORS.background.primary },
      }}
    >
      {/* Stage 1: Auth (Landing + Email) - Nathia Design 2026 */}
      {stableFlags.shouldShowLogin && (
        <>
          <Stack.Screen
            name="AuthLanding"
            component={screenToggle(
              "redesign.onboarding",
              AuthLandingScreenNathia,
              AuthLandingScreen
            )}
            options={{ animation: "fade" }}
          />
          <Stack.Screen
            name="EmailAuth"
            component={EmailAuthScreen}
            options={{
              // Modal premium com animação suave
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </>
      )}

      {/* Stage 2: Notification Permission */}
      {stableFlags.shouldShowNotificationPermission && (
        <Stack.Screen
          name="NotificationPermission"
          component={NotificationPermissionScreen}
          options={{ animation: "fade" }}
        />
      )}

      {/* Stage 3: Nath Journey Onboarding - 12 Modular Screens (Movimento Valente + Nathia Design 2026) */}
      {stableFlags.shouldShowNathJourneyOnboarding && (
        <>
          {/* Welcome - Porta de entrada do Movimento Valente */}
          <Stack.Screen
            name="OnboardingWelcome"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingWelcomeNathia,
              OnboardingWelcome
            )}
            options={{ animation: "fade", gestureEnabled: false }}
          />
          {/* Journey Select - Escolha da jornada de vida (6 opções) */}
          <Stack.Screen
            name="OnboardingJourneySelect"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingJourneySelectNathia,
              OnboardingJourneySelect
            )}
            options={{ animation: "slide_from_right" }}
          />
          {/* Maternity Stage - Estágio específico (apenas se jornada = MATERNIDADE) */}
          <Stack.Screen
            name="OnboardingMaternityStage"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingMaternityStageNathia,
              OnboardingMaternityStage
            )}
            options={{ animation: "slide_from_right" }}
          />
          {/* Stage - Estágio da gravidez */}
          <Stack.Screen
            name="OnboardingStage"
            component={screenToggle("redesign.onboarding", OnboardingStageNathia, OnboardingStage)}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingDate"
            component={screenToggle("redesign.onboarding", OnboardingDateNathia, OnboardingDate)}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingConcerns"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingConcernsNathia,
              OnboardingConcerns
            )}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingEmotionalState"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingEmotionalStateNathia,
              OnboardingEmotionalState
            )}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingCheckIn"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingCheckInNathia,
              OnboardingCheckIn
            )}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingSeason"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingSeasonNathia,
              OnboardingSeason
            )}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingSummary"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingSummaryNathia,
              OnboardingSummary
            )}
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="OnboardingPaywall"
            component={screenToggle(
              "redesign.onboarding",
              OnboardingPaywallNathia,
              OnboardingPaywall
            )}
            options={{ animation: "slide_from_right", gestureEnabled: false }}
          />
        </>
      )}

      {/* Stage 5: Main App */}
      {stableFlags.shouldShowMainApp && (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* Feature Screens */}
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{
              headerShown: true,
              headerTitle: "Post",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="NewPost"
            component={NewPostScreen}
            options={{
              // Modal premium com animação suave
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: true,
              headerTitle: "Nova Publicação",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="MyPosts"
            component={MyPostsScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="DailyLog"
            component={DailyLogScreenLegacy}
            options={{
              headerShown: false,
              // Modal premium com animação suave
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="Affirmations"
            component={screenToggle(
              "redesign.screen10",
              AffirmationsScreenRedesign,
              AffirmationsScreenLegacy
            )}
            options={{
              headerShown: false,
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="Habits"
            component={HabitsEnhancedScreen}
            options={{
              headerShown: true,
              headerTitle: "Meus Cuidados",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          {/* ARCHIVED: Privacy/Legal screens moved to archive/privacy-support/ */}
          {/* <Stack.Screen
            name="Legal"
            component={LegalScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          /> */}
          <Stack.Screen
            name="EditProfile"
            component={ProfileScreenLegacy}
            options={{
              headerShown: true,
              headerTitle: "Perfil",
              headerBackTitle: "Voltar",
              headerTintColor: COLORS.primary[600],
              headerStyle: { backgroundColor: COLORS.background.primary },
            }}
          />
          <Stack.Screen
            name="ComingSoon"
            component={ComingSoonScreen}
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="DesignSystem"
            component={DesignSystemScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="NotificationPreferences"
            component={NotificationPreferencesScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          {/* ARCHIVED: Privacy/Legal screens moved to archive/privacy-support/ */}
          {/* <Stack.Screen
            name="PrivacySettings"
            component={PrivacySettingsScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          /> */}

          {/* Premium Wellness Screens */}
          <Stack.Screen
            name="BreathingExercise"
            component={BreathingExerciseScreen}
            options={{
              headerShown: false,
              // Animação fade suave para exercícios de respiração
              presentation: "modal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="RestSounds"
            component={RestSoundsScreen}
            options={{
              headerShown: false,
              // Modal premium com animação suave
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="HabitsEnhanced"
            component={HabitsEnhancedScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="MaeValenteProgress"
            component={screenToggle(
              "redesign.maeValente",
              MaeValenteProgressScreen,
              MaeValenteProgressScreen
            )}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Paywall Screen */}
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              headerShown: false,
              // Modal premium com animação suave para Paywall
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />

          {/* Mundo da Nath Screen */}
          <Stack.Screen
            name="MundoDaNath"
            component={MundoDaNathScreenRedesign}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Admin - Mundo da Nath (acesso restrito via useAdmin) */}
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="Moderation"
            component={ModerationScreen}
            options={{
              headerShown: false,
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="AdminPostsList"
            component={AdminPostsListScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />

          {/* Legal Screens */}
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfServiceScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
