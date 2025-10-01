import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/astro.ts",
    "src/esbuild.ts",
    "src/farm.ts",
    "src/rollup.ts",
    "src/rspack.ts",
    "src/vite.ts",
    "src/webpack.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  clean: true,
});
