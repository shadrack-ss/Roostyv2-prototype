import { z } from "zod";
import { sanitizeRichText } from "@/lib/sanitize";
import { saveImage, validateImageFile } from "@/lib/storage";
import type { Field } from "./fields";

/**
 * Turns a submitted admin form back into typed values, using the same field
 * list that drew the form. Shared by settings, sections and collections.
 *
 * Image fields arrive as two inputs: `<name>` (an optional new upload) and
 * `<name>__url` (the current path, editable so an existing image can be
 * pointed at directly or cleared). An upload wins over the text box.
 */

export type ParsedValue = string | number | boolean | Date;

export type ParseResult =
  | { ok: true; data: Record<string, ParsedValue>; newUploads: string[] }
  | { ok: false; error: string };

const email = z.email();
const httpUrl = z.url({ protocol: /^https?$/ });

export async function parseFields(fields: Field[], formData: FormData): Promise<ParseResult> {
  const data: Record<string, ParsedValue> = {};
  const newUploads: string[] = [];

  // Validate every upload before saving any, so a bad second file doesn't
  // leave an orphaned first one on disk.
  for (const field of fields) {
    if (field.type !== "image") continue;
    const error = validateImageFile(formData.get(field.name) as File | null);
    if (error) return { ok: false, error: `${field.label}: ${error}` };
  }

  for (const field of fields) {
    const raw = formData.get(field.name);
    const text = typeof raw === "string" ? raw.trim() : "";

    switch (field.type) {
      case "toggle":
        data[field.name] = raw === "on";
        continue;

      case "number": {
        if (text === "") {
          if (field.required) return { ok: false, error: `${field.label} is required.` };
          data[field.name] = 0;
          continue;
        }
        const n = Number(text.replace(/,/g, ""));
        if (!Number.isInteger(n)) return { ok: false, error: `${field.label} must be a whole number.` };
        if (field.min !== undefined && n < field.min) {
          return { ok: false, error: `${field.label} must be at least ${field.min}.` };
        }
        data[field.name] = n;
        continue;
      }

      case "date": {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
          if (field.required) return { ok: false, error: `${field.label} is required.` };
          continue;
        }
        // Stored as midnight UTC so the calendar day never shifts with the
        // server's timezone.
        data[field.name] = new Date(`${text}T00:00:00.000Z`);
        continue;
      }

      case "image": {
        const file = raw as File | null;
        let value = String(formData.get(`${field.name}__url`) ?? "").trim();
        if (file && typeof file !== "string" && file.size > 0) {
          value = await saveImage(file);
          newUploads.push(value);
        }
        if (field.required && !value) return { ok: false, error: `${field.label} is required.` };
        data[field.name] = value;
        continue;
      }

      case "richtext": {
        const clean = sanitizeRichText(typeof raw === "string" ? raw : "");
        const empty = clean.replace(/<[^>]*>/g, "").trim() === "";
        if (field.required && empty) return { ok: false, error: `${field.label} is required.` };
        data[field.name] = empty ? "" : clean;
        continue;
      }

      default: {
        if (field.required && !text) return { ok: false, error: `${field.label} is required.` };
        if (text && field.type === "email" && !email.safeParse(text).success) {
          return { ok: false, error: `${field.label} must be a valid email address.` };
        }
        if (text && field.type === "url" && !httpUrl.safeParse(text).success) {
          return { ok: false, error: `${field.label} must be a full link starting with http:// or https://.` };
        }
        data[field.name] = text;
      }
    }
  }

  return { ok: true, data, newUploads };
}

/** Image values that were in `before` but are gone from `after` - candidates for deletion. */
export function replacedImages(fields: Field[], before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const field of fields) {
    if (field.type !== "image") continue;
    const old = before[field.name];
    if (typeof old === "string" && old !== "" && old !== after[field.name]) out.push(old);
  }
  return out;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
