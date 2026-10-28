"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/admin/resource-form";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { parseFields, replacedImages } from "@/lib/content/parse";
import { getSectionForEditing } from "@/lib/content/queries";
import { SECTIONS, isSectionKey, sectionPaths } from "@/lib/content/sections";
import { prisma } from "@/lib/db";
import { deleteUpload } from "@/lib/storage";

export async function saveSection(key: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  if (!isSectionKey(key)) return { error: "Unknown section." };

  const section = SECTIONS[key];
  const parsed = await parseFields(section.fields, formData);
  if (!parsed.ok) return { error: parsed.error };

  const { values: before } = await getSectionForEditing(key);
  await prisma.pageSection.upsert({
    where: { key },
    update: { data: parsed.data },
    create: { key, data: parsed.data },
  });
  for (const old of replacedImages(section.fields, before, parsed.data)) await deleteUpload(old);

  await recordAudit(actor, { action: "section.update", entity: "PageSection", entityId: key, summary: `${key} (${section.label})` });

  for (const path of sectionPaths(key)) revalidatePath(path, path === "/" ? "layout" : "page");
  return { saved: Date.now() };
}

/** Drops the saved row so the section goes back to its built-in defaults. */
export async function resetSection(key: string): Promise<void> {
  const actor = await requireAdmin();
  if (!isSectionKey(key)) return;

  await prisma.pageSection.deleteMany({ where: { key } });
  await recordAudit(actor, { action: "section.reset", entity: "PageSection", entityId: key, summary: key });

  for (const path of sectionPaths(key)) revalidatePath(path, path === "/" ? "layout" : "page");
  revalidatePath(`/admin/pages/${SECTIONS[key].page}`);
}
