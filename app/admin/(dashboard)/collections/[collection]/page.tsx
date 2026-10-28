import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, EmptyState, PageHeader, buttonClass, formatDate } from "@/components/admin/ui";
import { COLLECTIONS, isCollectionKey, type CollectionDef } from "@/lib/content/collections";
import { ICON_OPTIONS } from "@/lib/content/fields";
import { delegateFor, listOrder, type Row } from "@/lib/content/store";
import { formatUGX } from "@/lib/money";
import { moveItem, togglePublished } from "./actions";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionKey(collection) ? COLLECTIONS[collection].label : "List" };
}

function Cell({ row, column }: { row: Row; column: CollectionDef["columns"][number] }) {
  const value = row[column.field];
  switch (column.kind) {
    case "image":
      return value ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnails of arbitrary stored paths
        <img src={String(value)} alt="" className="h-11 w-16 rounded-md object-cover" />
      ) : (
        <span className="flex h-11 w-16 items-center justify-center rounded-md bg-canvas text-[10px] text-muted">None</span>
      );
    case "money":
      return <>{formatUGX(Number(value))}</>;
    case "date":
      return <>{value instanceof Date ? formatDate(value) : ""}</>;
    case "toggle":
      return value ? <Badge tone="green">Shown</Badge> : <Badge tone="gray">Hidden</Badge>;
    default: {
      const text = String(value ?? "");
      const icon = ICON_OPTIONS.find((o) => o.value === text);
      return <span className="line-clamp-2">{icon ? icon.label : text}</span>;
    }
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();
  const def: CollectionDef = COLLECTIONS[collection];
  const rows = await delegateFor(def.model).findMany({ orderBy: listOrder(def) });
  const sortable = def.orderBy === "sortOrder";
  const iconButton = "rounded-md border border-line px-2 py-1 text-xs leading-none hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-line disabled:hover:text-current";

  return (
    <>
      <PageHeader
        title={def.label}
        description={def.description}
        action={
          <Link href={`/admin/collections/${collection}/new`} className={buttonClass.primary}>
            Add {def.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        {rows.length === 0 ? (
          <EmptyState>Nothing here yet. Add the first {def.singular.toLowerCase()}.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  {sortable && <th className="w-20 px-4 py-2.5 font-medium">Order</th>}
                  {def.columns.map((c) => (
                    <th key={c.field} className="px-4 py-2.5 font-medium">{c.label}</th>
                  ))}
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row, i) => (
                  <tr key={row.id} className={row.published ? "" : "bg-canvas/60 text-muted"}>
                    {sortable && (
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <form action={moveItem.bind(null, collection, row.id, "up")}>
                            <button type="submit" disabled={i === 0} className={iconButton} aria-label="Move up">&uarr;</button>
                          </form>
                          <form action={moveItem.bind(null, collection, row.id, "down")}>
                            <button type="submit" disabled={i === rows.length - 1} className={iconButton} aria-label="Move down">&darr;</button>
                          </form>
                        </div>
                      </td>
                    )}
                    {def.columns.map((c) => (
                      <td key={c.field} className="max-w-xs px-4 py-2">
                        {c.kind === "toggle" ? (
                          <form action={togglePublished.bind(null, collection, row.id)}>
                            <button type="submit" title="Click to show or hide on the website">
                              <Cell row={row} column={c} />
                            </button>
                          </form>
                        ) : (
                          <Cell row={row} column={c} />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right">
                      <Link href={`/admin/collections/${collection}/${row.id}`} className="font-medium text-brand hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {sortable && rows.length > 1 && (
        <p className="mt-3 text-xs text-muted">The website shows these in the order above. Use the arrows to move items.</p>
      )}
    </>
  );
}
