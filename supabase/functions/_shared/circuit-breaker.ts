/**
 * Circuit Breaker Pattern
 *
 * Protege edge functions de cascade failures quando providers de IA estão instáveis.
 *
 * Estados:
 * - CLOSED: Normal, requisições passam
 * - OPEN: Provider instável, rejeita imediatamente (fail-fast)
 * - HALF_OPEN: Testando recuperação, permite N requisições
 *
 * @example
 * const geminiCircuit = new CircuitBreaker("gemini", {
 *   failureThreshold: 5,
 *   timeoutMs: 30_000,
 *   halfOpenMaxCalls: 3,
 * });
 *
 * const result = await geminiCircuit.execute(async () => {
 *   return await callGeminiAPI(messages);
 * });
 */

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerConfig {
  /**
   * Número de falhas consecutivas antes de abrir o circuito
   * @default 5
   */
  failureThreshold: number;

  /**
   * Tempo em ms que o circuito fica OPEN antes de tentar HALF_OPEN
   * @default 30000 (30 segundos)
   */
  timeoutMs: number;

  /**
   * Número máximo de chamadas permitidas em HALF_OPEN
   * @default 3
   */
  halfOpenMaxCalls: number;
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastStateChange: number;
  halfOpenAttempts: number;
}

/**
 * Circuit Breaker para proteção contra providers instáveis
 */
export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private lastStateChange: number = Date.now();
  private halfOpenAttempts = 0;

  constructor(
    private readonly name: string,
    private readonly config: CircuitBreakerConfig,
    private readonly logger?: {
      info: (event: string, data?: Record<string, unknown>) => void;
      warn: (event: string, data?: Record<string, unknown>) => void;
      error: (event: string, error: Error, data?: Record<string, unknown>) => void;
    }
  ) {}

  /**
   * Executa função com proteção de circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Se OPEN, verifica se deve tentar HALF_OPEN
    if (this.state === "OPEN") {
      const now = Date.now();
      const timeSinceLastFailure = this.lastFailureTime ? now - this.lastFailureTime : 0;

      if (timeSinceLastFailure >= this.config.timeoutMs) {
        this.transitionTo("HALF_OPEN");
      } else {
        // Ainda em OPEN, rejeita imediatamente
        const error = new Error(
          `Circuit breaker OPEN for ${this.name} (retry in ${Math.ceil((this.config.timeoutMs - timeSinceLastFailure) / 1000)}s)`
        );
        (error as Error & { code: string }).code = "CIRCUIT_OPEN";
        throw error;
      }
    }

    // Se HALF_OPEN, verifica se atingiu limite de tentativas
    if (this.state === "HALF_OPEN") {
      if (this.halfOpenAttempts >= this.config.halfOpenMaxCalls) {
        // Já tentou demais em HALF_OPEN, volta para OPEN
        this.transitionTo("OPEN");
        const error = new Error(`Circuit breaker HALF_OPEN limit reached for ${this.name}`);
        (error as Error & { code: string }).code = "CIRCUIT_HALF_OPEN_LIMIT";
        throw error;
      }
      this.halfOpenAttempts++;
    }

    // Executa função
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Chamado quando execução é bem-sucedida
   */
  private onSuccess(): void {
    this.successCount++;

    if (this.state === "HALF_OPEN") {
      // Sucesso em HALF_OPEN → volta para CLOSED
      this.logger?.info("circuit_breaker_recovered", {
        provider: this.name,
        previousState: this.state,
        successCount: this.successCount,
        failureCount: this.failureCount,
      });
      this.transitionTo("CLOSED");
    } else if (this.state === "CLOSED") {
      // Sucesso em CLOSED → reseta contador de falhas
      this.failureCount = 0;
    }
  }

  /**
   * Chamado quando execução falha
   */
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === "HALF_OPEN") {
      // Falha em HALF_OPEN → volta para OPEN
      this.logger?.warn("circuit_breaker_half_open_failed", {
        provider: this.name,
        failureCount: this.failureCount,
      });
      this.transitionTo("OPEN");
    } else if (this.state === "CLOSED" && this.failureCount >= this.config.failureThreshold) {
      // Atingiu threshold em CLOSED → abre circuito
      this.logger?.warn("circuit_breaker_opened", {
        provider: this.name,
        failureCount: this.failureCount,
        threshold: this.config.failureThreshold,
        timeoutMs: this.config.timeoutMs,
      });
      this.transitionTo("OPEN");
    }
  }

  /**
   * Transiciona para novo estado
   */
  private transitionTo(newState: CircuitState): void {
    const oldState = this.state;
    this.state = newState;
    this.lastStateChange = Date.now();

    // Reset contadores baseado no estado
    if (newState === "CLOSED") {
      this.failureCount = 0;
      this.halfOpenAttempts = 0;
    } else if (newState === "HALF_OPEN") {
      this.halfOpenAttempts = 0;
    }

    // Log mudança de estado (exceto se for de CLOSED para CLOSED)
    if (oldState !== newState) {
      this.logger?.info("circuit_breaker_state_change", {
        provider: this.name,
        oldState,
        newState,
        failureCount: this.failureCount,
        successCount: this.successCount,
      });
    }
  }

  /**
   * Retorna estatísticas atuais do circuit breaker
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastStateChange: this.lastStateChange,
      halfOpenAttempts: this.halfOpenAttempts,
    };
  }

  /**
   * Reseta o circuit breaker para estado inicial
   * Útil para testes ou após manutenção manual
   */
  reset(): void {
    this.logger?.info("circuit_breaker_reset", {
      provider: this.name,
      previousState: this.state,
    });

    this.state = "CLOSED";
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
    this.lastStateChange = Date.now();
    this.halfOpenAttempts = 0;
  }

  /**
   * Retorna se o circuito está disponível para chamadas
   */
  isAvailable(): boolean {
    if (this.state === "CLOSED") {
      return true;
    }

    if (this.state === "HALF_OPEN") {
      return this.halfOpenAttempts < this.config.halfOpenMaxCalls;
    }

    // OPEN - verifica se deve tentar HALF_OPEN
    if (this.state === "OPEN" && this.lastFailureTime) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      return timeSinceLastFailure >= this.config.timeoutMs;
    }

    return false;
  }
}
