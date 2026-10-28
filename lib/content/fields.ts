/**
 * The field vocabulary every admin form is built from. Settings, page
 * sections and collection items all describe themselves as a list of these,
 * and one renderer (components/admin/field-renderer.tsx) plus one parser
 * (lib/content/parse.ts) handle all three.
 *
 * Plain data only - no functions - so a field list can be passed straight
 * from a server component to the client-side form.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "url"
  | "email"
  | "number"
  | "toggle"
  | "select"
  | "date"
  | "icon";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** For "select". */
  options?: { value: string; label: string }[];
  /** For "textarea". */
  rows?: number;
  /** Lay the field out at half width on wide screens. */
  half?: boolean;
  /** For "number". */
  min?: number;
};

export type FieldValues = Record<string, string | number | boolean | Date | null>;

/** The icons available in the theme's flaticon font. */
export const ICON_OPTIONS = [
  { value: "flaticon-pool", label: "Pool table" },
  { value: "flaticon-desk", label: "Reception desk" },
  { value: "flaticon-exit", label: "Secure exit" },
  { value: "flaticon-parking", label: "Parking" },
  { value: "flaticon-hair-dryer", label: "Hair dryer" },
  { value: "flaticon-minibar", label: "Minibar" },
  { value: "flaticon-drink", label: "Drink" },
  { value: "flaticon-tray", label: "Room service tray" },
  { value: "flaticon-cab", label: "Taxi" },
  { value: "flaticon-tv", label: "Television" },
];

/** Tokens any section or setting text may contain, filled in when the page renders. */
export const TOKEN_HELP = "You can write {brand}, {phone} or {email} and they are filled in from Site settings.";
