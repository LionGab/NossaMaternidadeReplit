/**
 * Tests for formatters utility functions
 *
 * @module utils/__tests__/formatters.test
 */

import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { formatTimeAgo, formatCompactNumber, truncateText } from "../formatters";

describe("formatTimeAgo", () => {
  // Mock Date.now for consistent testing
  const NOW = 1704067200000; // 2024-01-01 00:00:00 UTC

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return "agora" for timestamps less than 60 seconds ago', () => {
    const timestamp = new Date(NOW - 30 * 1000).toISOString(); // 30 seconds ago
    expect(formatTimeAgo(timestamp)).toBe("agora");
  });

  it('should return "agora" for timestamps exactly 59 seconds ago', () => {
    const timestamp = new Date(NOW - 59 * 1000).toISOString();
    expect(formatTimeAgo(timestamp)).toBe("agora");
  });

  it('should return "há 1 min" for timestamps exactly 1 minute ago', () => {
    const timestamp = new Date(NOW - 60 * 1000).toISOString();
    expect(formatTimeAgo(timestamp)).toBe("há 1 min");
  });

  it('should return "há X min" for timestamps less than 60 minutes ago', () => {
    const timestamp = new Date(NOW - 30 * 60 * 1000).toISOString(); // 30 minutes ago
    expect(formatTimeAgo(timestamp)).toBe("há 30 min");
  });

  it('should return "há 1h" for timestamps exactly 1 hour ago', () => {
    const timestamp = new Date(NOW - 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(timestamp)).toBe("há 1h");
  });

  it('should return "há Xh" for timestamps less than 24 hours ago', () => {
    const timestamp = new Date(NOW - 12 * 60 * 60 * 1000).toISOString(); // 12 hours ago
    expect(formatTimeAgo(timestamp)).toBe("há 12h");
  });

  it('should return "há 1 dia" for timestamps exactly 1 day ago', () => {
    const timestamp = new Date(NOW - 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(timestamp)).toBe("há 1 dia");
  });

  it('should return "há X dias" for timestamps less than 7 days ago', () => {
    const timestamp = new Date(NOW - 3 * 24 * 60 * 60 * 1000).toISOString(); // 3 days ago
    expect(formatTimeAgo(timestamp)).toBe("há 3 dias");
  });

  it('should return "há 1 semana" for timestamps exactly 1 week ago', () => {
    const timestamp = new Date(NOW - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatTimeAgo(timestamp)).toBe("há 1 semana");
  });

  it('should return "há X semanas" for timestamps less than 4 weeks ago', () => {
    const timestamp = new Date(NOW - 14 * 24 * 60 * 60 * 1000).toISOString(); // 2 weeks ago
    expect(formatTimeAgo(timestamp)).toBe("há 2 semanas");
  });

  it('should return "há 1 mês" for timestamps approximately 1 month ago', () => {
    const timestamp = new Date(NOW - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
    expect(formatTimeAgo(timestamp)).toBe("há 1 mês");
  });

  it('should return "há X meses" for timestamps more than 1 month ago', () => {
    const timestamp = new Date(NOW - 90 * 24 * 60 * 60 * 1000).toISOString(); // 90 days ago
    expect(formatTimeAgo(timestamp)).toBe("há 3 meses");
  });

  it("should handle very old timestamps", () => {
    const timestamp = new Date(NOW - 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year ago
    expect(formatTimeAgo(timestamp)).toBe("há 12 meses");
  });

  it("should handle timestamps in the future gracefully", () => {
    // Future timestamps will result in negative values, but function should still work
    const timestamp = new Date(NOW + 60 * 1000).toISOString(); // 1 minute in future
    // This will return "agora" because negative seconds < 60
    expect(formatTimeAgo(timestamp)).toBe("agora");
  });
});

describe("formatCompactNumber", () => {
  it("should return number as string for values less than 1000", () => {
    expect(formatCompactNumber(0)).toBe("0");
    expect(formatCompactNumber(100)).toBe("100");
    expect(formatCompactNumber(999)).toBe("999");
  });

  it("should format thousands with k suffix", () => {
    expect(formatCompactNumber(1000)).toBe("1k");
    expect(formatCompactNumber(1200)).toBe("1.2k");
    expect(formatCompactNumber(10500)).toBe("10.5k");
    expect(formatCompactNumber(999999)).toBe("1000k");
  });

  it("should format millions with M suffix", () => {
    expect(formatCompactNumber(1000000)).toBe("1M");
    expect(formatCompactNumber(1500000)).toBe("1.5M");
    expect(formatCompactNumber(10000000)).toBe("10M");
  });

  it("should remove trailing .0 from formatted numbers", () => {
    expect(formatCompactNumber(1000)).toBe("1k");
    expect(formatCompactNumber(2000000)).toBe("2M");
  });
});

describe("truncateText", () => {
  it("should return original text if shorter than maxLength", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
    expect(truncateText("", 5)).toBe("");
  });

  it("should return original text if equal to maxLength", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });

  it("should truncate text and add ellipsis if longer than maxLength", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Hello World", 8)).toBe("Hello Wo...");
  });

  it("should trim trailing whitespace before adding ellipsis", () => {
    expect(truncateText("Hello    World", 6)).toBe("Hello...");
  });

  it("should handle maxLength of 0", () => {
    expect(truncateText("Hello", 0)).toBe("...");
  });
});
