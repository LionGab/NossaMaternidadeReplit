/**
 * Rate Limiter simples para proteger APIs
 * Previne spam e controla custos
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  requests: number[];
}

class RateLimiter {
  private limits: Map<string, RateLimitState> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    // Configurações padrão
    this.configs.set("nathia", {
      maxRequests: 20, // 20 mensagens
      windowMs: 60 * 1000, // por minuto
    });

    this.configs.set("nathia-burst", {
      maxRequests: 5, // 5 mensagens
      windowMs: 10 * 1000, // em 10 segundos (anti-spam)
    });
  }

  /**
   * Verificar se request pode prosseguir
   * @returns true se permitido, false se bloqueado
   */
  canProceed(key: string): boolean {
    const config = this.configs.get(key);
    if (!config) return true;

    const now = Date.now();
    let state = this.limits.get(key);

    if (!state) {
      state = { requests: [] };
      this.limits.set(key, state);
    }

    // Limpar requests antigos (fora da janela)
    state.requests = state.requests.filter((timestamp) => now - timestamp < config.windowMs);

    // Verificar limite
    if (state.requests.length >= config.maxRequests) {
      return false;
    }

    // Registrar request
    state.requests.push(now);
    return true;
  }

  /**
   * Tempo até poder fazer próximo request (em ms)
   */
  getTimeUntilReset(key: string): number {
    const config = this.configs.get(key);
    const state = this.limits.get(key);

    if (!config || !state || state.requests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...state.requests);
    const resetTime = oldestRequest + config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  /**
   * Alias (compatibilidade): tempo até reset (em ms)
   */
  getResetTime(key: string): number {
    return this.getTimeUntilReset(key);
  }

  /**
   * Requests restantes na janela atual
   */
  getRemainingRequests(key: string): number | undefined {
    const config = this.configs.get(key);
    const state = this.limits.get(key);

    if (!config) return undefined;
    if (!state) return config.maxRequests;

    const now = Date.now();
    const validRequests = state.requests.filter((timestamp) => now - timestamp < config.windowMs);

    return Math.max(0, config.maxRequests - validRequests.length);
  }

  /**
   * Permite sobrescrever/definir config (útil para testes e cenários customizados)
   */
  setConfig(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config);
    // Reset state para evitar mistura com janela/config anterior
    this.limits.delete(key);
  }

  /**
   * Reset manual (para testes ou admin)
   */
  reset(key: string): void {
    this.limits.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Hook para usar rate limiter em componentes
 */
export function useRateLimit(key: string) {
  return {
    canProceed: () => rateLimiter.canProceed(key),
    remaining: () => rateLimiter.getRemainingRequests(key),
    resetIn: () => rateLimiter.getTimeUntilReset(key),
    reset: () => rateLimiter.reset(key),
  };
}
