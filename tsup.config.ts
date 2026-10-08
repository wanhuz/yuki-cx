// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["worker/"],
  format: ["esm"],
  platform: "node",
  target: "node20",
  outDir: "dist/worker",
  clean: true,
  external: [/^[^./]/], // anything not starting with "." or "/" stays an import
});