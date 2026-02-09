/**
 * Hook for managing cancellable API requests
 * Automatically cancels pending requests on unmount or when dependencies change
 */

import { useCallback, useEffect, useRef } from "react";
import { logger } from "../utils/logger";

/**
 * Hook that provides an AbortController signal that auto-cancels on unmount
 * Use this to pass to API calls that support AbortSignal
 *
 * @example
 * function MyComponent() {
 *   const getSignal = useCancellableRequest();
 *
 *   const fetchData = async () => {
 *     const response = await fetchWithTimeout('/api/data', {
 *       abortSignal: getSignal(),
 *     });
 *   };
 *
 *   return <Button onPress={fetchData}>Load</Button>;
 * }
 */
export function useCancellableRequest() {
  const controllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        logger.debug("Request cancelled on unmount", "useCancellableRequest");
      }
    };
  }, []);

  /**
   * Get a fresh AbortSignal
   * Call this before each request - it cancels any previous pending request
   */
  const getSignal = useCallback(() => {
    // Cancel any previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new controller
    controllerRef.current = new AbortController();
    return controllerRef.current.signal;
  }, []);

  /**
   * Manually cancel the current request
   */
  const cancel = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  return { getSignal, cancel };
}

/**
 * Hook that provides a stable AbortSignal for a single request
 * Creates a new signal when dependencies change
 *
 * @example
 * function MyComponent({ userId }) {
 *   const signal = useAbortSignal([userId]);
 *
 *   useEffect(() => {
 *     fetchUser(userId, { abortSignal: signal });
 *   }, [userId, signal]);
 * }
 */
export function useAbortSignal(deps: React.DependencyList = []) {
  const controllerRef = useRef<AbortController>(new AbortController());

  // Create new controller when deps change, cancel previous
  useEffect(() => {
    // Cancel previous
    controllerRef.current.abort();
    // Create new
    controllerRef.current = new AbortController();

    return () => {
      controllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return controllerRef.current.signal;
}

/**
 * Hook for managing multiple concurrent requests
 * Tracks all requests and cancels them all on unmount
 *
 * @example
 * function MyComponent() {
 *   const { track, cancelAll } = useRequestTracker();
 *
 *   const fetchMultiple = async () => {
 *     const results = await Promise.all([
 *       track(fetchWithTimeout('/api/a', {})),
 *       track(fetchWithTimeout('/api/b', {})),
 *     ]);
 *   };
 *
 *   return (
 *     <>
 *       <Button onPress={fetchMultiple}>Load All</Button>
 *       <Button onPress={cancelAll}>Cancel</Button>
 *     </>
 *   );
 * }
 */
export function useRequestTracker() {
  const controllersRef = useRef<Set<AbortController>>(new Set());

  // Cleanup on unmount
  useEffect(() => {
    const controllers = controllersRef.current;
    return () => {
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, []);

  /**
   * Create a tracked request with its own AbortController
   */
  const createSignal = useCallback(() => {
    const controller = new AbortController();
    controllersRef.current.add(controller);

    // Auto-remove when aborted or completed
    controller.signal.addEventListener("abort", () => {
      controllersRef.current.delete(controller);
    });

    return controller.signal;
  }, []);

  /**
   * Cancel all tracked requests
   */
  const cancelAll = useCallback(() => {
    controllersRef.current.forEach((controller) => controller.abort());
    controllersRef.current.clear();
    logger.debug("All tracked requests cancelled", "useRequestTracker");
  }, []);

  /**
   * Get count of active requests
   */
  const getActiveCount = useCallback(() => {
    return controllersRef.current.size;
  }, []);

  return { createSignal, cancelAll, getActiveCount };
}
