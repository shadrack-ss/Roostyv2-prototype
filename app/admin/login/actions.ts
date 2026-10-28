"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const callbackUrl = String(formData.get("callbackUrl") || "/admin");
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      // Only ever return somewhere inside the admin.
      redirectTo: callbackUrl.startsWith("/admin") ? callbackUrl : "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) return { error: "That email and password don't match an admin account." };
    throw error; // the redirect on success is thrown too, and must propagate
  }
}
