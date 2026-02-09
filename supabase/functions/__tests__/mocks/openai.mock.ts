/**
 * Mock OpenAI SDK for testing
 * Used by ai/ and moderate-content/ functions
 */

// Jest is available globally in test environment

export function createMockOpenAI() {
  return {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          id: "chatcmpl-test",
          object: "chat.completion",
          created: Date.now(),
          model: "gpt-4o-mini",
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: "Olá! Como posso ajudar você hoje?",
              },
              finish_reason: "stop",
            },
          ],
          usage: {
            prompt_tokens: 50,
            completion_tokens: 20,
            total_tokens: 70,
          },
        }),
      },
    },
    moderations: {
      create: jest.fn().mockResolvedValue({
        id: "modr-test",
        model: "omni-moderation-latest",
        results: [
          {
            flagged: false,
            categories: {
              sexual: false,
              hate: false,
              harassment: false,
              "self-harm": false,
              "sexual/minors": false,
              "hate/threatening": false,
              "violence/graphic": false,
              "self-harm/intent": false,
              "self-harm/instructions": false,
              "harassment/threatening": false,
              violence: false,
            },
            category_scores: {
              sexual: 0.001,
              hate: 0.001,
              harassment: 0.001,
              "self-harm": 0.001,
              "sexual/minors": 0.0,
              "hate/threatening": 0.0,
              "violence/graphic": 0.001,
              "self-harm/intent": 0.0,
              "self-harm/instructions": 0.0,
              "harassment/threatening": 0.0,
              violence: 0.001,
            },
          },
        ],
      }),
    },
  };
}

// Helper: Mock OpenAI success
export function mockOpenAISuccess(content = "Resposta teste") {
  const openai = createMockOpenAI();
  openai.chat.completions.create.mockResolvedValue({
    id: "chatcmpl-test",
    object: "chat.completion",
    created: Date.now(),
    model: "gpt-4o-mini",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 50,
      completion_tokens: 20,
      total_tokens: 70,
    },
  });
  return openai;
}

// Helper: Mock OpenAI error
export function mockOpenAIError(errorMessage = "API Error") {
  const openai = createMockOpenAI();
  openai.chat.completions.create.mockRejectedValue(new Error(errorMessage));
  return openai;
}

// Helper: Mock moderation flagged content
export function mockModerationFlagged(score = 0.6) {
  const openai = createMockOpenAI();
  openai.moderations.create.mockResolvedValue({
    id: "modr-test",
    model: "omni-moderation-latest",
    results: [
      {
        flagged: true,
        categories: {
          sexual: score > 0.5,
          hate: false,
          harassment: false,
          "self-harm": false,
          "sexual/minors": false,
          "hate/threatening": false,
          "violence/graphic": false,
          "self-harm/intent": false,
          "self-harm/instructions": false,
          "harassment/threatening": false,
          violence: false,
        },
        category_scores: {
          sexual: score,
          hate: 0.001,
          harassment: 0.001,
          "self-harm": 0.001,
          "sexual/minors": 0.0,
          "hate/threatening": 0.0,
          "violence/graphic": 0.001,
          "self-harm/intent": 0.0,
          "self-harm/instructions": 0.0,
          "harassment/threatening": 0.0,
          violence: 0.001,
        },
      },
    ],
  });
  return openai;
}

// Helper: Mock moderation blocked content
export function mockModerationBlocked(score = 0.9) {
  return mockModerationFlagged(score);
}
