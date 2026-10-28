import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

/**
 * Image uploads. Every upload is resized and re-encoded as WebP, then stored
 * either in Vercel Blob (when BLOB_READ_WRITE_TOKEN is set - the only option
 * on Vercel, whose filesystem is read-only) or on local disk under
 * public/uploads.
 *
 * A stored value is either an absolute Blob URL or a site-relative
 * "/uploads/..." path. Both work directly as an <img> src.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 85;

export const MAX_UPLOAD_MB = 15;
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** An error message for a bad upload, or null when the file is fine or absent. */
export function validateImageFile(file: File | null): string | null {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Images must be JPEG, PNG or WebP.";
  if (file.size > MAX_UPLOAD_BYTES) return `Images must be smaller than ${MAX_UPLOAD_MB}MB.`;
  return null;
}

export async function saveImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(buffer)
    .rotate() // honour EXIF orientation from phone photos
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  const filename = `${randomUUID()}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(`uploads/${filename}`, webp, {
      access: "public",
      contentType: "image/webp",
    });
    return url;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), webp);
  return `${PUBLIC_PREFIX}/${filename}`;
}

/**
 * Best-effort delete of something saveImage produced. Seeded content points at
 * the theme's own folders (/roosty-photos, /theme/images), which are left
 * alone: only Blob URLs and files under /uploads are ever removed.
 */
export async function deleteUpload(stored: string | null | undefined): Promise<void> {
  if (!stored) return;
  if (/^https?:\/\//.test(stored)) {
    await del(stored).catch(() => {});
    return;
  }
  if (!stored.startsWith(`${PUBLIC_PREFIX}/`)) return;
  const filename = path.basename(stored);
  await unlink(path.join(UPLOAD_DIR, filename)).catch(() => {});
}
