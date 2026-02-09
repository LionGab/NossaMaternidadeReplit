import { SSEParser } from "../sseParser";

describe("SSEParser", () => {
  it("parses single JSON event", () => {
    const parser = new SSEParser();
    const events = parser.feed('data: {"chunk":"oi"}\n\n');

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ data: '{"chunk":"oi"}', event: undefined });
  });

  it("joins multi-line data blocks", () => {
    const parser = new SSEParser();
    const raw = 'data: {"chunk":"ola"\n' + 'data: " mundo"}\n\n';

    const events = parser.feed(raw);

    expect(events).toHaveLength(1);
    expect(events[0].data).toBe('{"chunk":"ola"\n" mundo"}');
  });

  it("buffers partial events across chunks", () => {
    const parser = new SSEParser();

    const first = parser.feed('data: {"chunk":"par');
    expect(first).toHaveLength(0);

    const second = parser.feed('cial"}\n\n');
    expect(second).toHaveLength(1);
    expect(second[0].data).toBe('{"chunk":"parcial"}');
  });

  it("handles CRLF and keep-alive lines", () => {
    const parser = new SSEParser();
    const events = parser.feed(":\r\n\r\ndata: [DONE]\r\n\r\n");

    expect(events).toHaveLength(1);
    expect(events[0].data).toBe("[DONE]");
  });

  it("flushes pending data when stream ends", () => {
    const parser = new SSEParser();
    const events = parser.feed('data: {"usage":1}\n');
    expect(events).toHaveLength(0);

    const flushed = parser.flushPending();
    expect(flushed).toHaveLength(1);
    expect(flushed[0].data).toBe('{"usage":1}');
  });
});
