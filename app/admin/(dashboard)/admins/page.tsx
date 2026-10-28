import type { Metadata } from "next";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { SimpleForm } from "@/components/admin/simple-form";
import { Badge, Card, PageHeader, formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/db";
import { createAdmin, deleteAdmin } from "./actions";

export const metadata: Metadata = { title: "Admins" };

export default async function AdminsPage() {
  const me = await requireAdmin();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <PageHeader title="Admins" description="Everyone here can sign in and change the whole website." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Accounts" className="lg:col-span-3">
          <ul className="-my-2 divide-y divide-line">
            {admins.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {a.name || a.email} {a.id === me.id && <Badge tone="green">You</Badge>}
                  </span>
                  <span className="block truncate text-xs text-muted">{a.email} &middot; added {formatDate(a.createdAt)}</span>
                </span>
                {a.id !== me.id && admins.length > 1 && (
                  <form action={deleteAdmin.bind(null, a.id)}>
                    <ConfirmButton message={`Remove ${a.email}? They will be signed out straight away.`} className="text-sm text-red-700 hover:underline">
                      Remove
                    </ConfirmButton>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Add an admin" className="lg:col-span-2">
          <SimpleForm
            action={createAdmin}
            submitLabel="Add admin"
            successMessage="Admin added."
            resetOnSuccess
            inputs={[
              { name: "name", label: "Name" },
              { name: "email", label: "Email", type: "email", required: true, autoComplete: "off" },
              {
                name: "password",
                label: "Temporary password",
                type: "password",
                required: true,
                autoComplete: "new-password",
                help: "At least 10 characters. Ask them to change it under My profile.",
              },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
