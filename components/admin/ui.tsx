import Link from "next/link";

/** Small presentational pieces shared by every admin screen. */

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-block text-sm text-muted hover:text-brand">
          &larr; {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-line bg-white shadow-sm ${className}`}>
      {title && (
        <div className="border-b border-line px-5 py-3.5">
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium transition hover:border-brand hover:text-brand disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60",
};

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-muted">{children}</p>;
}

const BADGE_TONES = {
  green: "bg-brand-soft text-brand",
  gold: "bg-gold-soft text-[#7a5a1f]",
  gray: "bg-gray-100 text-gray-600",
  red: "bg-red-50 text-red-700",
};

export function Badge({ tone, children }: { tone: keyof typeof BADGE_TONES; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_TONES[tone]}`}>
      {children}
    </span>
  );
}

export function formatDate(date: Date, withTime = false): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: withTime ? undefined : "UTC",
  });
}
