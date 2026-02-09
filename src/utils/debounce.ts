/**
 * Debounce utility
 * Delays execution of a function until after a specified delay
 */

type DebouncedFunction<T extends unknown[]> = (...args: T) => void;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends unknown[]>(
  func: (...args: T) => void | Promise<void>,
  waitMs: number
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: T) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, waitMs);
  };
}
