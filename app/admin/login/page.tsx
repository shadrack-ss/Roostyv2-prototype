import type { Metadata } from "next";
import { getSettings } from "@/lib/content/queries";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const [{ callbackUrl }, settings] = await Promise.all([searchParams, getSettings()]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-brand text-lg font-extrabold text-gold">
            {settings.initials}
          </span>
          <div>
            <h1 className="text-xl font-semibold">{settings.brandName}</h1>
            <p className="text-sm text-muted">Sign in to manage the website</p>
          </div>
        </div>
        <div className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
        </div>
      </div>
    </main>
  );
}
