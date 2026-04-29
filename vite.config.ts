import { defineConfig } from "vite-plus";
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
  },
  fmt: {
    ignorePatterns: ["node_modules", "dist", "jest.config.js"],
    semi: true,
    singleQuote: false,
    bracketSpacing: true,
    sortImports: true,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["node_modules", "dist", "jest.config.js"],
    options: { typeAware: true, typeCheck: true },
  },
});
