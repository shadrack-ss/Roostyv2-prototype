import { readFile } from "fs/promises";
import path from "path";
import type { NextRequest } from "next/server";

/**
 * Serves admin uploads from public/uploads at request time. `next start` only
 * knows about the public/ files that existed at boot, so without this an
 * image uploaded afterwards would 404 until the next deploy.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const resolved = path.resolve(UPLOAD_DIR, segments.map((s) => decodeURIComponent(s)).join("/"));

  // Never serve anything outside the uploads folder.
  if (!resolved.startsWith(UPLOAD_DIR + path.sep)) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(resolved);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": MIME[path.extname(resolved).toLowerCase()] ?? "application/octet-stream",
        // Filenames are random UUIDs and never reused, so they can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
