"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/resource-form";
import { Prisma } from "@/generated/prisma/client";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { COLLECTIONS, isCollectionKey, type CollectionDef, type CollectionKey } from "@/lib/content/collections";
import { imagePaths, parseFields, replacedImages, slugify } from "@/lib/content/parse";
import { delegateFor, listOrder, type Row } from "@/lib/content/store";
import { deleteUpload } from "@/lib/storage";

/**
 * Create, edit, delete, reorder and show/hide for every collection. Which
 * list is meant comes from the bound `collection` argument; everything else
 * (fields, model, revalidation) comes from its registry entry.
 */

function refresh(key: CollectionKey, def: CollectionDef) {
  for (const path of def.paths) revalidatePath(path);
  revalidatePath(`/admin/collections/${key}`);
}

function titleOf(def: CollectionDef, row: Record<string, unknown>): string {
  return String(row[def.titleField] ?? "").slice(0, 80) || def.singular;
}

export async function saveItem(
  collection: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const actor = await requireAdmin();
  if (!isCollectionKey(collection)) return { error: "Unknown list." };
  const def: CollectionDef = COLLECTIONS[collection];
  const db = delegateFor(def.model);

  const parsed = await parseFields(def.fields, formData);
  if (!parsed.ok) return { error: parsed.error };
  const data = parsed.data;

  if (def.slugFrom) {
    data.slug = slugify(String(data.slug || data[def.slugFrom] || ""));
    if (!data.slug) return { error: "Short web name can't be empty." };
  }

  let saved: Row;
  let before: Row | null = null;
  try {
    if (id) {
      before = await db.findUnique({ where: { id } });
      if (!before) return { error: `That ${def.singular.toLowerCase()} no longer exists.` };
      saved = await db.update({ where: { id }, data });
    } else {
      if (def.orderBy === "sortOrder") {
        const { _max } = await db.aggregate({ _max: { sortOrder: true } });
        data.sortOrder = (_max.sortOrder ?? -1) + 1;
      }
      saved = await db.create({ data });
    }
  } catch (error) {
    // Don't leave just-uploaded files behind when the write fails.
    for (const url of parsed.newUploads) await deleteUpload(url);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "That short web name is already used. Choose another one." };
    }
    throw error;
  }

  if (before) for (const old of replacedImages(def.fields, before, saved)) await deleteUpload(old);

  await recordAudit(actor, {
    action: `${def.model}.${id ? "update" : "create"}`,
    entity: def.model,
    entityId: saved.id,
    summary: titleOf(def, saved),
  });

  refresh(collection, def);
  redirect(`/admin/collections/${collection}`);
}

export async function deleteItem(collection: string, id: string): Promise<void> {
  const actor = await requireAdmin();
  if (!isCollectionKey(collection)) return;
  const def: CollectionDef = COLLECTIONS[collection];
  const db = delegateFor(def.model);

  const row = await db.findUnique({ where: { id } });
  if (!row) return;
  await db.delete({ where: { id } });
  for (const url of imagePaths(def.fields, row)) await deleteUpload(url);

  await recordAudit(actor, { action: `${def.model}.delete`, entity: def.model, entityId: id, summary: titleOf(def, row) });
  refresh(collection, def);
  redirect(`/admin/collections/${collection}`);
}

export async function togglePublished(collection: string, id: string): Promise<void> {
  const actor = await requireAdmin();
  if (!isCollectionKey(collection)) return;
  const def: CollectionDef = COLLECTIONS[collection];
  const db = delegateFor(def.model);

  const row = await db.findUnique({ where: { id } });
  if (!row) return;
  const published = !row.published;
  await db.update({ where: { id }, data: { published } });

  await recordAudit(actor, {
    action: `${def.model}.${published ? "show" : "hide"}`,
    entity: def.model,
    entityId: id,
    summary: titleOf(def, row),
  });
  refresh(collection, def);
}

/**
 * Swaps an item with its neighbour, then renumbers the whole list 0..n so
 * gaps or duplicate sortOrder values (from manual DB edits, say) heal on the
 * next move instead of making the buttons appear to do nothing.
 */
export async function moveItem(collection: string, id: string, direction: "up" | "down"): Promise<void> {
  const actor = await requireAdmin();
  if (!isCollectionKey(collection)) return;
  const def: CollectionDef = COLLECTIONS[collection];
  if (def.orderBy !== "sortOrder") return;
  const db = delegateFor(def.model);

  const rows = await db.findMany({ orderBy: listOrder(def), select: { id: true, sortOrder: true, [def.titleField]: true } });
  const from = rows.findIndex((r) => r.id === id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= rows.length) return;

  [rows[from], rows[to]] = [rows[to], rows[from]];
  for (const [index, row] of rows.entries()) {
    if (row.sortOrder !== index) await db.update({ where: { id: row.id }, data: { sortOrder: index } });
  }

  await recordAudit(actor, { action: `${def.model}.reorder`, entity: def.model, entityId: id, summary: titleOf(def, rows[to]) });
  refresh(collection, def);
}
