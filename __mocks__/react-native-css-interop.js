/**
 * Mock for react-native-css-interop
 *
 * This module is used by NativeWind and requires window.dispatchEvent
 * which doesn't exist in the Jest test environment.
 */

module.exports = {
  cssInterop: (component) => component,
  remapProps: () => {},
  StyleSheet: {
    create: (styles) => styles,
  },
  useColorScheme: () => "light",
  useUnstableNativeVariable: () => undefined,
  vars: () => ({}),
};
