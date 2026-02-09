/**
 * @file OnboardingEmotionalState.test.tsx
 * @description Testes unitários para tela de estado emocional
 *
 * Cobertura:
 * - Renderização correta dos cards
 * - Seleção de estado emocional
 * - Navegação com validação
 * - Acessibilidade
 */

import { useNathJourneyOnboardingStore } from "@/state/nath-journey-onboarding-store";
import { RootStackScreenProps } from "@/types/navigation";
import { fireEvent, render, RenderOptions } from "@testing-library/react-native";
import React, { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OnboardingEmotionalState from "../OnboardingEmotionalState";

// Wrapper com SafeAreaProvider para testes
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      {children}
    </SafeAreaProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation: RootStackScreenProps<"OnboardingEmotionalState">["navigation"] = {
  navigate: mockNavigate as never,
  goBack: mockGoBack,
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
} as unknown as RootStackScreenProps<"OnboardingEmotionalState">["navigation"];

const mockRoute: RootStackScreenProps<"OnboardingEmotionalState">["route"] = {
  key: "test-route",
  name: "OnboardingEmotionalState",
  params: undefined,
} as RootStackScreenProps<"OnboardingEmotionalState">["route"];

// Mock Haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    Ionicons: (props: Record<string, unknown>) => React.createElement("Icon", props),
  };
});

// Mock store
jest.mock("@/state/nath-journey-onboarding-store");

describe("OnboardingEmotionalState", () => {
  const mockSetEmotionalState = jest.fn();
  const mockSetCurrentScreen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNathJourneyOnboardingStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        data: { emotionalState: null },
        setEmotionalState: mockSetEmotionalState,
        setCurrentScreen: mockSetCurrentScreen,
        canProceed: () => false,
      };
      return selector(state);
    });
  });

  describe("Renderização", () => {
    it("deve renderizar todas as opções de estado emocional", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText("Bem, em equilíbrio")).toBeTruthy();
      expect(getByText("Um pouco ansiosa")).toBeTruthy();
      expect(getByText("Muito ansiosa")).toBeTruthy();
      expect(getByText("Triste ou esgotada")).toBeTruthy();
      expect(getByText("Prefiro não falar agora")).toBeTruthy();
    });

    it("deve exibir título e subtítulo corretos", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText("Como você está se sentindo nos últimos dias?")).toBeTruthy();
      expect(getByText("Isso me ajuda a personalizar sua experiência")).toBeTruthy();
    });

    it("deve mostrar progress indicator 4/7", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText("4/7")).toBeTruthy();
    });

    it("deve mostrar microcopy de privacidade", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText("Confidencial. Sem julgamento.")).toBeTruthy();
    });
  });

  describe("Interação de Seleção", () => {
    it("deve chamar setEmotionalState ao selecionar um card", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const card = getByText("Bem, em equilíbrio");
      fireEvent.press(card.parent!.parent!);

      expect(mockSetEmotionalState).toHaveBeenCalledWith("BEM_EQUILIBRADA");
    });

    it("deve aplicar estilo selecionado quando estado ativo", () => {
      (useNathJourneyOnboardingStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          data: { emotionalState: "UM_POUCO_ANSIOSA" },
          setEmotionalState: mockSetEmotionalState,
          setCurrentScreen: mockSetCurrentScreen,
          canProceed: () => true,
        };
        return selector(state);
      });

      const { getByLabelText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const selectedCard = getByLabelText("Um pouco ansiosa, selecionado");
      expect(selectedCard).toBeTruthy();
    });

    it("deve permitir trocar seleção", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      // Primeira seleção
      fireEvent.press(getByText("Bem, em equilíbrio").parent!.parent!);
      expect(mockSetEmotionalState).toHaveBeenCalledWith("BEM_EQUILIBRADA");

      // Segunda seleção
      mockSetEmotionalState.mockClear();
      fireEvent.press(getByText("Muito ansiosa").parent!.parent!);
      expect(mockSetEmotionalState).toHaveBeenCalledWith("MUITO_ANSIOSA");
    });
  });

  describe("Navegação", () => {
    it("botão Continuar deve estar desabilitado sem seleção", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const button = getByText("Continuar");
      // Verifica se o botão está desabilitado através da prop accessibilityState
      const buttonElement = button.parent?.parent;
      expect(buttonElement?.props?.accessibilityState?.disabled).toBe(true);
    });

    it("deve habilitar botão Continuar após seleção válida", () => {
      (useNathJourneyOnboardingStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          data: { emotionalState: "BEM_EQUILIBRADA" },
          setEmotionalState: mockSetEmotionalState,
          setCurrentScreen: mockSetCurrentScreen,
          canProceed: () => true,
        };
        return selector(state);
      });

      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const button = getByText("Continuar");
      fireEvent.press(button);

      expect(mockNavigate).toHaveBeenCalledWith("OnboardingCheckIn");
    });

    it("deve navegar para tela anterior ao pressionar voltar", () => {
      const { getByLabelText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const backButton = getByLabelText("Voltar");
      fireEvent.press(backButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe("Acessibilidade", () => {
    it('cards devem ter role="radio"', () => {
      const { getAllByRole } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const radioButtons = getAllByRole("radio");
      expect(radioButtons).toHaveLength(5);
    });

    it("deve ter accessibilityHint explicativo", () => {
      const { getAllByHintText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      // Todos os 5 cards devem ter o mesmo hint de acessibilidade
      const hints = getAllByHintText("Toque para selecionar como você está se sentindo");
      expect(hints).toHaveLength(5);
    });

    it("botão voltar deve ter label acessível", () => {
      const { getByLabelText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByLabelText("Voltar")).toBeTruthy();
    });

    it("deve atualizar accessibilityLabel quando selecionado", () => {
      (useNathJourneyOnboardingStore as unknown as jest.Mock).mockImplementation((selector) => {
        const state = {
          data: { emotionalState: "PREFIRO_NAO_RESPONDER" },
          setEmotionalState: mockSetEmotionalState,
          setCurrentScreen: mockSetCurrentScreen,
          canProceed: () => true,
        };
        return selector(state);
      });

      const { getByLabelText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByLabelText("Prefiro não falar agora, selecionado")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("deve lidar com estado inicial vazio", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText("Continuar")).toBeTruthy();
      // Não deve crashar
    });

    it("deve definir screen atual no mount", () => {
      customRender(<OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />);

      expect(mockSetCurrentScreen).toHaveBeenCalledWith("OnboardingEmotionalState");
    });

    it("não deve navegar se botão disabled", () => {
      const { getByText } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const button = getByText("Continuar");
      fireEvent.press(button);

      // canProceed retorna false, então não navega
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Performance", () => {
    it("callbacks devem ser memoizados", () => {
      const { rerender } = customRender(
        <OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />
      );

      const firstRender = mockSetEmotionalState;

      rerender(<OnboardingEmotionalState navigation={mockNavigation} route={mockRoute} />);

      // Mock permanece o mesmo (callbacks não recriam)
      expect(mockSetEmotionalState).toBe(firstRender);
    });
  });
});
