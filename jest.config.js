module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|@sentry/.*|native-base|react-native-svg|nativewind|clsx|tailwind-merge))",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react-native-css-interop$": "<rootDir>/__mocks__/react-native-css-interop.js",
    "^react-native-css-interop/(.*)$": "<rootDir>/__mocks__/react-native-css-interop.js",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    // Unit coverage: foco em lógica (UI/screens entram via testes de componente dedicados)
    "!src/components/**",
    "!src/screens/**",
    "!src/navigation/**",
    "!src/theme/**",
    "!src/types/**",
    "!src/ai/**",
  ],
  coverageThreshold: {
    global: {
      branches: 8,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};
