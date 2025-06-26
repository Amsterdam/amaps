import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
  root: "./app",
  build: {
    lib: {
      entry: path.resolve(
        __dirname,
        "app/components/MultiSelect/EmbeddedMultiSelect.tsx"
      ),
      name: "MultiSelectMap",
      fileName: () => "multiselect.iife.js",
      formats: ["iife"],
    },
    outDir: "dist-embed",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
