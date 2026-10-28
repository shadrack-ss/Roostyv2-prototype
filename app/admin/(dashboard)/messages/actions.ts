"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { recordAudit, requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin", "layout");
  if (!read) redirect("/admin/messages");
}

export async function deleteMessage(id: string): Promise<void> {
  const actor = await requireAdmin();
  const message = await prisma.contactMessage.delete({ where: { id } });
  await recordAudit(actor, { action: "message.delete", entity: "ContactMessage", entityId: id, summary: message.name });
  revalidatePath("/admin", "layout");
  redirect("/admin/messages");
}
