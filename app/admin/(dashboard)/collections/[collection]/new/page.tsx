import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/resource-form";
import { Card, PageHeader } from "@/components/admin/ui";
import { COLLECTIONS, isCollectionKey } from "@/lib/content/collections";
import { saveItem } from "../actions";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionKey(collection) ? `New ${COLLECTIONS[collection].singular.toLowerCase()}` : "New" };
}

export default async function NewItemPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();
  const def = COLLECTIONS[collection];

  // New items start visible (and rooms start on the homepage); posts default to today.
  const defaults: Record<string, unknown> = { published: true, featured: true, date: new Date() };

  return (
    <>
      <PageHeader title={`New ${def.singular.toLowerCase()}`} back={{ href: `/admin/collections/${collection}`, label: def.label }} />
      <Card>
        <ResourceForm
          action={saveItem.bind(null, collection, null)}
          fields={def.fields}
          values={defaults}
          submitLabel={`Add ${def.singular.toLowerCase()}`}
        />
      </Card>
    </>
  );
}
