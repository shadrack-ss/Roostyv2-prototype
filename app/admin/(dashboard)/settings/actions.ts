"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/admin/resource-form";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { parseFields } from "@/lib/content/parse";
import { SETTINGS_FIELDS } from "@/lib/content/settings";
import { prisma } from "@/lib/db";

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireAdmin();

  const parsed = await parseFields(SETTINGS_FIELDS, formData);
  if (!parsed.ok) return { error: parsed.error };

  const data = parsed.data as Record<string, string>;
  data.initials = data.initials.toUpperCase().slice(0, 3);

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  await recordAudit(actor, { action: "settings.update", entity: "SiteSettings", summary: "Site settings" });

  // Brand and contact details appear in the header and footer of every page.
  revalidatePath("/", "layout");
  return { saved: Date.now() };
}
