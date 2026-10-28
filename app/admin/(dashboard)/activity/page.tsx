import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader, formatDate } from "@/components/admin/ui";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Activity log" };

const PAGE_SIZE = 50;

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [entries, total] = await Promise.all([
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.auditLog.count(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader title="Activity log" description="Every change made in the admin, newest first. Kept even after an admin account is removed." />
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {entries.length === 0 ? (
          <EmptyState>No activity yet.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">When</th>
                  <th className="px-4 py-2.5 font-medium">Who</th>
                  <th className="px-4 py-2.5 font-medium">What</th>
                  <th className="px-4 py-2.5 font-medium">Item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap px-4 py-2 text-muted">{formatDate(e.createdAt, true)}</td>
                    <td className="px-4 py-2">{e.adminEmail}</td>
                    <td className="px-4 py-2 font-mono text-xs">{e.action}</td>
                    <td className="px-4 py-2">{e.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={`/admin/activity?page=${page - 1}`} className="text-brand hover:underline">&larr; Newer</Link> : <span />}
          <span className="text-muted">Page {page} of {pages}</span>
          {page < pages ? <Link href={`/admin/activity?page=${page + 1}`} className="text-brand hover:underline">Older &rarr;</Link> : <span />}
        </div>
      )}
    </>
  );
}
