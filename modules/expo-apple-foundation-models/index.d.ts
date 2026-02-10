export type AIMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * True when the native module exists and the device/OS supports Apple Intelligence.
 */
export function isAvailable(): boolean;

/**
 * Generates a response using Apple's on-device model.
 *
 * Throws if Apple Foundation Models are not available.
 */
export function generate(messages: AIMessage[]): Promise<string>;
