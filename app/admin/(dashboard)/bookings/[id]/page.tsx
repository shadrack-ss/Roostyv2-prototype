import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Card, PageHeader, buttonClass, formatDate } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { formatUGX } from "@/lib/money";
import { telHref } from "@/lib/content/settings";
import { deleteBooking, saveStaffNote, setBookingStatus } from "../actions";
import { StatusBadge, nightsBetween } from "../status";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await prisma.booking.findUnique({ where: { id } });
  if (!b) notFound();

  const nights = nightsBetween(b.checkIn, b.checkOut);
  const whatsapp = b.phone.replace(/\D/g, "");
  const rows: [string, React.ReactNode][] = [
    ["Room", b.roomName],
    ["Rate", `${formatUGX(b.nightlyRate)} per night`],
    ["Check-in", formatDate(b.checkIn)],
    ["Check-out", formatDate(b.checkOut)],
    ["Nights", nights],
    ["Guests", `${b.adults} adult${b.adults === 1 ? "" : "s"}, ${b.children} child${b.children === 1 ? "" : "ren"}`],
    ["Estimated total", <strong key="t">{formatUGX(nights * b.nightlyRate)}</strong>],
    ["Received", formatDate(b.createdAt, true)],
  ];

  return (
    <>
      <PageHeader
        title={b.fullName}
        description={<span className="inline-flex items-center gap-2">Booking request <StatusBadge status={b.status} /></span>}
        back={{ href: "/admin/bookings", label: "Bookings" }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Stay">
            <dl className="divide-y divide-line text-sm">
              {rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
            {b.message && (
              <div className="mt-4 rounded-lg bg-canvas p-3 text-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Special requests</p>
                <p className="whitespace-pre-line">{b.message}</p>
              </div>
            )}
          </Card>

          <Card title="Staff note" description="Only visible here, never to the guest.">
            <form action={saveStaffNote.bind(null, b.id)} className="space-y-3">
              <textarea
                name="staffNote"
                defaultValue={b.staffNote}
                rows={3}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm focus:border-brand focus:outline-none"
                placeholder="e.g. Confirmed by phone, deposit paid"
              />
              <button type="submit" className={buttonClass.secondary}>Save note</button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Contact the guest">
            <div className="space-y-2 text-sm">
              <a href={telHref(b.phone)} className="block text-brand hover:underline">{b.phone}</a>
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="block text-brand hover:underline">
                  WhatsApp
                </a>
              )}
              <a href={`mailto:${b.email}`} className="block break-all text-brand hover:underline">{b.email}</a>
            </div>
          </Card>

          <Card title="Status">
            <div className="flex flex-col gap-2">
              {b.status !== "CONFIRMED" && (
                <form action={setBookingStatus.bind(null, b.id, "CONFIRMED")}>
                  <button type="submit" className={`${buttonClass.primary} w-full`}>Mark as confirmed</button>
                </form>
              )}
              {b.status !== "CANCELLED" && (
                <form action={setBookingStatus.bind(null, b.id, "CANCELLED")}>
                  <button type="submit" className={`${buttonClass.secondary} w-full`}>Mark as cancelled</button>
                </form>
              )}
              {b.status !== "NEW" && (
                <form action={setBookingStatus.bind(null, b.id, "NEW")}>
                  <button type="submit" className={`${buttonClass.secondary} w-full`}>Move back to new</button>
                </form>
              )}
            </div>
          </Card>

          <form action={deleteBooking.bind(null, b.id)} className="flex justify-end">
            <ConfirmButton message="Delete this booking request? This can't be undone." className={buttonClass.danger}>
              Delete request
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
