import { cn } from "./cn";

describe("cn utility", () => {
  describe("basic functionality", () => {
    it("should return empty string for no arguments", () => {
      expect(cn()).toBe("");
    });

    it("should return single class name as-is", () => {
      expect(cn("flex")).toBe("flex");
    });

    it("should merge multiple class names", () => {
      expect(cn("flex", "items-center")).toBe("flex items-center");
    });
  });

  describe("conditional classes", () => {
    it("should handle boolean conditions", () => {
      expect(cn("base", true && "active")).toBe("base active");
      expect(cn("base", false && "active")).toBe("base");
    });

    it("should handle undefined and null", () => {
      expect(cn("base", undefined)).toBe("base");
      expect(cn("base", null)).toBe("base");
    });

    it("should handle object syntax", () => {
      expect(cn({ active: true, disabled: false })).toBe("active");
      expect(cn("base", { "text-red-500": true })).toBe("base text-red-500");
    });

    it("should handle array of classes", () => {
      expect(cn(["flex", "items-center"])).toBe("flex items-center");
    });
  });

  describe("tailwind-merge conflicts", () => {
    it("should resolve conflicting padding classes", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
      expect(cn("px-4", "px-2")).toBe("px-2");
    });

    it("should resolve conflicting margin classes", () => {
      expect(cn("m-4", "m-8")).toBe("m-8");
      expect(cn("mt-4", "mt-2")).toBe("mt-2");
    });

    it("should resolve conflicting text color classes", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should resolve conflicting background classes", () => {
      expect(cn("bg-white", "bg-black")).toBe("bg-black");
    });

    it("should resolve conflicting flex classes", () => {
      expect(cn("flex-row", "flex-col")).toBe("flex-col");
    });

    it("should resolve conflicting width/height classes", () => {
      expect(cn("w-4", "w-full")).toBe("w-full");
      expect(cn("h-10", "h-screen")).toBe("h-screen");
    });
  });

  describe("complex scenarios", () => {
    it("should handle real-world component class combinations", () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn(
        "px-4 py-2 rounded-lg",
        isActive && "bg-primary-500 text-white",
        isDisabled && "opacity-50 cursor-not-allowed",
        { "hover:bg-primary-600": !isDisabled }
      );

      expect(result).toBe("px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600");
    });

    it("should handle override scenarios", () => {
      // Base styles that may be overridden by variant
      const baseStyles = "p-4 bg-gray-100 text-gray-800";
      const variantStyles = "bg-blue-500 text-white";

      expect(cn(baseStyles, variantStyles)).toBe("p-4 bg-blue-500 text-white");
    });

    it("should handle responsive prefixes correctly", () => {
      expect(cn("text-sm", "md:text-base", "lg:text-lg")).toBe("text-sm md:text-base lg:text-lg");
    });

    it("should handle dark mode prefixes correctly", () => {
      expect(cn("bg-white", "dark:bg-gray-900")).toBe("bg-white dark:bg-gray-900");
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      expect(cn("", "flex", "")).toBe("flex");
    });

    it("should handle whitespace", () => {
      expect(cn("  flex  ", "items-center")).toContain("flex");
    });

    it("should handle deeply nested arrays", () => {
      expect(cn([["flex", ["items-center"]]])).toBe("flex items-center");
    });
  });
});
