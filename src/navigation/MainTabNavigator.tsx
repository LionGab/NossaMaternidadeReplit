/**
 * Nossa Maternidade - Main Tab Navigator (Premium iOS-style)
 *
 * Tabs: Home | MãesValente | NathIA (centro elevado) | Mundo Nath | Meus Cuidados
 * Custom Tab Bar com animações Reanimated + glassmorphism
 * Tab central com glow effect pulsante
 */

import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { brand, neutral, spacing } from "../theme/tokens";
import { MainTabParamList, MainTabScreenProps } from "../types/navigation";

// Avatar da NathIA
const NATHIA_AVATAR = require("../../assets/nathia-app.png");

// Navigation - AI Consent Gate
import { NathIAStackNavigator } from "./NathIAStackNavigator";

// Components
import { ScreenErrorBoundary } from "../components/ScreenErrorBoundary";

// Screens - Nathia Design (2026) - organized by feature
import HomeScreen from "../screens/home/HomeScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import MundoScreenNathia from "../screens/mundo/MundoScreenNathia";
import HabitosScreenNathia from "../screens/care/HabitosScreenNathia";

// Wrappers com ScreenErrorBoundary para telas críticas
const HomeScreenWithBoundary = (props: MainTabScreenProps<"Home">) => {
  return (
    <ScreenErrorBoundary screenName="Home" navigation={props.navigation}>
      <HomeScreen {...props} />
    </ScreenErrorBoundary>
  );
};

const CommunityScreenWithBoundary = (props: MainTabScreenProps<"Community">) => {
  return (
    <ScreenErrorBoundary screenName="MãesValente" navigation={props.navigation}>
      <CommunityScreen {...props} />
    </ScreenErrorBoundary>
  );
};

const MundoScreenWithBoundary = (props: MainTabScreenProps<"MundoNath">) => {
  return (
    <ScreenErrorBoundary screenName="Mundo da Nath" navigation={props.navigation}>
      <MundoScreenNathia {...props} />
    </ScreenErrorBoundary>
  );
};

const HabitosScreenWithBoundary = (props: MainTabScreenProps<"MyCare">) => {
  return (
    <ScreenErrorBoundary screenName="Meus Cuidados" navigation={props.navigation}>
      <HabitosScreenNathia {...props} />
    </ScreenErrorBoundary>
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// ============================================================================
// TAB BUTTON COMPONENTS
// ============================================================================

/**
 * Regular Tab Button - Para tabs laterais (Home, MãesValente, Mundo Nath, Meus Cuidados)
 */
const TabButton = memo<{
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  onPress: () => void;
}>(({ label, icon, focused, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabButton}
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons name={icon} size={24} color={focused ? brand.primary[500] : neutral[600]} />
      </Animated.View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
});

TabButton.displayName = "TabButton";

/**
 * NathIA Tab Button - Tab central com avatar, glow pulsante e gradient
 */
const NathIATabButton = memo<{ focused: boolean; onPress: () => void }>(({ focused, onPress }) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 1500 }), withTiming(0.08, { duration: 1500 })),
      -1
    );
  }, [glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: focused ? glowOpacity.value : 0.05,
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.centerTabContainer}
      accessibilityLabel="Chat com NathIA"
      accessibilityRole="button"
    >
      {/* Glow effect pulsante */}
      <Animated.View style={[styles.centerTabGlow, glowStyle]} />

      <Animated.View style={[styles.centerTabButton, animatedStyle]}>
        <LinearGradient
          colors={
            focused
              ? [brand.primary[500], brand.accent[300]]
              : [brand.primary[50], brand.accent[50]]
          }
          style={[
            styles.centerTabGradient,
            { borderColor: focused ? brand.primary[300] : brand.primary[200] },
          ]}
        >
          <Image
            source={NATHIA_AVATAR}
            style={styles.centerTabAvatar}
            contentFit="cover"
            transition={200}
          />
        </LinearGradient>
      </Animated.View>

      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>NathIA</Text>
    </Pressable>
  );
});

NathIATabButton.displayName = "NathIATabButton";

// ============================================================================
// CUSTOM TAB BAR
// ============================================================================

/**
 * CustomTabBar - Tab bar premium com glassmorphism e tab central elevada
 */
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  // Definição dos ícones para cada tab
  const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Home: "home-outline",
    Community: "people-outline",
    Assistant: "sparkles-outline", // NathIA - não usado diretamente
    MundoNath: "sparkles-outline",
    MyCare: "checkbox-outline",
  };

  return (
    <BlurView
      intensity={92}
      tint="light"
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = index === 2; // NathIA (Assistant)

        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Tab central (NathIA) - componente especial
        if (isCenter) {
          return <NathIATabButton key={route.key} focused={isFocused} onPress={handlePress} />;
        }

        // Tabs laterais - componente regular
        const label = (options.tabBarLabel as string) ?? route.name;
        const iconName = tabIcons[route.name] ?? "help-circle-outline";

        return (
          <TabButton
            key={route.key}
            label={label}
            icon={iconName}
            focused={isFocused}
            onPress={handlePress}
          />
        );
      })}
    </BlurView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Tab Bar Container
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: neutral[200],
    paddingTop: spacing.sm,
    height: Platform.OS === "ios" ? 88 : 72,
  },

  // Regular Tab Button
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
  },

  tabLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: neutral[600],
    marginTop: 2,
  },

  tabLabelActive: {
    color: brand.primary[500],
    fontFamily: "Manrope_600SemiBold",
  },

  // Center Tab (NathIA)
  centerTabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Elevado
  },

  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: brand.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  centerTabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
  },

  centerTabAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  centerTabGlow: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: brand.primary[500],
    top: -8,
  },
});

// ============================================================================
// MAIN TAB NAVIGATOR
// ============================================================================

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenWithBoundary}
        options={{
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Início - Tela principal do app",
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreenWithBoundary}
        options={{
          tabBarLabel: "MãesValente",
          tabBarAccessibilityLabel: "MãesValente - Comunidade moderada de apoio",
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={NathIAStackNavigator}
        options={{
          tabBarLabel: "NathIA",
          tabBarAccessibilityLabel: "NathIA - Assistente de inteligência artificial",
        }}
      />
      <Tab.Screen
        name="MundoNath"
        component={MundoScreenWithBoundary}
        options={{
          tabBarLabel: "Mundo Nath",
          tabBarAccessibilityLabel: "Mundo da Nath - Conteúdo exclusivo",
        }}
      />
      <Tab.Screen
        name="MyCare"
        component={HabitosScreenWithBoundary}
        options={{
          tabBarLabel: "Meus Cuidados",
          tabBarAccessibilityLabel: "Meus Cuidados - Bem-estar e rotinas",
        }}
      />
    </Tab.Navigator>
  );
}
