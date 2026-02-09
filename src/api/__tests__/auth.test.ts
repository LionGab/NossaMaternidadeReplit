/**
 * Tests for authentication service
 *
 * @module api/__tests__/auth.test
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { signUp, signIn, signOut, getCurrentUser, getSession } from "../auth";

// Mock Supabase client
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();
const mockGetSession = jest.fn();

jest.mock("../supabase", () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
      signInWithPassword: (...args: unknown[]) => mockSignIn(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getUser: (...args: unknown[]) => mockGetUser(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
  Database: {},
}));

// Mock logger
jest.mock("../../utils/logger", () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock RevenueCat service
jest.mock("../../services/revenuecat", () => ({
  loginUser: jest.fn<() => Promise<void>>().mockResolvedValue(undefined as never),
  logoutUser: jest.fn<() => Promise<void>>().mockResolvedValue(undefined as never),
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should successfully sign up a new user", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };

      mockSignUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as never);

      // Senha forte válida para passar validação Zod
      const result = await signUp("test@example.com", "Senha123!", "Test User");

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Senha123!",
        options: {
          data: {
            name: "Test User",
          },
        },
      });
    });

    it("should handle sign up errors", async () => {
      const mockError = { message: "Email already exists" };
      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: mockError,
      } as never);

      // Senha forte para passar validação Zod
      const result = await signUp("test@example.com", "Senha123!", "Test User");

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("signIn", () => {
    it("should successfully sign in with email and password", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };
      const mockSession = {
        access_token: "token-123",
        user: mockUser,
      };

      mockSignIn.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      } as never);

      const result = await signIn("test@example.com", "password123");

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it("should handle sign in errors", async () => {
      const mockError = { message: "Invalid credentials" };
      mockSignIn.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      } as never);

      const result = await signIn("test@example.com", "wrong-password");

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("signOut", () => {
    it("should successfully sign out", async () => {
      mockSignOut.mockResolvedValue({ error: null } as never);

      const result = await signOut();

      expect(result.error).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it("should handle sign out errors", async () => {
      const mockError = { message: "Sign out failed" };
      mockSignOut.mockResolvedValue({ error: mockError } as never);

      const result = await signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
      };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as never);

      const result = await getCurrentUser();

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it("should handle errors when getting user", async () => {
      const mockError = { message: "Not authenticated" };
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      } as never);

      const result = await getCurrentUser();

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe("getSession", () => {
    it("should return current session", async () => {
      const mockSession = {
        access_token: "token-123",
        user: { id: "user-123" },
      };

      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as never);

      const result = await getSession();

      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it("should handle errors when getting session", async () => {
      const mockError = { message: "No session" };
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      } as never);

      const result = await getSession();

      expect(result.session).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });
});
