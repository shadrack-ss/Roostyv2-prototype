import type { Metadata } from "next";
import { SimpleForm } from "@/components/admin/simple-form";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth-guard";
import { changePassword, updateProfile } from "../admins/actions";

export const metadata: Metadata = { title: "My profile" };

export default async function ProfilePage() {
  const me = await requireAdmin();

  return (
    <>
      <PageHeader title="My profile" description={`Signed in as ${me.email}.`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Your name">
          <SimpleForm action={updateProfile} submitLabel="Save name" inputs={[{ name: "name", label: "Name", defaultValue: me.name }]} />
        </Card>
        <Card title="Change password">
          <SimpleForm
            action={changePassword}
            submitLabel="Change password"
            successMessage="Password changed."
            resetOnSuccess
            inputs={[
              { name: "current", label: "Current password", type: "password", required: true, autoComplete: "current-password" },
              { name: "next", label: "New password", type: "password", required: true, autoComplete: "new-password", help: "At least 10 characters." },
              { name: "confirm", label: "New password again", type: "password", required: true, autoComplete: "new-password" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
