import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
  root: path.join(__dirname, "app"),
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      exclude: [
        "**/types/**",
        "**dist**",
        "**/main.tsx",
        "**/root.tsx",
        "**/EmbeddedMultiSelect.tsx",
      ],
    },
  },
});