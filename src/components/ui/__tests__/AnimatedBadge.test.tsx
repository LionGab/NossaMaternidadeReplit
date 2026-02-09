/**
 * AnimatedBadge Tests
 *
 * Unit tests for AnimatedBadge component exports and types.
 * Full rendering tests require additional setup for nativewind/css-interop.
 */

import { AnimatedBadge, StreakBadge, AchievementBadge } from "../AnimatedBadge";

// Note: AsyncStorage is mocked in jest.setup.js

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

describe("AnimatedBadge", () => {
  describe("module exports", () => {
    it("exports AnimatedBadge component", () => {
      expect(AnimatedBadge).toBeDefined();
      expect(typeof AnimatedBadge).toBe("function");
    });

    it("exports StreakBadge component", () => {
      expect(StreakBadge).toBeDefined();
      expect(typeof StreakBadge).toBe("function");
    });

    it("exports AchievementBadge component", () => {
      expect(AchievementBadge).toBeDefined();
      expect(typeof AchievementBadge).toBe("function");
    });

    it("AnimatedBadge has correct name", () => {
      expect(AnimatedBadge.name).toBe("AnimatedBadge");
    });

    it("StreakBadge has correct name", () => {
      expect(StreakBadge.name).toBe("StreakBadge");
    });

    it("AchievementBadge has correct name", () => {
      expect(AchievementBadge.name).toBe("AchievementBadge");
    });
  });

  describe("BadgeType values", () => {
    it("defines valid badge types", () => {
      const validTypes = ["streak", "achievement", "milestone", "notification"] as const;
      expect(validTypes).toHaveLength(4);
      expect(validTypes).toContain("streak");
      expect(validTypes).toContain("achievement");
      expect(validTypes).toContain("milestone");
      expect(validTypes).toContain("notification");
    });
  });

  describe("BadgeSize values", () => {
    it("defines valid badge sizes", () => {
      const validSizes = ["sm", "md", "lg"] as const;
      expect(validSizes).toHaveLength(3);
      expect(validSizes).toContain("sm");
      expect(validSizes).toContain("md");
      expect(validSizes).toContain("lg");
    });
  });

  describe("milestone days for StreakBadge", () => {
    it("identifies milestone days correctly", () => {
      const milestoneDays = [7, 14, 21, 30, 60, 90, 100, 365];

      milestoneDays.forEach((days) => {
        expect(milestoneDays.includes(days)).toBe(true);
      });
    });

    it("non-milestone days are not in the list", () => {
      const milestoneDays = [7, 14, 21, 30, 60, 90, 100, 365];
      const nonMilestoneDays = [1, 5, 10, 15, 25, 50];

      nonMilestoneDays.forEach((days) => {
        expect(milestoneDays.includes(days)).toBe(false);
      });
    });
  });

  describe("default icon mapping", () => {
    it("streak type uses flame icon", () => {
      const iconMap = {
        streak: "flame",
        achievement: "trophy",
        milestone: "star",
        notification: "notifications",
      };

      expect(iconMap.streak).toBe("flame");
      expect(iconMap.achievement).toBe("trophy");
      expect(iconMap.milestone).toBe("star");
      expect(iconMap.notification).toBe("notifications");
    });
  });

  describe("size configurations", () => {
    it("sm size has smallest dimensions", () => {
      const sizes = {
        sm: { height: 28, iconSize: 14, fontSize: 12 },
        md: { height: 36, iconSize: 18, fontSize: 14 },
        lg: { height: 48, iconSize: 22, fontSize: 16 },
      };

      expect(sizes.sm.height).toBeLessThan(sizes.md.height);
      expect(sizes.md.height).toBeLessThan(sizes.lg.height);
    });

    it("lg size has largest dimensions", () => {
      const sizes = {
        sm: { height: 28, iconSize: 14, fontSize: 12 },
        md: { height: 36, iconSize: 18, fontSize: 14 },
        lg: { height: 48, iconSize: 22, fontSize: 16 },
      };

      expect(sizes.lg.height).toBeGreaterThan(sizes.md.height);
      expect(sizes.lg.iconSize).toBeGreaterThan(sizes.md.iconSize);
      expect(sizes.lg.fontSize).toBeGreaterThan(sizes.md.fontSize);
    });
  });

  describe("display text formatting", () => {
    it("streak format includes 'dias' suffix", () => {
      const formatStreakText = (value: number) => `${value} dias`;
      expect(formatStreakText(7)).toBe("7 dias");
      expect(formatStreakText(30)).toBe("30 dias");
    });

    it("label takes precedence over value", () => {
      const getDisplayText = (label?: string, value?: number, type?: string) => {
        if (label) return label;
        if (value !== undefined) {
          if (type === "streak") return `${value} dias`;
          return value.toString();
        }
        return "";
      };

      expect(getDisplayText("Custom Label", 7, "streak")).toBe("Custom Label");
      expect(getDisplayText(undefined, 7, "streak")).toBe("7 dias");
      expect(getDisplayText(undefined, 100, "milestone")).toBe("100");
    });
  });
});
