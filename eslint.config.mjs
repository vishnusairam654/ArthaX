// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "assets/**",
      "**/next-env.d.ts",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs", "**/*.mjs"],
    languageOptions: {
      globals: { console: "readonly", process: "readonly" },
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      // Disabled: type-only imports erase the runtime binding that NestJS
      // constructor DI needs for design:paramtypes metadata.
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "off",
    },
  },
);
