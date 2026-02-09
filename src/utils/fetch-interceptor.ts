/**
 * Fetch Interceptor for Reactotron
 * Tracks all fetch() requests and logs them to Reactotron
 * ONLY runs in development mode (__DEV__)
 */

import Reactotron from "../config/reactotron";

// Store original fetch
const originalFetch = global.fetch;

/**
 * Enhanced fetch with Reactotron tracking
 */
const trackedFetch: typeof fetch = async (input, init?) => {
  if (!__DEV__) {
    return originalFetch(input, init);
  }

  const startTime = Date.now();
  const url =
    typeof input === "string" ? input : input instanceof Request ? input.url : input.toString();
  const method = init?.method || "GET";

  try {
    // Log request start
    Reactotron.log?.(`🌐 ${method} ${url}`);

    // Execute request
    const response = await originalFetch(input, init);

    // Calculate duration
    const duration = Date.now() - startTime;

    // Clone response to read body without consuming it
    const clone = response.clone();

    // Try to parse response body
    let responseData: unknown = null;
    const contentType = response.headers.get("content-type");

    try {
      if (contentType?.includes("application/json")) {
        responseData = await clone.json();
      } else if (contentType?.includes("text/")) {
        responseData = await clone.text();
      }
    } catch {
      // Can't parse body, skip
    }

    // Log successful response
    Reactotron.display?.({
      name: `${method} ${url}`,
      preview: `${response.status} ${response.statusText} (${duration}ms)`,
      value: {
        request: {
          url,
          method,
          headers: init?.headers,
          body: init?.body,
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData,
          duration: `${duration}ms`,
        },
      },
      important: response.status >= 400,
    });

    return response;
  } catch (error) {
    // Calculate duration for failed requests
    const duration = Date.now() - startTime;

    // Log failed request
    Reactotron.display?.({
      name: `${method} ${url}`,
      preview: `❌ FAILED (${duration}ms)`,
      value: {
        request: {
          url,
          method,
          headers: init?.headers,
          body: init?.body,
        },
        error: {
          message: error instanceof Error ? error.message : String(error),
          duration: `${duration}ms`,
        },
      },
      important: true,
    });

    throw error;
  }
};

/**
 * Initialize fetch interceptor
 * Replaces global.fetch with tracked version
 */
export function initializeFetchInterceptor(): void {
  if (!__DEV__) return;

  global.fetch = trackedFetch;
  Reactotron.log?.("🔌 Fetch interceptor initialized");
}

/**
 * Restore original fetch (for cleanup if needed)
 */
export function restoreFetch(): void {
  global.fetch = originalFetch;
}
