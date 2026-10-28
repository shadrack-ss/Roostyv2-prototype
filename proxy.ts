import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Sends signed-out visitors on any /admin page to the login screen. Server
// actions do their own check (requireAdmin), so this is only the page gate.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || req.auth) return;

  const loginUrl = new URL("/admin/login", req.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return Response.redirect(loginUrl);
});

export const config = {
  matcher: ["/admin/:path*"],
};
