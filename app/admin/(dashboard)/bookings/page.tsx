import type { Metadata } from "next";
import Link from "next/link";
import type { BookingStatus } from "@/generated/prisma/client";
import { EmptyState, PageHeader, formatDate } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { formatUGX } from "@/lib/money";
import { STATUS_LABEL, StatusBadge, nightsBetween } from "./status";

export const metadata: Metadata = { title: "Bookings" };

const TABS: { label: string; status?: BookingStatus }[] = [
  { label: "New", status: "NEW" },
  { label: "Confirmed", status: "CONFIRMED" },
  { label: "Cancelled", status: "CANCELLED" },
  { label: "All" },
];

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: raw } = await searchParams;
  const status = raw && raw in STATUS_LABEL ? (raw as BookingStatus) : raw === "all" ? undefined : "NEW";

  const [bookings, counts] = await Promise.all([
    prisma.booking.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.booking.groupBy({ by: ["status"], _count: true }),
  ]);
  const countFor = (s?: BookingStatus) =>
    s ? (counts.find((c) => c.status === s)?._count ?? 0) : counts.reduce((n, c) => n + c._count, 0);

  return (
    <>
      <PageHeader title="Bookings" description="Requests sent from the Book page. Confirm with the guest by phone or email, then mark the request here." />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = tab.status === status;
          return (
            <Link
              key={tab.label}
              href={`/admin/bookings?status=${tab.status ?? "all"}`}
              className={`rounded-full border px-3 py-1 text-sm ${active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"}`}
            >
              {tab.label} <span className={active ? "text-white/70" : "text-muted"}>{countFor(tab.status)}</span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {bookings.length === 0 ? (
          <EmptyState>No bookings here.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Guest</th>
                  <th className="px-4 py-2.5 font-medium">Room</th>
                  <th className="px-4 py-2.5 font-medium">Stay</th>
                  <th className="px-4 py-2.5 font-medium">Estimate</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => {
                  const nights = nightsBetween(b.checkIn, b.checkOut);
                  return (
                    <tr key={b.id} className="hover:bg-canvas/60">
                      <td className="px-4 py-2.5">
                        <Link href={`/admin/bookings/${b.id}`} className="font-medium text-brand hover:underline">{b.fullName}</Link>
                        <span className="block text-xs text-muted">{b.phone}</span>
                      </td>
                      <td className="px-4 py-2.5">{b.roomName}</td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        {formatDate(b.checkIn)} &rarr; {formatDate(b.checkOut)}
                        <span className="block text-xs text-muted">{nights} night{nights === 1 ? "" : "s"}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">{formatUGX(nights * b.nightlyRate)}</td>
                      <td className="px-4 py-2.5"><StatusBadge status={b.status} /></td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-muted">{formatDate(b.createdAt, true)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
