import type { KnipConfig } from "knip";

const config: KnipConfig = {
  tags: ["-knipignore"],
  entry: [
    "server/index.ts",
    "web/index.tsx",
    "web/vite.config.ts",
    "scripts/demo-app/commands/dev.ts",
    "scripts/demo-app/commands/setup.ts",
    "scripts/demo-app/commands/start.ts",
    "scripts/generate-pwa-assets/main.ts",
  ],
  ignoreBinaries: [
    "scripts/build",
    "scripts/dev",
    "scripts/lint",
    "scripts/setup",
    "scripts/start",
    "scripts/test",
  ],
  ignoreDependencies: ["@vitest/coverage-v8"],
};

export default config;
