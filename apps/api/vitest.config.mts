import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // NestJS DI requires decorator metadata, which esbuild (vitest's default
    // transformer) does not emit — SWC does.
    swc.vite({ module: { type: "es6" } }),
  ],
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts", "test/**/*.e2e-spec.ts"],
    globalSetup: ["test/global-setup.ts"],
    setupFiles: ["test/setup.ts"],
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
