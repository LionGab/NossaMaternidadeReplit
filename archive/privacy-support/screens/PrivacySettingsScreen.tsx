import React from "react";
import { View, Text, Switch, Pressable } from "react-native";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { FloCard } from "@/components/ui/FloCard";
import { usePreferencesStore } from "@/state/usePreferencesStore";

function PrivacySettingsScreen() {
  const {
    aiOptIn,
    ttsEnabled,
    analyticsOptIn,
    communityAnonymousDefault,
    healthSyncOptIn,
    setAiOptIn,
    setTtsEnabled,
    setAnalyticsOptIn,
    setCommunityAnonymousDefault,
    setHealthSyncOptIn,
  } = usePreferencesStore();

  return (
    <GradientBackground variant="flo">
      <View className="px-4 pt-4 pb-10 gap-4">
        <Text className="text-xl font-bold text-neutral-900">Privacidade e Preferências</Text>

        <FloCard className="gap-3">
          <Text className="text-base font-semibold text-neutral-900">NathIA (IA)</Text>
          <Text className="text-sm text-neutral-700">
            A NathIA só envia dados para processamento quando você permitir. Você pode mudar isso a
            qualquer momento.
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-900">Ativar IA</Text>
            <Switch
              value={aiOptIn}
              onValueChange={setAiOptIn}
              accessibilityRole="switch"
              accessibilityLabel="Ativar processamento de IA"
              accessibilityHint="Permite que a NathIA processe mensagens e anexos"
            />
          </View>

          {!aiOptIn ? (
            <View className="mt-2 rounded-xl bg-white/60 p-3">
              <Text className="text-sm text-neutral-800">
                IA desativada: a NathIA ficará limitada a respostas locais e orientações gerais.
              </Text>
            </View>
          ) : null}
        </FloCard>

        <FloCard className="gap-3">
          <Text className="text-base font-semibold text-neutral-900">Voz</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-900">Ler respostas (TTS)</Text>
            <Switch
              value={ttsEnabled}
              onValueChange={setTtsEnabled}
              accessibilityRole="switch"
              accessibilityLabel="Ler respostas em voz alta"
              accessibilityHint="Ativa leitura das respostas da NathIA"
            />
          </View>
        </FloCard>

        <FloCard className="gap-3">
          <Text className="text-base font-semibold text-neutral-900">Comunidade</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-900">Anonimato por padrão</Text>
            <Switch
              value={communityAnonymousDefault}
              onValueChange={setCommunityAnonymousDefault}
              accessibilityRole="switch"
              accessibilityLabel="Anonimato por padrão na comunidade"
              accessibilityHint="Publicações novas começam como anônimas por padrão"
            />
          </View>
        </FloCard>

        <FloCard className="gap-3">
          <Text className="text-base font-semibold text-neutral-900">Saúde e Wearables</Text>
          <Text className="text-sm text-neutral-700">
            Esses recursos serão oferecidos gradualmente e exigem permissão explícita.
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-900">Permitir sincronização</Text>
            <Switch
              value={healthSyncOptIn}
              onValueChange={setHealthSyncOptIn}
              accessibilityRole="switch"
              accessibilityLabel="Permitir sincronização de saúde e wearables"
            />
          </View>
        </FloCard>

        <FloCard className="gap-3">
          <Text className="text-base font-semibold text-neutral-900">Analytics</Text>
          <Text className="text-sm text-neutral-700">
            Coleta anônima e opcional para melhorar o app (opt-in).
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-900">Permitir analytics</Text>
            <Switch
              value={analyticsOptIn}
              onValueChange={setAnalyticsOptIn}
              accessibilityRole="switch"
              accessibilityLabel="Permitir analytics"
            />
          </View>
        </FloCard>

        <Pressable
          onPress={() => {
            // navegar para tela/rota de política se existir
          }}
          accessibilityRole="button"
          accessibilityLabel="Ver política de privacidade"
          className="py-3"
        >
          <Text className="text-sm font-semibold text-neutral-900 underline">
            Ver política de privacidade
          </Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}

export default PrivacySettingsScreen;
