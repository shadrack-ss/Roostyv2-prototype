"use client";

import { ICON_OPTIONS, type Field } from "@/lib/content/fields";
import { ImageField } from "./image-field";
import { RichTextEditor } from "./rich-text-editor";

export const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

type Value = string | number | boolean | null | undefined;

/** "2026-10-04T00:00:00.000Z" or a Date -> "2026-10-04" for a date input. */
function dateValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value.slice(0, 10);
  return "";
}

/** One labelled input for any Field. `idPrefix` keeps ids unique when several forms share a page. */
export function FieldRenderer({ field, value, idPrefix = "" }: { field: Field; value: Value | Date; idPrefix?: string }) {
  const id = `${idPrefix}${field.name}`;
  const text = value === null || value === undefined ? "" : String(value);

  if (field.type === "toggle") {
    return (
      <label className="flex items-start gap-3 rounded-lg border border-line px-3 py-2.5">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={value === true}
          className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
        />
        <span>
          <span className="block text-sm font-medium">{field.label}</span>
          {field.help && <span className="block text-xs text-muted">{field.help}</span>}
        </span>
      </label>
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea id={id} name={field.name} defaultValue={text} rows={field.rows ?? 3} required={field.required} placeholder={field.placeholder} className={inputClass} />
      );
      break;
    case "richtext":
      control = <RichTextEditor name={field.name} id={id} defaultValue={text} />;
      break;
    case "image":
      control = <ImageField name={field.name} id={id} value={text} required={field.required} />;
      break;
    case "number":
      control = (
        <input id={id} name={field.name} type="number" step={1} min={field.min} defaultValue={text} required={field.required} className={inputClass} />
      );
      break;
    case "date":
      control = <input id={id} name={field.name} type="date" defaultValue={dateValue(value)} required={field.required} className={inputClass} />;
      break;
    case "select":
    case "icon": {
      const options = field.type === "icon" ? ICON_OPTIONS : (field.options ?? []);
      control = (
        <select id={id} name={field.name} defaultValue={text} required={field.required} className={inputClass}>
          {!field.required && <option value="">None</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    }
    default:
      control = (
        <input
          id={id}
          name={field.name}
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          defaultValue={text}
          required={field.required}
          placeholder={field.placeholder}
          className={inputClass}
        />
      );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {field.label}
        {!field.required && field.type !== "image" && field.type !== "richtext" && (
          <span className="ml-1 font-normal text-muted">(optional)</span>
        )}
      </label>
      {control}
      {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
    </div>
  );
}

/** Lays fields out in a two-column grid, honouring field.half. */
export function FieldGrid({ fields, values, idPrefix }: { fields: Field[]; values: Record<string, unknown>; idPrefix?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.half ? "" : "sm:col-span-2"}>
          <FieldRenderer field={field} value={values[field.name] as Value | Date} idPrefix={idPrefix} />
        </div>
      ))}
    </div>
  );
}
