"use client";

import { useActionState, useId } from "react";
import type { Field } from "@/lib/content/fields";
import { FieldGrid } from "./field-renderer";
import { buttonClass } from "./ui";

export type FormState = { error?: string; saved?: number };

export type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;

/**
 * The one form used for settings, page sections and collection items. Give
 * it fields (or fieldsets), current values and a server action; it renders
 * the inputs and the save/error feedback.
 *
 * `saved` is a timestamp rather than a boolean so two saves in a row still
 * re-render the "Saved" note.
 */
export function ResourceForm({
  action,
  fields,
  fieldsets,
  values,
  submitLabel = "Save changes",
}: {
  action: FormAction;
  fields?: Field[];
  fieldsets?: { title: string; description?: string; fields: Field[] }[];
  values: Record<string, unknown>;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const idPrefix = useId();

  return (
    <form action={formAction} className="space-y-6">
      {fields && <FieldGrid fields={fields} values={values} idPrefix={idPrefix} />}

      {fieldsets?.map((set) => (
        <fieldset key={set.title} className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <legend className="px-1 font-semibold">{set.title}</legend>
          {set.description && <p className="-mt-1 mb-4 text-sm text-muted">{set.description}</p>}
          <FieldGrid fields={set.fields} values={values} idPrefix={idPrefix} />
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? "Saving..." : submitLabel}
        </button>
        {state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
        {!state.error && state.saved && !pending && <p className="text-sm text-brand" role="status">Saved.</p>}
      </div>
    </form>
  );
}
