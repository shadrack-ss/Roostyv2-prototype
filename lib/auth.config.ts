import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth config (no Prisma, no bcrypt). proxy.ts only
 * needs to know whether a session exists; the Credentials provider that talks
 * to the database lives in auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
} satisfies NextAuthConfig;
