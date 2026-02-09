/**
 * Testes para Zustand stores
 * Valida state management crítico usando Zustand API diretamente
 */

import { useAppStore, useChatStore, useCycleStore } from "../store";

// Note: AsyncStorage is mocked in jest.setup.js

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store antes de cada teste
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
    });
  });

  it("deve inicializar com estado padrão", () => {
    const state = useAppStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isOnboardingComplete).toBe(false);
  });

  it("deve atualizar usuário e autenticação", () => {
    const mockUser = {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      stage: "pregnant" as const,
      interests: [],
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };

    useAppStore.getState().setUser(mockUser);
    useAppStore.getState().setAuthenticated(true);
    const state = useAppStore.getState();

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("deve marcar onboarding como completo", () => {
    useAppStore.getState().setOnboardingComplete(true);
    const state = useAppStore.getState();

    expect(state.isOnboardingComplete).toBe(true);
  });

  it("deve limpar estado no logout", () => {
    // Configurar estado inicial
    useAppStore.getState().setUser({
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      stage: "pregnant" as const,
      interests: [],
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    });
    useAppStore.getState().setAuthenticated(true);
    useAppStore.getState().setOnboardingComplete(true);

    // Fazer logout (clearUser)
    useAppStore.getState().clearUser();
    const state = useAppStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
    });
  });

  it("deve criar nova conversa", () => {
    const conversationId = useChatStore.getState().createConversation();
    const state = useChatStore.getState();

    expect(state.conversations).toHaveLength(1);
    expect(state.currentConversationId).toBe(conversationId);
    expect(state.conversations[0].messages).toEqual([]);
  });

  it("deve adicionar mensagem à conversa atual", () => {
    useChatStore.getState().createConversation();
    useChatStore.getState().addMessage({
      id: "msg-1",
      role: "user",
      content: "Olá, NathIA!",
      createdAt: new Date().toISOString(),
    });

    const state = useChatStore.getState();

    expect(state.conversations[0].messages).toHaveLength(1);
    expect(state.conversations[0].messages[0].content).toBe("Olá, NathIA!");
  });

  it("deve deletar conversa", () => {
    const conversationId = useChatStore.getState().createConversation();
    useChatStore.getState().addMessage({
      id: "msg-1",
      role: "user",
      content: "Test message",
      createdAt: new Date().toISOString(),
    });

    expect(useChatStore.getState().conversations).toHaveLength(1);

    useChatStore.getState().deleteConversation(conversationId);
    const state = useChatStore.getState();

    expect(state.conversations).toHaveLength(0);
    expect(state.currentConversationId).toBeNull();
  });

  it("deve alternar estado de loading", () => {
    expect(useChatStore.getState().isLoading).toBe(false);

    useChatStore.getState().setLoading(true);

    expect(useChatStore.getState().isLoading).toBe(true);
  });
});

describe("useCycleStore", () => {
  beforeEach(() => {
    useCycleStore.setState({
      lastPeriodStart: null,
      cycleLength: 28,
      periodLength: 5,
      dailyLogs: [],
    });
  });

  it("deve inicializar com configurações padrão", () => {
    const state = useCycleStore.getState();

    expect(state.cycleLength).toBe(28);
    expect(state.periodLength).toBe(5);
    expect(state.dailyLogs).toEqual([]);
  });

  it("deve atualizar data da última menstruação", () => {
    const testDate = "2025-01-01";

    useCycleStore.getState().setLastPeriodStart(testDate);
    const state = useCycleStore.getState();

    expect(state.lastPeriodStart).toBe(testDate);
  });

  it("deve adicionar log diário", () => {
    const mockLog = {
      id: "log-1",
      date: "2025-01-01",
      mood: ["bem"],
      symptoms: ["cólica"],
    };

    useCycleStore.getState().addDailyLog(mockLog);
    const state = useCycleStore.getState();

    expect(state.dailyLogs).toHaveLength(1);
    expect(state.dailyLogs[0]).toMatchObject(mockLog);
  });

  it("deve atualizar duração do ciclo", () => {
    useCycleStore.getState().setCycleLength(30);
    const state = useCycleStore.getState();

    expect(state.cycleLength).toBe(30);
  });
});
