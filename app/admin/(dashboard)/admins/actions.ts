"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/components/admin/resource-form";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

const MIN_PASSWORD = 10;

const newAdminSchema = z.object({
  name: z.string().trim().max(120),
  email: z.email("Enter a valid email address.").transform((e) => e.toLowerCase().trim()),
  password: z.string().min(MIN_PASSWORD, `Passwords need at least ${MIN_PASSWORD} characters.`),
});

export async function createAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const parsed = newAdminSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { name, email, password } = parsed.data;
  if (await prisma.admin.findUnique({ where: { email } })) return { error: "There is already an admin with that email." };

  const admin = await prisma.admin.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  await recordAudit(actor, { action: "admin.create", entity: "Admin", entityId: admin.id, summary: email });
  revalidatePath("/admin/admins");
  return { saved: Date.now() };
}

export async function deleteAdmin(id: string): Promise<void> {
  const actor = await requireAdmin();
  // Never lock everyone out: you can't remove yourself or the last admin.
  if (id === actor.id) return;
  if ((await prisma.admin.count()) <= 1) return;

  const admin = await prisma.admin.delete({ where: { id } });
  await recordAudit(actor, { action: "admin.delete", entity: "Admin", entityId: id, summary: admin.email });
  revalidatePath("/admin/admins");
}

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  await prisma.admin.update({ where: { id: actor.id }, data: { name } });
  await recordAudit(actor, { action: "admin.profile", entity: "Admin", entityId: actor.id, summary: actor.email });
  revalidatePath("/admin", "layout");
  return { saved: Date.now() };
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const admin = await prisma.admin.findUnique({ where: { id: actor.id } });
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) return { error: "Your current password is not right." };
  if (next.length < MIN_PASSWORD) return { error: `Passwords need at least ${MIN_PASSWORD} characters.` };
  if (next !== confirm) return { error: "The two new passwords don't match." };

  await prisma.admin.update({ where: { id: actor.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  await recordAudit(actor, { action: "admin.password", entity: "Admin", entityId: actor.id, summary: actor.email });
  return { saved: Date.now() };
}
