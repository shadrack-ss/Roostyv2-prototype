"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { BookingStatus } from "@/generated/prisma/client";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

const STATUSES: BookingStatus[] = ["NEW", "CONFIRMED", "CANCELLED"];

export async function setBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const actor = await requireAdmin();
  if (!STATUSES.includes(status)) return;

  const booking = await prisma.booking.update({ where: { id }, data: { status } });
  await recordAudit(actor, {
    action: `booking.${status.toLowerCase()}`,
    entity: "Booking",
    entityId: id,
    summary: `${booking.fullName} - ${booking.roomName}`,
  });
  revalidatePath("/admin", "layout");
}

export async function saveStaffNote(id: string, formData: FormData): Promise<void> {
  const actor = await requireAdmin();
  const staffNote = String(formData.get("staffNote") ?? "").trim().slice(0, 4000);

  const booking = await prisma.booking.update({ where: { id }, data: { staffNote } });
  await recordAudit(actor, { action: "booking.note", entity: "Booking", entityId: id, summary: booking.fullName });
  revalidatePath(`/admin/bookings/${id}`);
}

export async function deleteBooking(id: string): Promise<void> {
  const actor = await requireAdmin();
  const booking = await prisma.booking.delete({ where: { id } });
  await recordAudit(actor, {
    action: "booking.delete",
    entity: "Booking",
    entityId: id,
    summary: `${booking.fullName} - ${booking.roomName}`,
  });
  revalidatePath("/admin", "layout");
  redirect("/admin/bookings");
}
