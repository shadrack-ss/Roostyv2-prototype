import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ResourceForm } from "@/components/admin/resource-form";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";
import { COLLECTIONS, isCollectionKey } from "@/lib/content/collections";
import { delegateFor } from "@/lib/content/store";
import { deleteItem, saveItem } from "../actions";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionKey(collection) ? `Edit ${COLLECTIONS[collection].singular.toLowerCase()}` : "Edit" };
}

export default async function EditItemPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) notFound();
  const def = COLLECTIONS[collection];

  const row = await delegateFor(def.model).findUnique({ where: { id } });
  if (!row) notFound();
  const name = String(row[def.titleField] || def.singular);

  return (
    <>
      <PageHeader title={name} back={{ href: `/admin/collections/${collection}`, label: def.label }} />
      <Card>
        <ResourceForm action={saveItem.bind(null, collection, id)} fields={def.fields} values={row} />
      </Card>
      <form action={deleteItem.bind(null, collection, id)} className="mt-6 flex justify-end">
        <ConfirmButton message={`Delete "${name}"? This can't be undone.`} className={buttonClass.danger}>
          Delete {def.singular.toLowerCase()}
        </ConfirmButton>
      </form>
    </>
  );
}
