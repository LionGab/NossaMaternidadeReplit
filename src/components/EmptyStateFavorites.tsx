/**
 * EmptyStateFavorites - Empty state para lista de favoritos
 *
 * Exibido quando usuário não tem itens favoritados.
 * Inclui dica de como favoritar conteúdos.
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { semantic } from "../theme/tokens";
import { cn } from "../utils/cn";

export const EmptyStateFavorites: React.FC = () => {
  const { isDark, brand } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 pb-20">
      {/* Icon Container */}
      <Animated.View
        entering={FadeIn.delay(100).duration(400)}
        className={cn(
          "w-[120px] h-[120px] rounded-full items-center justify-center mb-6",
          isDark ? "bg-primary-900" : "bg-primary-50"
        )}
      >
        <Ionicons
          name="heart-outline"
          size={64}
          color={isDark ? brand.primary[300] : brand.primary[300]}
        />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInUp.delay(200).duration(400)}
        className={cn(
          "text-xl font-bold text-center mb-3",
          isDark ? "text-neutral-100" : "text-neutral-800"
        )}
      >
        Seus favoritos aparecerão aqui
      </Animated.Text>

      {/* Description */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(400)}
        className="flex-row flex-wrap items-center justify-center mb-6"
      >
        <Text
          className={cn(
            "text-[15px] leading-[22px] text-center",
            isDark ? "text-neutral-400" : "text-neutral-500"
          )}
        >
          Toque no ícone de coração{" "}
        </Text>
        <Ionicons
          name="heart-outline"
          size={16}
          color={isDark ? brand.primary[400] : brand.primary[500]}
        />
        <Text
          className={cn(
            "text-[15px] leading-[22px] text-center",
            isDark ? "text-neutral-400" : "text-neutral-500"
          )}
        >
          {" "}
          em qualquer conteúdo para salvá-lo e acessar rapidamente depois.
        </Text>
      </Animated.View>

      {/* Tip Container */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        className={cn(
          "flex-row items-start p-4 rounded-xl gap-3",
          isDark ? "bg-warning-900/30" : "bg-warning-50"
        )}
      >
        <Ionicons
          name="bulb-outline"
          size={20}
          color={isDark ? semantic.dark.warning : semantic.light.warning}
        />
        <Text
          className={cn(
            "flex-1 text-sm leading-5",
            isDark ? "text-warning-300" : "text-warning-700"
          )}
        >
          Dica: Favorite dicas da NathIA, posts da comunidade ou artigos que você quer reler!
        </Text>
      </Animated.View>
    </View>
  );
};

export default EmptyStateFavorites;
