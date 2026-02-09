/**
 * Mock Supabase client for testing
 * Provides chainable query builder interface
 */

// Jest is available globally in test environment

export function createMockSupabaseClient() {
  // Mock query builder chain
  const mockSingleResult = jest.fn();
  const mockMaybeResult = jest.fn();

  const mockEq = jest.fn(() => Promise.resolve({ data: null, error: null }));

  const mockSelect = jest.fn(() => ({
    eq: jest.fn(() => ({ single: mockSingleResult, maybeSingle: mockMaybeResult })),
    single: mockSingleResult,
    maybeSingle: mockMaybeResult,
  }));

  const mockInsert = jest.fn(() => ({
    select: mockSelect,
  }));

  const mockUpdate = jest.fn(() => ({
    eq: mockEq,
    select: mockSelect,
  }));

  const mockDelete = jest.fn(() => ({
    eq: mockEq,
  }));

  const mockFrom = jest.fn((table: string) => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  }));

  // Mock RPC calls
  const mockRpc = jest.fn();

  // Mock auth
  const mockAuth = {
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  };

  // Mock storage
  const mockStorage = {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(),
      download: jest.fn(),
      getPublicUrl: jest.fn(),
      remove: jest.fn(),
    })),
  };

  return {
    from: mockFrom,
    rpc: mockRpc,
    auth: mockAuth,
    storage: mockStorage,
    // Helper to set mock responses
    _setMockResponse: (data: any, error: any = null) => {
      mockSingleResult.mockResolvedValue({ data, error });
      mockMaybeResult.mockResolvedValue({ data, error });
    },
  };
}

// Mock createClient function
export const mockCreateClient = jest.fn(() => createMockSupabaseClient());

// Helper to mock Supabase auth JWT validation
export function mockSupabaseAuthSuccess(userId = "test-user-id") {
  const mockClient = createMockSupabaseClient();
  mockClient.auth.getUser.mockResolvedValue({
    data: {
      user: {
        id: userId,
        email: "test@example.com",
        aud: "authenticated",
        role: "authenticated",
      },
    },
    error: null,
  });
  return mockClient;
}

export function mockSupabaseAuthFailure() {
  const mockClient = createMockSupabaseClient();
  mockClient.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: "Invalid JWT", status: 401 },
  });
  return mockClient;
}
