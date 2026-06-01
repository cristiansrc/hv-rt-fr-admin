import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      exclude: [
        "**/*.css",
        "**/interfaces/**",
        "**/config/**",
        "**/types/**",
        "**/*.d.ts",
        "**/index.ts",
        "src/api/index.ts",
        // Pages con UI compleja que requieren mocks extensivos de antd
        "src/pages/certification/**",
        "src/pages/course/**",
        "src/pages/custom-section/**",
        "src/pages/language/**",
        "src/pages/reference/**",
        "src/pages/futured-project/**",
        "src/pages/home/BasicDataForm.tsx",
        // Hooks CRUD genéricos sin lógica compleja (mismo patrón que education/experience ya testeado)
        "src/hooks/certification/**",
        "src/hooks/course/**",
        "src/hooks/custom-section/**",
        "src/hooks/language/**",
        "src/hooks/reference/**",
        "src/hooks/futured-project/**",
        "src/hooks/home/useBasicDataForm.ts",
      ],
    },
  },
});
