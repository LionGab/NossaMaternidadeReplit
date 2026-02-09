/**
 * Testes de validação - Nossa Maternidade
 * @module utils/__tests__/validation.test.ts
 */

import {
  emailSchema,
  senhaSchema,
  nomeSchema,
  cpfSchema,
  telefoneSchema,
  dataSchema,
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  sanitizeString,
  validateWithSchema,
  schemas,
} from "../validation";

describe("Validation Schemas", () => {
  describe("emailSchema", () => {
    it("deve aceitar email válido", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    });

    it("deve normalizar email para lowercase", () => {
      const result = emailSchema.parse("USER@EXAMPLE.COM");
      expect(result).toBe("user@example.com");
    });

    it("deve rejeitar email inválido", () => {
      expect(emailSchema.safeParse("invalid-email").success).toBe(false);
      expect(emailSchema.safeParse("@example.com").success).toBe(false);
      expect(emailSchema.safeParse("user@").success).toBe(false);
    });

    it("deve rejeitar email muito longo", () => {
      const longEmail = "a".repeat(250) + "@example.com";
      expect(emailSchema.safeParse(longEmail).success).toBe(false);
    });
  });

  describe("senhaSchema", () => {
    it("deve aceitar senha forte válida", () => {
      expect(senhaSchema.safeParse("Senha123!").success).toBe(true);
      expect(senhaSchema.safeParse("MyP@ssw0rd").success).toBe(true);
    });

    it("deve rejeitar senha curta", () => {
      const result = senhaSchema.safeParse("Abc1!");
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem maiúscula", () => {
      const result = senhaSchema.safeParse("senha123!");
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem minúscula", () => {
      const result = senhaSchema.safeParse("SENHA123!");
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem número", () => {
      const result = senhaSchema.safeParse("SenhaForte!");
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha sem caractere especial", () => {
      const result = senhaSchema.safeParse("Senha1234");
      expect(result.success).toBe(false);
    });

    it("deve rejeitar senha muito longa", () => {
      const longPassword = "A1!" + "a".repeat(130);
      expect(senhaSchema.safeParse(longPassword).success).toBe(false);
    });
  });

  describe("nomeSchema", () => {
    it("deve aceitar nome válido", () => {
      expect(nomeSchema.safeParse("Maria Silva").success).toBe(true);
      expect(nomeSchema.safeParse("João").success).toBe(true);
    });

    it("deve fazer trim de espaços", () => {
      const result = nomeSchema.parse("  Maria Silva  ");
      expect(result).toBe("Maria Silva");
    });

    it("deve rejeitar nome muito curto", () => {
      expect(nomeSchema.safeParse("A").success).toBe(false);
    });

    it("deve rejeitar nome muito longo", () => {
      const longName = "a".repeat(101);
      expect(nomeSchema.safeParse(longName).success).toBe(false);
    });
  });

  describe("cpfSchema", () => {
    it("deve aceitar CPF válido", () => {
      expect(cpfSchema.safeParse("12345678909").success).toBe(true);
      expect(cpfSchema.safeParse("11144477735").success).toBe(true);
    });

    it("deve rejeitar CPF inválido", () => {
      expect(cpfSchema.safeParse("12345678900").success).toBe(false);
      expect(cpfSchema.safeParse("00000000000").success).toBe(false);
      expect(cpfSchema.safeParse("11111111111").success).toBe(false);
    });

    it("deve rejeitar CPF com formatação", () => {
      expect(cpfSchema.safeParse("123.456.789-09").success).toBe(false);
    });

    it("deve rejeitar CPF com tamanho errado", () => {
      expect(cpfSchema.safeParse("1234567890").success).toBe(false);
      expect(cpfSchema.safeParse("123456789012").success).toBe(false);
    });
  });

  describe("telefoneSchema", () => {
    it("deve aceitar celular válido (11 dígitos)", () => {
      expect(telefoneSchema.safeParse("11987654321").success).toBe(true);
    });

    it("deve aceitar telefone fixo válido (10 dígitos)", () => {
      expect(telefoneSchema.safeParse("1133334444").success).toBe(true);
    });

    it("deve rejeitar telefone com formatação", () => {
      expect(telefoneSchema.safeParse("(11) 98765-4321").success).toBe(false);
    });

    it("deve rejeitar telefone com tamanho errado", () => {
      expect(telefoneSchema.safeParse("119876543").success).toBe(false);
      expect(telefoneSchema.safeParse("119876543210").success).toBe(false);
    });
  });

  describe("dataSchema", () => {
    it("deve aceitar data passada válida", () => {
      const pastDate = new Date("2023-01-01").toISOString();
      expect(dataSchema.safeParse(pastDate).success).toBe(true);
    });

    it("deve rejeitar data futura", () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString(); // Amanhã
      expect(dataSchema.safeParse(futureDate).success).toBe(false);
    });

    it("deve rejeitar data inválida", () => {
      expect(dataSchema.safeParse("invalid-date").success).toBe(false);
      expect(dataSchema.safeParse("2023-13-01").success).toBe(false);
    });
  });

  describe("signUpSchema", () => {
    it("deve aceitar dados válidos de cadastro", () => {
      const data = {
        email: "user@example.com",
        password: "Senha123!",
        name: "Maria Silva",
      };
      expect(signUpSchema.safeParse(data).success).toBe(true);
    });

    it("deve rejeitar dados incompletos", () => {
      const data = {
        email: "user@example.com",
        password: "Senha123!",
        // name faltando
      };
      expect(signUpSchema.safeParse(data).success).toBe(false);
    });

    it("deve rejeitar email inválido", () => {
      const data = {
        email: "invalid-email",
        password: "Senha123!",
        name: "Maria Silva",
      };
      expect(signUpSchema.safeParse(data).success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    it("deve aceitar dados válidos de login", () => {
      const data = {
        email: "user@example.com",
        password: "anypassword",
      };
      expect(signInSchema.safeParse(data).success).toBe(true);
    });

    it("deve rejeitar senha vazia", () => {
      const data = {
        email: "user@example.com",
        password: "",
      };
      expect(signInSchema.safeParse(data).success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("deve aceitar email válido", () => {
      const data = { email: "user@example.com" };
      expect(resetPasswordSchema.safeParse(data).success).toBe(true);
    });

    it("deve rejeitar email inválido", () => {
      const data = { email: "invalid-email" };
      expect(resetPasswordSchema.safeParse(data).success).toBe(false);
    });
  });
});

describe("Utility Functions", () => {
  describe("sanitizeString", () => {
    it("deve fazer trim de espaços", () => {
      expect(sanitizeString("  hello  ")).toBe("hello");
    });

    it("deve remover caracteres < e >", () => {
      expect(sanitizeString("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script");
    });

    it("deve limitar tamanho padrão a 1000 caracteres", () => {
      const longString = "a".repeat(1500);
      expect(sanitizeString(longString).length).toBe(1000);
    });

    it("deve respeitar maxLength customizado", () => {
      const longString = "a".repeat(500);
      expect(sanitizeString(longString, 100).length).toBe(100);
    });
  });

  describe("validateWithSchema", () => {
    it("deve retornar success: true para dados válidos", () => {
      const result = validateWithSchema(emailSchema, "user@example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("user@example.com");
      }
    });

    it("deve retornar success: false com erros para dados inválidos", () => {
      const result = validateWithSchema(emailSchema, "invalid-email");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(Object.keys(result.errors).length).toBeGreaterThan(0);
      }
    });

    it("deve formatar erros de forma estruturada", () => {
      const result = validateWithSchema(signUpSchema, {
        email: "invalid",
        password: "weak",
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors.some((e) => e.includes("email"))).toBe(true);
        expect(result.errors.some((e) => e.includes("password"))).toBe(true);
        expect(result.errors.some((e) => e.includes("name"))).toBe(true);
      }
    });
  });
});

// ============================================
// Schemas de Dados de Saúde
// ============================================

describe("habitSchema", () => {
  it("should validate valid habit data", () => {
    const validHabit = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Beber água",
      description: "Beber 8 copos de água por dia",
      frequency: "daily" as const,
      is_active: true,
      streak: 5,
    };

    const result = schemas.habit.safeParse(validHabit);
    expect(result.success).toBe(true);
  });

  it("should reject habit with invalid user_id (not UUID)", () => {
    const invalidHabit = {
      user_id: "invalid-uuid",
      title: "Beber água",
      frequency: "daily" as const,
    };

    const result = schemas.habit.safeParse(invalidHabit);
    expect(result.success).toBe(false);
  });

  it("should reject habit with title too short", () => {
    const invalidHabit = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      title: "ab", // menos de 3 caracteres
      frequency: "daily" as const,
    };

    const result = schemas.habit.safeParse(invalidHabit);
    expect(result.success).toBe(false);
  });

  it("should reject habit with invalid frequency", () => {
    const invalidHabit = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Beber água",
      frequency: "monthly", // não permitido
    };

    const result = schemas.habit.safeParse(invalidHabit);
    expect(result.success).toBe(false);
  });

  it("should set default values for optional fields", () => {
    const habit = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Beber água",
      frequency: "daily" as const,
    };

    const result = schemas.habit.safeParse(habit);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.is_active).toBe(true);
      expect(result.data.streak).toBe(0);
    }
  });
});

describe("habitUpdateSchema", () => {
  it("should validate partial habit update", () => {
    const update = {
      title: "Novo título",
    };

    const result = schemas.habitUpdate.safeParse(update);
    expect(result.success).toBe(true);
  });

  it("should reject empty update object", () => {
    const update = {};

    const result = schemas.habitUpdate.safeParse(update);
    expect(result.success).toBe(false);
  });
});

describe("userProfileSchema", () => {
  it("should validate valid user profile", () => {
    const profile = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Maria Silva",
      email: "maria@example.com",
      pregnancy_stage: "second_trimester" as const,
      bio: "Mãe de primeira viagem",
    };

    const result = schemas.userProfile.safeParse(profile);
    expect(result.success).toBe(true);
  });

  it("should reject invalid pregnancy_stage", () => {
    const profile = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Maria Silva",
      email: "maria@example.com",
      pregnancy_stage: "invalid_stage",
    };

    const result = schemas.userProfile.safeParse(profile);
    expect(result.success).toBe(false);
  });

  it("should reject bio longer than 500 characters", () => {
    const profile = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Maria Silva",
      email: "maria@example.com",
      bio: "a".repeat(501), // 501 caracteres
    };

    const result = schemas.userProfile.safeParse(profile);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Schemas de Comunidade
// ============================================

describe("postSchema", () => {
  it("should validate valid post with text only", () => {
    const post = {
      author_id: "123e4567-e89b-12d3-a456-426614174000",
      content: "Olá, pessoal! Como vocês estão?",
      type: "text" as const,
    };

    const result = schemas.post.safeParse(post);
    expect(result.success).toBe(true);
  });

  it("should validate valid post with image", () => {
    const post = {
      author_id: "123e4567-e89b-12d3-a456-426614174000",
      content: "Veja minha foto!",
      image_url: "https://example.com/image.jpg",
      type: "image" as const,
    };

    const result = schemas.post.safeParse(post);
    expect(result.success).toBe(true);
  });

  it("should reject post with empty content", () => {
    const post = {
      author_id: "123e4567-e89b-12d3-a456-426614174000",
      content: "",
      type: "text" as const,
    };

    const result = schemas.post.safeParse(post);
    expect(result.success).toBe(false);
  });

  it("should reject post with content longer than 2000 characters", () => {
    const post = {
      author_id: "123e4567-e89b-12d3-a456-426614174000",
      content: "a".repeat(2001),
      type: "text" as const,
    };

    const result = schemas.post.safeParse(post);
    expect(result.success).toBe(false);
  });

  it("should reject post with non-HTTPS image URL", () => {
    const post = {
      author_id: "123e4567-e89b-12d3-a456-426614174000",
      content: "Veja minha foto!",
      image_url: "http://example.com/image.jpg", // HTTP não permitido
      type: "image" as const,
    };

    const result = schemas.post.safeParse(post);
    expect(result.success).toBe(false);
  });
});

describe("commentSchema", () => {
  it("should validate valid comment", () => {
    const comment = {
      post_id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "123e4567-e89b-12d3-a456-426614174001",
      content: "Ótimo post!",
    };

    const result = schemas.comment.safeParse(comment);
    expect(result.success).toBe(true);
  });

  it("should reject comment with empty content", () => {
    const comment = {
      post_id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "123e4567-e89b-12d3-a456-426614174001",
      content: "",
    };

    const result = schemas.comment.safeParse(comment);
    expect(result.success).toBe(false);
  });

  it("should reject comment longer than 1000 characters", () => {
    const comment = {
      post_id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "123e4567-e89b-12d3-a456-426614174001",
      content: "a".repeat(1001),
    };

    const result = schemas.comment.safeParse(comment);
    expect(result.success).toBe(false);
  });
});

describe("reportSchema", () => {
  it("should validate valid report", () => {
    const report = {
      content_type: "post" as const,
      content_id: "123e4567-e89b-12d3-a456-426614174000",
      reason: "spam" as const,
      description: "Este post é spam",
    };

    const result = schemas.report.safeParse(report);
    expect(result.success).toBe(true);
  });

  it("should reject report with invalid reason", () => {
    const report = {
      content_type: "post" as const,
      content_id: "123e4567-e89b-12d3-a456-426614174000",
      reason: "invalid_reason",
    };

    const result = schemas.report.safeParse(report);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Schemas de IA/Chat
// ============================================

describe("chatMessageSchema", () => {
  it("should validate valid user message", () => {
    const message = {
      role: "user" as const,
      content: "Como estou?",
    };

    const result = schemas.chatMessage.safeParse(message);
    expect(result.success).toBe(true);
  });

  it("should reject empty message", () => {
    const message = {
      role: "user" as const,
      content: "",
    };

    const result = schemas.chatMessage.safeParse(message);
    expect(result.success).toBe(false);
  });

  it("should reject message longer than 2000 characters", () => {
    const message = {
      role: "user" as const,
      content: "a".repeat(2001),
    };

    const result = schemas.chatMessage.safeParse(message);
    expect(result.success).toBe(false);
  });
});

describe("chatMessagesSchema", () => {
  it("should validate array of messages", () => {
    const messages = [
      { role: "user" as const, content: "Olá" },
      { role: "assistant" as const, content: "Olá! Como posso ajudar?" },
      { role: "user" as const, content: "Estou com dúvidas" },
    ];

    const result = schemas.chatMessages.safeParse(messages);
    expect(result.success).toBe(true);
  });

  it("should reject empty array", () => {
    const messages: unknown[] = [];

    const result = schemas.chatMessages.safeParse(messages);
    expect(result.success).toBe(false);
  });

  it("should reject array with invalid message", () => {
    const messages = [
      { role: "user" as const, content: "Olá" },
      { role: "assistant" as const, content: "" }, // conteúdo vazio
    ];

    const result = schemas.chatMessages.safeParse(messages);
    expect(result.success).toBe(false);
  });
});

// ============================================
// Utility Schemas
// ============================================

describe("textoSchema", () => {
  it("should trim and sanitize text", () => {
    const text = "  Hello World  ";
    const result = schemas.texto.safeParse(text);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Hello World");
    }
  });

  it("should reject text longer than 5000 characters", () => {
    const text = "a".repeat(5001);
    const result = schemas.texto.safeParse(text);

    expect(result.success).toBe(false);
  });

  it("should reject empty text after trim", () => {
    const text = "   ";
    const result = schemas.texto.safeParse(text);

    expect(result.success).toBe(false);
  });
});

describe("imagemUrlSchema", () => {
  it("should validate HTTPS URL", () => {
    const url = "https://example.com/image.jpg";
    const result = schemas.imagemUrl.safeParse(url);

    expect(result.success).toBe(true);
  });

  it("should reject HTTP URL", () => {
    const url = "http://example.com/image.jpg";
    const result = schemas.imagemUrl.safeParse(url);

    expect(result.success).toBe(false);
  });

  it("should reject invalid URL format", () => {
    const url = "not-a-url";
    const result = schemas.imagemUrl.safeParse(url);

    expect(result.success).toBe(false);
  });

  it("should accept undefined (optional)", () => {
    const result = schemas.imagemUrl.safeParse(undefined);
    expect(result.success).toBe(true);
  });
});

describe("uuidSchema", () => {
  it("should validate valid UUID v4", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    const result = schemas.uuid.safeParse(uuid);

    expect(result.success).toBe(true);
  });

  it("should reject invalid UUID format", () => {
    const uuid = "not-a-uuid";
    const result = schemas.uuid.safeParse(uuid);

    expect(result.success).toBe(false);
  });
});
