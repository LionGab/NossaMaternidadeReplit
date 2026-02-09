module.exports = function (api) {
  api.cache(true);

  const isTest = process.env.NODE_ENV === "test";

  return {
    presets: [
      // No ambiente de teste, usar JSX runtime padrão do React (não NativeWind)
      ["babel-preset-expo", isTest ? {} : { jsxImportSource: "nativewind" }],
      // NativeWind babel preset apenas fora de testes
      !isTest && "nativewind/babel",
    ].filter(Boolean),
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@/components": "./src/components",
            "@/screens": "./src/screens",
            "@/hooks": "./src/hooks",
            "@/utils": "./src/utils",
            "@/api": "./src/api",
            "@/state": "./src/state",
            "@/types": "./src/types",
            "@/theme": "./src/theme",
            "@/navigation": "./src/navigation",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      ],
      "babel-plugin-react-compiler",
      // react-native-reanimated/plugin DEVE ser o último plugin
      "react-native-reanimated/plugin",
    ],
  };
};
