/**
 * Lightweight, testable SSE parser for text/event-stream payloads.
 * Handles:
 * - Comment/keep-alive lines (prefixed with ":") are ignored
 * - Multi-line `data:` blocks (joined with "\n")
 * - Events delimited by a blank line
 * - Buffers incomplete chunks between reads
 *
 * Streaming Event Contract (backend):
 * - Each event is delivered as `data: <json|string>` terminated by a blank line.
 * - Text chunks: `data: {"chunk":"Olá, amiga"}` (may arrive split across multiple data lines)
 * - Metadata: `data: {"usage":{"promptTokens":1,"completionTokens":2}}`
 * - Terminator: `data: [DONE]`
 * Examples:
 *   data: {"chunk":"oi"}
 *
 *   data: {"chunk":"tudo"}
 *   data: {"chunk":" bem?"}
 *
 *   data: [DONE]
 */

export interface SSEEvent {
  /** Optional event name (not currently used by our backend) */
  event?: string;
  /** Raw data payload (can be JSON or plain text) */
  data: string;
}

export class SSEParser {
  private buffer = "";
  private currentEventLines: string[] = [];
  private currentEventName: string | undefined;

  /**
   * Feed a decoded text chunk into the parser.
   * Returns all complete events found in this chunk; incomplete data stays buffered.
   */
  feed(chunk: string): SSEEvent[] {
    this.buffer += chunk;

    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() ?? "";

    const events: SSEEvent[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();

      // Keep-alive / comment
      if (line.startsWith(":")) {
        continue;
      }

      // Blank line = dispatch current event
      if (line === "") {
        if (this.currentEventLines.length > 0) {
          events.push(this.flushEvent());
        }
        continue;
      }

      // Field parsing (event or data)
      if (line.startsWith("event:")) {
        this.currentEventName = line.slice(6).trimStart();
        continue;
      }

      if (line.startsWith("data:")) {
        this.currentEventLines.push(line.slice(5).trimStart());
        continue;
      }

      // Fallback: treat unknown line as data continuation for robustness
      this.currentEventLines.push(line);
    }

    return events;
  }

  /**
   * Flush any buffered event data (used when the stream ends).
   */
  flushPending(): SSEEvent[] {
    if (this.currentEventLines.length === 0) return [];
    return [this.flushEvent()];
  }

  private flushEvent(): SSEEvent {
    const event: SSEEvent = {
      event: this.currentEventName,
      data: this.currentEventLines.join("\n"),
    };
    this.currentEventLines = [];
    this.currentEventName = undefined;
    return event;
  }
}
