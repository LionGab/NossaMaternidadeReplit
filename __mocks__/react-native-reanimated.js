/**
 * Mock for react-native-reanimated
 *
 * Provides Jest-compatible mocks for Reanimated v3+ APIs.
 * Based on official react-native-reanimated/mock with simplified implementation.
 */

const Reanimated = require("react-native-reanimated/mock");

// The mock for `call` immediately calls the callback which is incorrect
Reanimated.default.call = () => {};

module.exports = {
  ...Reanimated,
  default: {
    ...Reanimated.default,
  },
};
