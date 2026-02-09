/**
 * Logger centralizado premium para o app
 * - Dev: console.log/error com formatação bonita (ANSI colors + emojis)
 * - Prod: Sentry breadcrumbs + error capture
 *
 * Features:
 * - Cores ANSI no terminal Node.js
 * - Emojis no React Native
 * - Timestamps formatados
 * - Metadata formatado
 * - Visual premium e organizado
 */

import * as Sentry from "@sentry/react-native";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

/**
 * ANSI color codes para terminal
 */
const ANSI = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  // Colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  // Backgrounds
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
} as const;

/**
 * Emojis para React Native (não suporta ANSI)
 */
const EMOJIS = {
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  debug: "🔍",
  success: "✅",
} as const;

/**
 * Configuração de cores por nível
 */
const LEVEL_CONFIG = {
  info: {
    ansi: `${ANSI.cyan}${ANSI.bright}`,
    emoji: EMOJIS.info,
    label: "INFO",
  },
  warn: {
    ansi: `${ANSI.yellow}${ANSI.bright}`,
    emoji: EMOJIS.warn,
    label: "WARN",
  },
  error: {
    ansi: `${ANSI.red}${ANSI.bright}`,
    emoji: EMOJIS.error,
    label: "ERROR",
  },
  debug: {
    ansi: `${ANSI.magenta}${ANSI.dim}`,
    emoji: EMOJIS.debug,
    label: "DEBUG",
  },
} as const;

class Logger {
  private isDevelopment = __DEV__;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;
  private isNodeJS =
    typeof process !== "undefined" &&
    process.versions !== undefined &&
    process.versions.node !== undefined;
  private supportsANSI =
    this.isNodeJS && typeof process.stdout !== "undefined" && process.stdout.isTTY === true;
  private initialized = false;

  /**
   * Exibe banner de inicialização premium
   */
  private initialize(): void {
    if (this.initialized || !this.isDevelopment) return;
    this.initialized = true;

    if (this.supportsANSI) {
      const banner = `
${ANSI.cyan}${ANSI.bright}╔═══════════════════════════════════════════════════════════╗${ANSI.reset}
${ANSI.cyan}${ANSI.bright}║${ANSI.reset}     ${ANSI.magenta}${ANSI.bright}✨ Nossa Maternidade Logger Premium ✨${ANSI.reset}     ${ANSI.cyan}${ANSI.bright}║${ANSI.reset}
${ANSI.cyan}${ANSI.bright}║${ANSI.reset}     ${ANSI.dim}Formatação ANSI + Emojis | Timestamps precisos${ANSI.reset}     ${ANSI.cyan}${ANSI.bright}║${ANSI.reset}
${ANSI.cyan}${ANSI.bright}╚═══════════════════════════════════════════════════════════╝${ANSI.reset}
`;
      // eslint-disable-next-line no-console -- Banner inicial
      console.log(banner);
    } else {
      // eslint-disable-next-line no-console -- Banner inicial
      console.log("✨ Nossa Maternidade Logger Premium ✨");
      // eslint-disable-next-line no-console -- Banner inicial
      console.log("   Formatação com Emojis | Timestamps precisos");
    }
  }

  /**
   * Formata timestamp de forma bonita
   */
  private formatTimestamp(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ms = now.getMilliseconds().toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * Formata metadata de forma legível
   */
  private formatMetadata(metadata?: Record<string, unknown>): string {
    if (!metadata || Object.keys(metadata).length === 0) {
      return "";
    }

    const entries = Object.entries(metadata)
      .map(([key, value]) => {
        const formattedValue =
          typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
        return `  ${key}: ${formattedValue}`;
      })
      .join("\n");

    return this.supportsANSI
      ? `\n${ANSI.dim}${ANSI.white}└─ Metadata:${ANSI.reset}\n${ANSI.dim}${entries}${ANSI.reset}`
      : `\n└─ Metadata:\n${entries}`;
  }

  /**
   * Formata mensagem premium com cores/emojis
   */
  private formatPremiumMessage(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, unknown>
  ): string {
    const config = LEVEL_CONFIG[level];
    const timestamp = this.formatTimestamp();
    const contextStr = context ? ` ${context}` : "";
    const metadataStr = this.formatMetadata(metadata);

    if (this.supportsANSI) {
      // Terminal com cores ANSI - visual premium
      const separator = `${ANSI.dim}${ANSI.white}│${ANSI.reset}`;
      const badge = `${config.ansi}▶ ${config.label}${ANSI.reset}`;
      const header = `${badge} ${ANSI.dim}${timestamp}${ANSI.reset}${contextStr ? ` ${ANSI.cyan}${ANSI.bright}[${context}]${ANSI.reset}` : ""}`;
      const body = `${separator} ${ANSI.white}${message}${ANSI.reset}`;
      return `${header}\n${body}${metadataStr}`;
    } else {
      // React Native com emojis - visual premium
      const header = `${config.emoji} ${config.label} ${timestamp}${contextStr ? ` [${context}]` : ""}`;
      const body = `   ${message}`;
      return `${header}\n${body}${metadataStr}`;
    }
  }

  /**
   * Formata erro de forma premium
   */
  private formatError(error: Error): string {
    if (!error) return "";

    const errorName = error.name || "Error";
    const errorMessage = error.message || "";
    const stack = error.stack || "";

    if (this.supportsANSI) {
      return `\n${ANSI.red}${ANSI.bright}└─ ${errorName}:${ANSI.reset} ${ANSI.red}${errorMessage}${ANSI.reset}\n${ANSI.dim}${stack}${ANSI.reset}`;
    } else {
      return `\n└─ ${errorName}: ${errorMessage}\n${stack}`;
    }
  }

  private addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    // Inicializar banner na primeira chamada
    if (!this.initialized) {
      this.initialize();
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      metadata,
    };

    this.addToHistory(entry);

    if (this.isDevelopment) {
      // Dev: console output premium
      const formattedMessage = this.formatPremiumMessage(level, message, context, metadata);
      const errorFormatted = error ? this.formatError(error) : "";

      switch (level) {
        case "info":
          // eslint-disable-next-line no-console -- Logger central
          console.log(formattedMessage + errorFormatted);
          break;
        case "warn":
          console.warn(formattedMessage + errorFormatted);
          break;
        case "error":
          console.error(formattedMessage + errorFormatted);
          break;
        case "debug":
          // eslint-disable-next-line no-console -- Logger central
          console.debug(formattedMessage + errorFormatted);
          break;
      }
    } else {
      // Prod: Sentry breadcrumbs + error capture
      const formattedMessage = context ? `[${context}] ${message}` : message;
      Sentry.addBreadcrumb({
        category: context || "app",
        message: formattedMessage,
        level: level === "debug" ? "info" : level === "warn" ? "warning" : level,
        data: metadata,
      });

      // Capturar erros no Sentry
      if (level === "error" && error) {
        Sentry.captureException(error, {
          tags: { context: context || "unknown" },
          extra: metadata,
        });
      }
    }
  }

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, context, undefined, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, context, undefined, metadata);
  }

  error(
    message: string,
    context?: string,
    error?: Error,
    metadata?: Record<string, unknown>
  ): void {
    this.log("error", message, context, error, metadata);
  }

  debug(message: string, context?: string, metadata?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.log("debug", message, context, undefined, metadata);
    }
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

export const logger = new Logger();
