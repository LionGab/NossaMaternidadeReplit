/**
 * Utility to add timeout to any Promise
 *
 * Usage:
 *   withTimeout(Purchases.configure({ ... }), 5000)
 *   → Throws TimeoutError if takes > 5s
 */

export class TimeoutError extends Error {
  constructor(message: string = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Wrap a Promise with timeout
 *
 * @param promise - Promise to wrap
 * @param ms - Timeout in milliseconds
 * @param label - Optional label for error message
 * @returns Promise that resolves/rejects with timeout
 *
 * @example
 *   await withTimeout(fetchData(), 5000, "fetchData");
 *   // Throws TimeoutError if > 5s
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      const msg = label ? `${label} (${ms}ms)` : `Operation (${ms}ms)`;
      reject(new TimeoutError(`${msg} timed out`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
}
