import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader, formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { formatUGX } from "@/lib/money";

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [newBookings, unread, rooms, recentBookings, recentActivity] = await Promise.all([
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.room.count({ where: { published: true } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { label: "New booking requests", value: newBookings, href: "/admin/bookings" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
    { label: "Rooms on the website", value: rooms, href: "/admin/collections/rooms" },
  ];

  return (
    <>
      <PageHeader title={`Welcome${admin.name ? `, ${admin.name.split(" ")[0]}` : ""}`} description="Here is what needs your attention." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-brand">
            <p className="text-3xl font-semibold text-brand">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Latest booking requests">
          {recentBookings.length === 0 ? (
            <EmptyState>No booking requests yet.</EmptyState>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {recentBookings.map((b) => (
                <li key={b.id}>
                  <Link href={`/admin/bookings/${b.id}`} className="flex items-center justify-between gap-3 py-2.5 hover:text-brand">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{b.fullName}</span>
                      <span className="block truncate text-xs text-muted">
                        {b.roomName} &middot; {formatDate(b.checkIn)} &middot; {formatUGX(b.nightlyRate)}/night
                      </span>
                    </span>
                    {b.status === "NEW" && <Badge tone="gold">New</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Recent changes">
          {recentActivity.length === 0 ? (
            <EmptyState>Nothing has been changed yet.</EmptyState>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {recentActivity.map((a) => (
                <li key={a.id} className="py-2.5 text-sm">
                  <span className="font-medium">{a.adminEmail}</span> <span className="text-muted">{a.action}</span>{" "}
                  {a.summary && <span>&ldquo;{a.summary}&rdquo;</span>}
                  <span className="block text-xs text-muted">{formatDate(a.createdAt, true)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
