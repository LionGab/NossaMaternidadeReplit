const { requireOptionalNativeModule } = require("expo-modules-core");

const NativeModule = requireOptionalNativeModule("AppleFoundationModels");

function isAvailable() {
  return NativeModule?.isAvailable?.() ?? false;
}

async function generate(messages) {
  if (!NativeModule?.generate) {
    throw new Error("AppleFoundationModels native module not available");
  }
  return await NativeModule.generate(messages);
}

module.exports = {
  isAvailable,
  generate,
};
