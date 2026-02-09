import { logger } from "../logger";

describe("Logger Utility", () => {
  beforeEach(() => {
    logger.clearHistory();
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should add an info log to history", () => {
    logger.info("Test message", "TestContext");
    const history = logger.getHistory();

    expect(history).toHaveLength(1);
    expect(history[0].level).toBe("info");
    expect(history[0].message).toBe("Test message");
    expect(history[0].context).toBe("TestContext");
  });

  it("should add an error log with metadata", () => {
    const error = new Error("Logic error");
    logger.error("Failed op", "TestContext", error, { userId: "123" });

    const history = logger.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].level).toBe("error");
    expect(history[0].error).toBe(error);
    expect(history[0].metadata).toEqual({ userId: "123" });
  });

  it("should limit history size", () => {
    // Fill beyond max size (100)
    for (let i = 0; i < 110; i++) {
      logger.info(`Msg ${i}`);
    }

    expect(logger.getHistory()).toHaveLength(100);
  });
});
