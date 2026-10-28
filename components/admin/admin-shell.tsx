"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ADMIN_NAV, isNavItemActive } from "@/lib/admin/nav";
import { signOutAction } from "./sign-out";

type Props = {
  brandName: string;
  initials: string;
  admin: { name: string; email: string };
  counts: { bookings: number; messages: number };
  children: React.ReactNode;
};

export function AdminShell({ brandName, initials, admin, counts, children }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-5">
      <Link href="/admin" className="flex items-center gap-3 px-2" onClick={() => setOpen(false)}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-brand-dark text-xs font-extrabold text-gold">
          {initials}
        </span>
        <span className="truncate font-semibold text-white">{brandName}</span>
      </Link>

      {ADMIN_NAV.map((group) => (
        <div key={group.label}>
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/45">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isNavItemActive(item.href, pathname);
              const badge = item.badge ? counts[item.badge] : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition ${
                      active ? "bg-white/15 font-medium text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {badge > 0 && (
                      <span className="rounded-full bg-gold px-1.5 text-[11px] font-semibold text-brand-dark">{badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-auto border-t border-white/10 px-2 pt-4">
        <p className="truncate text-sm font-medium text-white">{admin.name || admin.email}</p>
        <p className="truncate text-xs text-white/55">{admin.email}</p>
        <div className="mt-3 flex gap-3 text-xs">
          <a href="/" target="_blank" rel="noreferrer" className="text-white/70 hover:text-white">
            View site
          </a>
          <form action={signOutAction}>
            <button type="submit" className="text-white/70 hover:text-white">Sign out</button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-brand lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-brand shadow-xl">{sidebar}</aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-line px-2.5 py-1 text-sm font-medium"
          aria-label="Open menu"
        >
          Menu
        </button>
        <span className="font-semibold">{brandName}</span>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}
