import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party theme assets — never lint these.
    "public/**",
    // Generated Prisma client.
    "generated/**",
    // Local HTTrack mirrors kept for reference (gitignored, never imported).
    "montana/**",
    "roosts/**",
  ]),
]);

export default eslintConfig;
