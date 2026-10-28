"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/content/queries";
import { notifyAddress, sendMail } from "@/lib/mailer";
import { formatUGX } from "@/lib/money";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * The only two writes the public site can make. Both are unauthenticated, so
 * both validate everything server-side (the client checks are a convenience),
 * rate-limit by IP, save first and email second: a failed email never loses
 * a request.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date.");

const bookingSchema = z
  .object({
    roomId: z.string().min(1, "Choose a room."),
    fullName: z.string().trim().min(1, "Please enter your full name.").max(120),
    email: z.email("That email address doesn't look right.").max(200),
    phone: z.string().trim().min(5, "Please enter a phone number.").max(40),
    checkIn: isoDate,
    checkOut: isoDate,
    adults: z.coerce.number().int().min(1).max(20),
    children: z.coerce.number().int().min(0).max(20),
    message: z.string().trim().max(2000).default(""),
  })
  .refine((b) => b.checkOut > b.checkIn, { message: "Check-out must be after check-in.", path: ["checkOut"] });

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingResult = { ok: true } | { ok: false; error: string };

const DAY_MS = 86_400_000;

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  if (!rateLimit(`booking:${await clientIp()}`, 5, 600).ok) {
    return { ok: false, error: "Too many requests from your connection. Please wait a few minutes or call us." };
  }

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const b = parsed.data;

  // Past dates are rejected against the server's clock with a day of slack,
  // so a guest a timezone ahead of the server can still book "today".
  const checkIn = new Date(`${b.checkIn}T00:00:00Z`);
  const checkOut = new Date(`${b.checkOut}T00:00:00Z`);
  if (checkIn.getTime() < Date.now() - 2 * DAY_MS) return { ok: false, error: "Check-in can't be in the past." };

  const room = await prisma.room.findFirst({ where: { id: b.roomId, published: true } });
  if (!room) return { ok: false, error: "That room is no longer available. Please choose another." };

  const booking = await prisma.booking.create({
    data: {
      roomId: room.id,
      roomName: room.name,
      nightlyRate: room.price,
      fullName: b.fullName,
      email: b.email,
      phone: b.phone,
      checkIn,
      checkOut,
      adults: b.adults,
      children: b.children,
      message: b.message,
    },
  });

  const settings = await getSettings();
  const to = notifyAddress(settings.notifyEmail);
  if (to) {
    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS);
    await sendMail({
      to,
      replyTo: b.email,
      subject: `New booking request: ${room.name}, ${b.checkIn}`,
      text: [
        `${b.fullName} has requested a booking.`,
        "",
        `Room: ${room.name} (${formatUGX(room.price)} per night)`,
        `Dates: ${b.checkIn} to ${b.checkOut} (${nights} night${nights === 1 ? "" : "s"})`,
        `Guests: ${b.adults} adult(s), ${b.children} child(ren)`,
        `Estimated total: ${formatUGX(nights * room.price)}`,
        `Phone: ${b.phone}`,
        `Email: ${b.email}`,
        b.message ? `\nRequests:\n${b.message}` : "",
        "",
        `Open it in the admin: /admin/bookings/${booking.id}`,
      ].join("\n"),
    });
  }

  return { ok: true };
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.email("That email address doesn't look right.").max(200),
  subject: z.string().trim().max(200).default(""),
  message: z.string().trim().min(1, "Please write a message.").max(5000),
});

export type ContactState = { error?: string; sent?: boolean };

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: a hidden field people never see. Bots that fill every input get
  // a normal-looking success and nothing is saved.
  if (formData.get("website")) return { sent: true };

  if (!rateLimit(`contact:${await clientIp()}`, 5, 600).ok) {
    return { error: "Too many messages from your connection. Please wait a few minutes." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") ?? "",
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  const m = parsed.data;

  await prisma.contactMessage.create({ data: m });

  const settings = await getSettings();
  const to = notifyAddress(settings.notifyEmail);
  if (to) {
    await sendMail({
      to,
      replyTo: m.email,
      subject: `New message from ${m.name}${m.subject ? `: ${m.subject}` : ""}`,
      text: `${m.name} <${m.email}> wrote:\n\n${m.message}`,
    });
  }

  return { sent: true };
}
