/**
 * Testes para useAuth hook
 * Valida autenticação centralizada com Supabase
 */

import { renderHook, act, waitFor } from "@testing-library/react-native";

// Mock logger
jest.mock("@/utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock expo utils
jest.mock("@/utils/expo", () => ({
  isExpoGo: jest.fn(() => true),
}));

// Mocks para supabase e APIs
const mockUnsubscribe = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn(() => ({
  data: {
    subscription: {
      unsubscribe: mockUnsubscribe,
    },
  },
}));

jest.mock("@/api/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (_callback: unknown) => mockOnAuthStateChange(),
    },
  },
}));

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();

jest.mock("@/api/auth", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signUp: (...args: unknown[]) => mockSignUp(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

const mockSignInWithGoogle = jest.fn();
const mockSignInWithApple = jest.fn();

jest.mock("@/api/social-auth", () => ({
  signInWithGoogle: () => mockSignInWithGoogle(),
  signInWithApple: () => mockSignInWithApple(),
}));

// Import depois dos mocks
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    user_metadata: {
      name: "Test User",
    },
  };

  const mockSession = {
    user: mockUser,
    access_token: "token-123",
    expires_at: Date.now() + 3600000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default: sem sessão
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
  });

  describe("Inicialização", () => {
    it("deve iniciar sem usuário autenticado", async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("deve carregar sessão existente", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
      });
      expect(result.current.session).toBe(mockSession);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("deve tratar erro ao carregar sessão", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: new Error("Session error"),
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("deve subscrever a mudanças de auth state", async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    it("deve desinscrever ao desmontar", async () => {
      const { result, unmount } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("signIn", () => {
    it("deve fazer login com sucesso", async () => {
      mockSignIn.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signInResult: { error: Error | null } | undefined;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "password123");
      });

      expect(signInResult?.error).toBeNull();
      expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
    });

    it("deve retornar erro em caso de falha", async () => {
      const error = new Error("Invalid credentials");
      mockSignIn.mockResolvedValue({ error });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signInResult: { error: Error | null } | undefined;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "wrong");
      });

      expect(signInResult?.error).toBe(error);
    });

    it("deve tratar exceção inesperada", async () => {
      mockSignIn.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signInResult: { error: Error | null } | undefined;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "password123");
      });

      expect(signInResult?.error).toBeInstanceOf(Error);
      expect(signInResult?.error?.message).toBe("Network error");
    });
  });

  describe("signUp", () => {
    it("deve cadastrar usuário com sucesso", async () => {
      mockSignUp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signUpResult: { error: Error | null } | undefined;
      await act(async () => {
        signUpResult = await result.current.signUp("new@example.com", "password123", "New User");
      });

      expect(signUpResult?.error).toBeNull();
      expect(mockSignUp).toHaveBeenCalledWith("new@example.com", "password123", "New User");
    });

    it("deve retornar erro em caso de falha", async () => {
      const error = new Error("Email already exists");
      mockSignUp.mockResolvedValue({ error });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signUpResult: { error: Error | null } | undefined;
      await act(async () => {
        signUpResult = await result.current.signUp("existing@example.com", "password123", "User");
      });

      expect(signUpResult?.error).toBe(error);
    });
  });

  describe("signOut", () => {
    it("deve fazer logout com sucesso", async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signOutResult: { error: Error | null } | undefined;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult?.error).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it("deve retornar erro em caso de falha", async () => {
      const error = new Error("Logout failed");
      mockSignOut.mockResolvedValue({ error });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let signOutResult: { error: Error | null } | undefined;
      await act(async () => {
        signOutResult = await result.current.signOut();
      });

      expect(signOutResult?.error).toBe(error);
    });
  });

  describe("signInWithGoogle", () => {
    it("deve fazer login com Google com sucesso", async () => {
      mockSignInWithGoogle.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let googleResult: { error: Error | null } | undefined;
      await act(async () => {
        googleResult = await result.current.signInWithGoogle();
      });

      expect(googleResult?.error).toBeNull();
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });

    it("deve retornar erro quando Google login falha", async () => {
      mockSignInWithGoogle.mockResolvedValue({
        success: false,
        error: "Google OAuth not configured",
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let googleResult: { error: Error | null } | undefined;
      await act(async () => {
        googleResult = await result.current.signInWithGoogle();
      });

      expect(googleResult?.error).toBeInstanceOf(Error);
      expect(googleResult?.error?.message).toBe("Google OAuth not configured");
    });

    it("deve tratar exceção inesperada", async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let googleResult: { error: Error | null } | undefined;
      await act(async () => {
        googleResult = await result.current.signInWithGoogle();
      });

      expect(googleResult?.error?.message).toBe("Network error");
    });
  });

  describe("signInWithApple", () => {
    it("deve fazer login com Apple com sucesso", async () => {
      mockSignInWithApple.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let appleResult: { error: Error | null } | undefined;
      await act(async () => {
        appleResult = await result.current.signInWithApple();
      });

      expect(appleResult?.error).toBeNull();
      expect(mockSignInWithApple).toHaveBeenCalled();
    });

    it("deve retornar erro quando Apple login falha", async () => {
      mockSignInWithApple.mockResolvedValue({
        success: false,
        error: "Apple Sign In cancelled",
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let appleResult: { error: Error | null } | undefined;
      await act(async () => {
        appleResult = await result.current.signInWithApple();
      });

      expect(appleResult?.error?.message).toBe("Apple Sign In cancelled");
    });
  });

  describe("refresh", () => {
    it("deve atualizar estado de autenticação", async () => {
      // Começa sem sessão
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);

      // Agora tem sessão
      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe("test@example.com");
    });
  });

  describe("mapUser", () => {
    it("deve mapear user_metadata.name corretamente", async () => {
      const userWithName = {
        ...mockUser,
        user_metadata: { name: "John Doe" },
      };

      mockGetSession.mockResolvedValue({
        data: { session: { ...mockSession, user: userWithName } },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user?.name).toBe("John Doe");
    });

    it("deve mapear user_metadata.full_name como fallback", async () => {
      const userWithFullName = {
        ...mockUser,
        user_metadata: { full_name: "Jane Doe" },
      };

      mockGetSession.mockResolvedValue({
        data: { session: { ...mockSession, user: userWithFullName } },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user?.name).toBe("Jane Doe");
    });

    it("deve tratar email vazio", async () => {
      const userWithoutEmail = {
        ...mockUser,
        email: undefined,
      };

      mockGetSession.mockResolvedValue({
        data: { session: { ...mockSession, user: userWithoutEmail } },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user?.email).toBe("");
    });
  });

  describe("isAuthenticated", () => {
    it("deve ser true quando user e session existem", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it("deve ser false quando user é null", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
