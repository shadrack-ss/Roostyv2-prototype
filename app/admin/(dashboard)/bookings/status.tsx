import type { BookingStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/admin/ui";

export const STATUS_LABEL: Record<BookingStatus, string> = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

const TONE = { NEW: "gold", CONFIRMED: "green", CANCELLED: "gray" } as const;

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <Badge tone={TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  return Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
}
