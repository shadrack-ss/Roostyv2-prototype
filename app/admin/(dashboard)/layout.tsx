import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth-guard";
import { getSettings } from "@/lib/content/queries";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [settings, bookings, messages] = await Promise.all([
    getSettings(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell
      brandName={settings.brandName}
      initials={settings.initials}
      admin={{ name: admin.name, email: admin.email }}
      counts={{ bookings, messages }}
    >
      {children}
    </AdminShell>
  );
}
