import { connection } from "next/server";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS, fillTokens, type Settings } from "./settings";
import { SECTIONS, type SectionData, type SectionKey } from "./sections";

/**
 * Every public read goes through here. Each function is wrapped in React's
 * cache(), so a page and its layout asking for the same thing share one query
 * per request.
 *
 * connection() marks these reads as request-time: pages render from the
 * database on each visit (admin edits show up straight away) and `next build`
 * never needs a database.
 */

export const getSettings = cache(async (): Promise<Settings> => {
  await connection();
  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!row) return DEFAULT_SETTINGS;
  // Only the known keys, so the row's id/updatedAt never reach client props.
  return Object.fromEntries(
    Object.keys(DEFAULT_SETTINGS).map((key) => [key, row[key as keyof Settings]]),
  ) as Settings;
});

const getSectionRows = cache(async () => {
  await connection();
  const rows = await prisma.pageSection.findMany();
  return new Map(rows.map((row) => [row.key, row.data as Record<string, unknown>]));
});

/**
 * One section's copy: saved values merged over the registry defaults, with
 * {brand}/{phone}/{email} filled in. Only keys the registry knows are taken
 * from the row, so a field removed from the registry simply stops appearing.
 */
export async function getSection<K extends SectionKey>(key: K): Promise<SectionData<K>> {
  const [rows, settings] = await Promise.all([getSectionRows(), getSettings()]);
  const defaults = SECTIONS[key].defaults as Record<string, string>;
  const saved = rows.get(key) ?? {};
  const out: Record<string, string> = {};
  for (const name of Object.keys(defaults)) {
    const value = typeof saved[name] === "string" ? (saved[name] as string) : defaults[name];
    out[name] = fillTokens(value, settings);
  }
  return out as SectionData<K>;
}

/**
 * For the admin form: saved values merged over defaults with tokens left as
 * typed, plus whether the block has been edited at all.
 */
export async function getSectionForEditing(
  key: SectionKey,
): Promise<{ values: Record<string, string>; customised: boolean }> {
  const row = await prisma.pageSection.findUnique({ where: { key } });
  const saved = (row?.data ?? {}) as Record<string, unknown>;
  const defaults = SECTIONS[key].defaults as Record<string, string>;
  const values = Object.fromEntries(
    Object.keys(defaults).map((name) => [name, typeof saved[name] === "string" ? saved[name] : defaults[name]]),
  ) as Record<string, string>;
  return { values, customised: row !== null };
}

// --- Collections ------------------------------------------------------------

const visible = { where: { published: true }, orderBy: { sortOrder: "asc" as const } };

export const getHeroSlides = cache(async () => {
  await connection();
  return prisma.heroSlide.findMany(visible);
});

export const getRooms = cache(async () => {
  await connection();
  return prisma.room.findMany(visible);
});

/** One published room for its own page, or null so the page can 404. */
export const getRoomBySlug = cache(async (slug: string) => {
  await connection();
  return prisma.room.findFirst({ where: { slug, published: true } });
});

export const getServices = cache(async () => {
  await connection();
  return prisma.service.findMany(visible);
});

export const getAmenities = cache(async () => {
  await connection();
  return prisma.amenity.findMany(visible);
});

export const getGallery = cache(async () => {
  await connection();
  return prisma.galleryImage.findMany(visible);
});

export const getTestimonials = cache(async () => {
  await connection();
  return prisma.testimonial.findMany(visible);
});

export const getTeam = cache(async () => {
  await connection();
  return prisma.teamMember.findMany(visible);
});

export const getPosts = cache(async () => {
  await connection();
  return prisma.post.findMany({ where: { published: true }, orderBy: { date: "desc" } });
});
