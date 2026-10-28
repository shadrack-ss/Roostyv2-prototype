import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type AdminActor = { id: string; email: string; name: string };

/**
 * First line of every admin page and every mutating server action.
 *
 * proxy.ts already bounces signed-out visitors away from /admin pages, but a
 * server action is its own POST endpoint and must not rely on that matcher.
 * The session email is also re-checked against the database each time, so
 * deleting an admin locks them out on their next request rather than when
 * their token happens to expire.
 */
export async function requireAdmin(): Promise<AdminActor> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });
  if (!admin) redirect("/admin/login");

  return admin;
}

type AuditEntry = {
  action: string;
  entity: string;
  entityId?: string | null;
  summary?: string;
};

/**
 * Writes one AuditLog row. Never throws: a failed audit write must not undo
 * or block the change it describes.
 */
export async function recordAudit(actor: AdminActor, entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: actor.id,
        adminEmail: actor.email,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        summary: entry.summary ?? "",
      },
    });
  } catch (error) {
    console.error("[audit] failed to record", entry.action, error);
  }
}
