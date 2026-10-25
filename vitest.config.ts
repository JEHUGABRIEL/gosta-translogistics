import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

// Les modules applicatifs marquent leur frontière serveur avec
// `import "server-only"`, qui lève une exception hors runtime React Server
// Components. On l'alias vers un module vide pour pouvoir les tester en Node.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: root },
      {
        find: /^server-only$/,
        replacement: fileURLToPath(
          new URL("./test/stubs/server-only.ts", import.meta.url)
        ),
      },
    ],
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    setupFiles: ["./test/setup/env.ts"],
    // Un seul fichier touche la base : on évite toute course entre workers.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
});
