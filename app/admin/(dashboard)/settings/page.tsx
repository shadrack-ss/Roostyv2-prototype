import type { Metadata } from "next";
import { ResourceForm } from "@/components/admin/resource-form";
import { PageHeader } from "@/components/admin/ui";
import { getSettings } from "@/lib/content/queries";
import { SETTINGS_FIELDSETS } from "@/lib/content/settings";
import { saveSettings } from "./actions";

export const metadata: Metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Your business name, logo initials and contact details. They appear in the header, the footer and across every page."
      />
      <ResourceForm action={saveSettings} fieldsets={SETTINGS_FIELDSETS} values={settings} />
    </>
  );
}
