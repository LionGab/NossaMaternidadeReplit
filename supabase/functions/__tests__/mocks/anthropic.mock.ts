/**
 * Mock Anthropic SDK for testing
 * Used by ai/ function as fallback provider
 */

export function createMockAnthropic() {
  return {
    messages: {
      create: jest.fn().mockResolvedValue({
        id: "msg-test",
        type: "message",
        role: "assistant",
        content: [
          {
            type: "text",
            text: "Olá! Como posso ajudar você hoje?",
          },
        ],
        model: "claude-sonnet-4-5",
        stop_reason: "end_turn",
        stop_sequence: null,
        usage: {
          input_tokens: 50,
          output_tokens: 20,
        },
      }),
    },
  };
}

// Helper: Mock Claude success
export function mockClaudeSuccess(content = "Resposta teste") {
  const anthropic = createMockAnthropic();
  anthropic.messages.create.mockResolvedValue({
    id: "msg-test",
    type: "message",
    role: "assistant",
    content: [
      {
        type: "text",
        text: content,
      },
    ],
    model: "claude-sonnet-4-5",
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: 50,
      output_tokens: 20,
    },
  });
  return anthropic;
}

// Helper: Mock Claude error
export function mockClaudeError(errorMessage = "API Error") {
  const anthropic = createMockAnthropic();
  anthropic.messages.create.mockRejectedValue(new Error(errorMessage));
  return anthropic;
}

// Helper: Mock Claude Vision response (with image)
export function mockClaudeVisionSuccess(content = "Vejo uma imagem de ultrassom") {
  const anthropic = createMockAnthropic();
  anthropic.messages.create.mockResolvedValue({
    id: "msg-test-vision",
    type: "message",
    role: "assistant",
    content: [
      {
        type: "text",
        text: content,
      },
    ],
    model: "claude-sonnet-4-5",
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: 150, // Higher token count for image
      output_tokens: 30,
    },
  });
  return anthropic;
}
