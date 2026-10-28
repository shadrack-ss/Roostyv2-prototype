import type { Field } from "./fields";

/**
 * Site-wide brand and contact details: one row (SiteSettings), edited at
 * /admin/settings. Grouped into fieldsets purely for the admin screen.
 */
export const SETTINGS_FIELDSETS: { title: string; description?: string; fields: Field[] }[] = [
  {
    title: "Brand",
    fields: [
      { name: "brandName", label: "Business name", type: "text", required: true, half: true },
      {
        name: "initials",
        label: "Logo initials",
        type: "text",
        required: true,
        half: true,
        help: "One to three letters, shown in the round logo badge.",
      },
      { name: "tagline", label: "Tagline", type: "text" },
      {
        name: "footerBlurb",
        label: "Footer About text",
        type: "textarea",
        rows: 3,
        help: "Also used as the default search engine description.",
      },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "address", label: "Address", type: "text" },
      {
        name: "mapUrl",
        label: "Map link",
        type: "url",
        help: "Where the address in the top bar links to. Leave empty to build a Google Maps search from the address.",
      },
      { name: "phonePrimary", label: "Main phone", type: "text", half: true },
      { name: "phoneSecondary", label: "Second phone", type: "text", half: true },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        type: "text",
        half: true,
        help: "Digits only with country code, e.g. 256700000000. Empty hides WhatsApp links.",
      },
      { name: "emailPrimary", label: "Main email", type: "email", half: true },
      { name: "emailSecondary", label: "Second email", type: "email", half: true },
    ],
  },
  {
    title: "Social links",
    description: "Only the links you fill in are shown in the footer.",
    fields: [
      { name: "facebookUrl", label: "Facebook", type: "url", half: true },
      { name: "instagramUrl", label: "Instagram", type: "url", half: true },
      { name: "xUrl", label: "X (Twitter)", type: "url", half: true },
      { name: "tiktokUrl", label: "TikTok", type: "url", half: true },
      { name: "youtubeUrl", label: "YouTube", type: "url", half: true },
    ],
  },
  {
    title: "Search engines & notifications",
    fields: [
      { name: "seoTitle", label: "Homepage title", type: "text", help: "The browser tab and search result title for the homepage." },
      { name: "seoDescription", label: "Search description", type: "textarea", rows: 2 },
      {
        name: "notifyEmail",
        label: "Send booking and message alerts to",
        type: "email",
        help: "Leave empty to use the email account configured on the server.",
      },
    ],
  },
];

export const SETTINGS_FIELDS: Field[] = SETTINGS_FIELDSETS.flatMap((set) => set.fields);

export type Settings = {
  brandName: string;
  initials: string;
  tagline: string;
  footerBlurb: string;
  address: string;
  mapUrl: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsapp: string;
  emailPrimary: string;
  emailSecondary: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  seoTitle: string;
  seoDescription: string;
  notifyEmail: string;
};

/** Demo values. Used by the seed, and as the fallback before the row exists. */
export const DEFAULT_SETTINGS: Settings = {
  brandName: "Haven Homes",
  initials: "HH",
  tagline: "Comfort, Great Food & Peaceful Stays",
  footerBlurb:
    "Haven Homes offers cozy cottages, a lively bar and restaurant, beautiful gardens, and a fun, safe kids' playground - where comfort meets great food, refreshing drinks, and peaceful stays.",
  address: "12 Garden Road, Your City, Uganda",
  mapUrl: "",
  phonePrimary: "+256 700 000 000",
  phoneSecondary: "+256 780 000 000",
  whatsapp: "256700000000",
  emailPrimary: "info@havenhomes.example",
  emailSecondary: "bookings@havenhomes.example",
  facebookUrl: "https://facebook.com/",
  instagramUrl: "https://instagram.com/",
  xUrl: "https://x.com/",
  tiktokUrl: "",
  youtubeUrl: "",
  seoTitle: "Haven Homes - Comfort, Great Food & Peaceful Stays",
  seoDescription:
    "Cozy cottages, modern apartments, a vibrant bar and restaurant, beautiful gardens and a kids' play area.",
  notifyEmail: "",
};

/** "+256 700 000 000" -> "+256700000000", for tel: links. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(settings: Pick<Settings, "mapUrl" | "address">): string {
  if (settings.mapUrl) return settings.mapUrl;
  return `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`;
}

/** Replaces {brand}, {phone} and {email} in admin-written copy. */
export function fillTokens(text: string, settings: Settings): string {
  return text
    .replaceAll("{brand}", settings.brandName)
    .replaceAll("{phone}", settings.phonePrimary)
    .replaceAll("{email}", settings.emailPrimary);
}
