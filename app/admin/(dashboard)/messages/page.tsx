import type { Metadata } from "next";
import Link from "next/link";
import { Badge, EmptyState, PageHeader, formatDate } from "@/components/admin/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <PageHeader title="Messages" description="Sent from the Contact page. Reply from your own email; the guest's address is on each message." />
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {messages.length === 0 ? (
          <EmptyState>No messages yet.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}`} className="flex items-start gap-4 px-5 py-3.5 hover:bg-canvas/60">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-gold"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className={`text-sm ${m.read ? "" : "font-semibold"}`}>
                        {m.name} {!m.read && <Badge tone="gold">New</Badge>}
                      </span>
                      <span className="text-xs text-muted">{formatDate(m.createdAt, true)}</span>
                    </span>
                    {m.subject && <span className="block truncate text-sm">{m.subject}</span>}
                    <span className="block truncate text-sm text-muted">{m.message}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
