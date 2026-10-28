import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ResourceForm } from "@/components/admin/resource-form";
import { Card, PageHeader, buttonClass } from "@/components/admin/ui";
import { COLLECTIONS } from "@/lib/content/collections";
import { getSectionForEditing } from "@/lib/content/queries";
import { PAGES, SECTIONS, isPageKey, sectionsForPage } from "@/lib/content/sections";
import { resetSection, saveSection } from "./actions";

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return { title: isPageKey(page) ? `${PAGES[page].label} page` : "Page" };
}

export default async function EditPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!isPageKey(page)) notFound();

  const meta = PAGES[page];
  const keys = sectionsForPage(page);
  const saved = await Promise.all(keys.map((key) => getSectionForEditing(key)));

  return (
    <>
      <PageHeader
        title={page === "shared" ? meta.label : `${meta.label} page`}
        description={
          page === "shared"
            ? "Text that appears on every page."
            : "Each block below is one part of the page, top to bottom. Save each block separately."
        }
        action={
          meta.path && (
            <a href={meta.path} target="_blank" rel="noreferrer" className={buttonClass.secondary}>
              View page
            </a>
          )
        }
      />

      {meta.collections.length > 0 && (
        <p className="mb-6 rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 text-sm">
          Lists on this page:{" "}
          {meta.collections.map((c, i) => (
            <span key={c}>
              {i > 0 && ", "}
              <Link href={`/admin/collections/${c}`} className="font-medium text-brand underline">
                {COLLECTIONS[c].label}
              </Link>
            </span>
          ))}
        </p>
      )}

      <div className="space-y-6">
        {keys.map((key, i) => {
          const section = SECTIONS[key];
          const { values, customised } = saved[i];
          return (
            <Card key={key} title={section.label} description={section.description}>
              {/* Keyed on `customised` so "Restore original text" remounts the
                  form with the defaults; the inputs are uncontrolled and would
                  otherwise keep showing the edited text. */}
              <ResourceForm
                key={customised ? "edited" : "original"}
                action={saveSection.bind(null, key)}
                fields={section.fields}
                values={values}
              />
              {customised && (
                <form action={resetSection.bind(null, key)} className="mt-4 border-t border-line pt-3">
                  <ConfirmButton
                    message="Put this block back to its original text? Your changes to it will be lost."
                    className="text-xs text-muted hover:text-red-700"
                  >
                    Restore original text
                  </ConfirmButton>
                </form>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
