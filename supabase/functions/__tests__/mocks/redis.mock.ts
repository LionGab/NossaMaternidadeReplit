/**
 * Mock Upstash Redis for testing
 * Used by ai/ function for rate limiting
 */

// Jest is available globally in test environment

export function createMockRedis() {
  // In-memory store for mock Redis
  const store = new Map<string, { value: string; ttl: number }>();

  return {
    get: jest.fn(async (key: string) => {
      const item = store.get(key);
      if (!item) return null;
      if (item.ttl < Date.now()) {
        store.delete(key);
        return null;
      }
      return item.value;
    }),

    set: jest.fn(async (key: string, value: string) => {
      store.set(key, { value, ttl: Date.now() + 3600000 });
      return "OK";
    }),

    setex: jest.fn(async (key: string, seconds: number, value: string) => {
      store.set(key, { value, ttl: Date.now() + seconds * 1000 });
      return "OK";
    }),

    incr: jest.fn(async (key: string) => {
      const item = store.get(key);
      const currentValue = item ? parseInt(item.value) : 0;
      const newValue = currentValue + 1;
      store.set(key, { value: newValue.toString(), ttl: item?.ttl || Date.now() + 3600000 });
      return newValue;
    }),

    incrby: jest.fn(async (key: string, increment: number) => {
      const item = store.get(key);
      const currentValue = item ? parseInt(item.value) : 0;
      const newValue = currentValue + increment;
      store.set(key, { value: newValue.toString(), ttl: item?.ttl || Date.now() + 3600000 });
      return newValue;
    }),

    ttl: jest.fn(async (key: string) => {
      const item = store.get(key);
      if (!item) return -2; // Key doesn't exist
      const remainingMs = item.ttl - Date.now();
      return remainingMs > 0 ? Math.floor(remainingMs / 1000) : -1;
    }),

    del: jest.fn(async (key: string) => {
      return store.delete(key) ? 1 : 0;
    }),

    pipeline: jest.fn(() => {
      const commands: Array<() => Promise<any>> = [];

      return {
        get: (key: string) => {
          commands.push(() => mockRedis.get(key));
          return mockPipeline;
        },
        ttl: (key: string) => {
          commands.push(() => mockRedis.ttl(key));
          return mockPipeline;
        },
        setex: (key: string, seconds: number, value: string) => {
          commands.push(() => mockRedis.setex(key, seconds, value));
          return mockPipeline;
        },
        incr: (key: string) => {
          commands.push(() => mockRedis.incr(key));
          return mockPipeline;
        },
        incrby: (key: string, increment: number) => {
          commands.push(() => mockRedis.incrby(key, increment));
          return mockPipeline;
        },
        exec: async () => {
          return Promise.all(commands.map((cmd) => cmd()));
        },
      };
    }),

    // Helper to reset mock store
    _reset: () => {
      store.clear();
    },
  };
}

const mockRedis = createMockRedis();
const mockPipeline = {
  get: mockRedis.pipeline().get,
  ttl: mockRedis.pipeline().ttl,
  setex: mockRedis.pipeline().setex,
  incr: mockRedis.pipeline().incr,
  incrby: mockRedis.pipeline().incrby,
  exec: mockRedis.pipeline().exec,
};

export { mockRedis };

// Helper: Mock rate limit not exceeded
export function mockRateLimitOk() {
  const redis = createMockRedis();
  redis.get.mockResolvedValue("5"); // 5 requests (under 20 limit)
  return redis;
}

// Helper: Mock rate limit exceeded
export function mockRateLimitExceeded() {
  const redis = createMockRedis();
  redis.get.mockResolvedValue("25"); // 25 requests (over 20 limit)
  return redis;
}

// Helper: Mock Redis failure (fallback to in-memory)
export function mockRedisFailure() {
  const redis = createMockRedis();
  redis.get.mockRejectedValue(new Error("Redis connection failed"));
  return redis;
}
