/**
 * NathIAStackNavigator - AI Consent Gate for NathIA Tab
 *
 * This stack replaces the direct AssistantScreen in the MainTabNavigator.
 * It implements a consent gate that shows different screens based on AI consent status:
 *
 * - unknown → AIConsentScreen (first-time users)
 * - accepted + enabled → AssistantScreen (full AI chat)
 * - declined OR disabled → NathIADisabledScreen (degraded mode)
 *
 * The navigator uses a key-based remount strategy to react to store changes.
 * It also waits for AsyncStorage hydration to prevent consent screen flash.
 *
 * @see docs/release/TESTFLIGHT_GATES_v1.md Gate G2.5 (Privacy Compliance)
 */

import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import { AIConsentScreen } from "../screens/shared/AIConsentScreen";
import { NathIADisabledScreen } from "../screens/assistant/NathIADisabledScreen";
import AssistantScreen from "../screens/assistant/AssistantScreen";
import { usePrivacyStore } from "../state/usePrivacyStore";
import { useTheme } from "../hooks/useTheme";
import type { MainTabParamList, MainTabScreenProps } from "../types/navigation";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- type required for ParamListBase compatibility
export type NathIAStackParamList = {
  AIConsent: undefined;
  NathIADisabled: undefined;
  AssistantChat: undefined;
};

const Stack = createNativeStackNavigator<NathIAStackParamList>();

/**
 * Wrapper component that adapts navigation props for AssistantScreen
 * Uses type assertion because NathIA stack is nested inside MainTabs
 * but AssistantScreen expects MainTabScreenProps
 */
function AssistantChatWrapper() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainTabParamList, "Assistant">>();

  // Type assertion needed because we're inside NathIAStack but AssistantScreen
  // expects MainTabScreenProps. The navigation will work correctly at runtime.
  return (
    <AssistantScreen
      navigation={navigation as MainTabScreenProps<"Assistant">["navigation"]}
      route={route}
    />
  );
}

export function NathIAStackNavigator() {
  const { colors } = useTheme();

  // Subscribe to consent state (use individual values, not derived functions)
  const aiConsentStatus = usePrivacyStore((s) => s.aiConsentStatus);
  const isAiEnabled = usePrivacyStore((s) => s.isAiEnabled);
  const hasHydrated = usePrivacyStore((s) => s._hasHydrated);

  // Compute canUseAi locally to ensure reactive updates
  // (selecting s.canUseAi returns a function ref that doesn't trigger re-renders)
  const canUseAi = aiConsentStatus === "accepted" && isAiEnabled === true;

  // Determine initial route based on current state
  const initialRouteName = useMemo<keyof NathIAStackParamList>(() => {
    // Case 1: User can use AI (accepted + enabled)
    if (canUseAi) {
      return "AssistantChat";
    }

    // Case 2: User hasn't seen consent screen yet
    if (aiConsentStatus === "unknown") {
      return "AIConsent";
    }

    // Case 3: User declined or disabled AI (degraded mode)
    return "NathIADisabled";
  }, [aiConsentStatus, canUseAi]);

  // Key forces remount when consent state changes
  // This ensures the navigator re-evaluates initialRouteName
  const navKey = `${aiConsentStatus}:${isAiEnabled}`;

  // Show loading state while store is hydrating from AsyncStorage
  // This prevents flash of consent screen for returning users
  if (!hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      key={navKey}
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="AIConsent"
        component={AIConsentScreen}
        options={{
          gestureEnabled: false, // Don't allow swiping back
        }}
      />
      <Stack.Screen
        name="NathIADisabled"
        component={NathIADisabledScreen}
        options={{
          gestureEnabled: false, // Don't allow swiping back
        }}
      />
      <Stack.Screen
        name="AssistantChat"
        component={AssistantChatWrapper}
        options={{
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}
