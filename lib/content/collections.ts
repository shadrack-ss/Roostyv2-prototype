import type { Field } from "./fields";

/**
 * Every repeating list on the site. One entry here plus one Prisma model is
 * all a new list needs: the admin list, create, edit, reorder and delete
 * screens are generic and read everything they need from this file.
 *
 * Every model listed must have `published` and `sortOrder` columns, except
 * where `orderBy` says otherwise (posts are ordered by date).
 */

export type ColumnKind = "text" | "image" | "money" | "date" | "toggle";

export type CollectionDef = {
  label: string;
  singular: string;
  description: string;
  /** Prisma delegate name, e.g. "room" for prisma.room. */
  model: "heroSlide" | "room" | "service" | "amenity" | "galleryImage" | "testimonial" | "teamMember" | "post";
  fields: Field[];
  /** Field shown as the row's name in lists and the activity log. */
  titleField: string;
  columns: { field: string; label: string; kind?: ColumnKind }[];
  orderBy: "sortOrder" | "date";
  /** Public paths that show this list, revalidated after every change. */
  paths: string[];
  /** Field whose value a blank slug is generated from, for models with a slug. */
  slugFrom?: string;
};

const published: Field = {
  name: "published",
  label: "Show on the website",
  type: "toggle",
  help: "Turn off to hide this item without deleting it.",
};

export const COLLECTIONS = {
  heroSlides: {
    label: "Hero slides",
    singular: "Hero slide",
    description: "The photos that crossfade behind the homepage headline.",
    model: "heroSlide",
    fields: [
      { name: "imageUrl", label: "Photo", type: "image", required: true, help: "Wide landscape photos work best." },
      { name: "alt", label: "Description", type: "text", help: "Describes the photo for screen readers." },
      published,
    ],
    titleField: "alt",
    columns: [
      { field: "imageUrl", label: "Photo", kind: "image" },
      { field: "alt", label: "Description" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/"],
  },
  rooms: {
    label: "Rooms",
    singular: "Room",
    description: "Every room type. Shown on the Rooms page, the booking form, and (when marked) the homepage.",
    model: "room",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      {
        name: "slug",
        label: "Short web name",
        type: "text",
        half: true,
        help: "Lowercase letters, numbers and hyphens. Leave empty to make one from the name.",
      },
      { name: "price", label: "Price per night (UGX)", type: "number", required: true, min: 0, half: true },
      { name: "capacity", label: "Sleeps up to", type: "number", required: true, min: 1, half: true },
      { name: "size", label: "Size", type: "text", placeholder: "e.g. 190 sqm", half: true },
      { name: "imageUrl", label: "Photo", type: "image", required: true },
      { name: "description", label: "Short description", type: "textarea", rows: 3 },
      { name: "featured", label: "Show on homepage", type: "toggle" },
      published,
    ],
    titleField: "name",
    columns: [
      { field: "imageUrl", label: "Photo", kind: "image" },
      { field: "name", label: "Name" },
      { field: "price", label: "Per night", kind: "money" },
      { field: "capacity", label: "Sleeps" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/", "/rooms", "/book"],
    slugFrom: "name",
  },
  services: {
    label: "Services",
    singular: "Service",
    description: "The alternating photo-and-text blocks on the Services page.",
    model: "service",
    fields: [
      { name: "eyebrow", label: "Small label", type: "text", placeholder: "e.g. Eat", half: true },
      { name: "title", label: "Title", type: "text", required: true, half: true },
      { name: "body", label: "Text", type: "richtext" },
      { name: "imageUrl", label: "Photo", type: "image", required: true, half: true },
      { name: "alt", label: "Photo description", type: "text", half: true },
      { name: "buttonLabel", label: "Button text", type: "text", half: true, help: "Leave empty for no button." },
      { name: "buttonHref", label: "Button link", type: "text", half: true },
      published,
    ],
    titleField: "title",
    columns: [
      { field: "imageUrl", label: "Photo", kind: "image" },
      { field: "title", label: "Title" },
      { field: "eyebrow", label: "Label" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/services"],
  },
  amenities: {
    label: "Amenities",
    singular: "Amenity",
    description: "The icon grid on the Home, Services and About pages.",
    model: "amenity",
    fields: [
      { name: "label", label: "Label", type: "text", required: true, half: true },
      { name: "icon", label: "Icon", type: "icon", required: true, half: true },
      published,
    ],
    titleField: "label",
    columns: [
      { field: "label", label: "Label" },
      { field: "icon", label: "Icon" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/", "/services", "/about"],
  },
  gallery: {
    label: "Gallery",
    singular: "Photo",
    description: "The photo grid on the Home and About pages. Clicking a photo opens it full size.",
    model: "galleryImage",
    fields: [
      { name: "imageUrl", label: "Photo", type: "image", required: true },
      { name: "alt", label: "Description", type: "text", help: "Describes the photo for screen readers." },
      published,
    ],
    titleField: "alt",
    columns: [
      { field: "imageUrl", label: "Photo", kind: "image" },
      { field: "alt", label: "Description" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/", "/about"],
  },
  testimonials: {
    label: "Testimonials",
    singular: "Testimonial",
    description: "Guest reviews in the \"What People Say\" carousel on the homepage.",
    model: "testimonial",
    fields: [
      { name: "name", label: "Guest name", type: "text", required: true, half: true },
      { name: "detail", label: "Context", type: "text", placeholder: "e.g. Stayed in the Deluxe Cottage", half: true },
      { name: "quote", label: "Review", type: "textarea", rows: 4, required: true },
      { name: "photoUrl", label: "Photo", type: "image", help: "Optional. Without one, the guest's initials are shown." },
      published,
    ],
    titleField: "name",
    columns: [
      { field: "photoUrl", label: "Photo", kind: "image" },
      { field: "name", label: "Guest" },
      { field: "detail", label: "Context" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/"],
  },
  team: {
    label: "Team",
    singular: "Team member",
    description: "The people shown on the About page.",
    model: "teamMember",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, half: true },
      { name: "role", label: "Role", type: "text", required: true, half: true },
      { name: "bio", label: "Short bio", type: "textarea", rows: 3 },
      { name: "photoUrl", label: "Photo", type: "image", help: "Optional. Without one, their initials are shown." },
      published,
    ],
    titleField: "name",
    columns: [
      { field: "photoUrl", label: "Photo", kind: "image" },
      { field: "name", label: "Name" },
      { field: "role", label: "Role" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "sortOrder",
    paths: ["/about"],
  },
  posts: {
    label: "Posts",
    singular: "Post",
    description: "News and events, newest first. Shown on the Events page and in Latest Updates on the homepage.",
    model: "post",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true, half: true },
      { name: "author", label: "Author", type: "text", half: true, placeholder: "e.g. The Haven Homes Team" },
      { name: "excerpt", label: "Text", type: "textarea", rows: 4, required: true },
      { name: "imageUrl", label: "Photo", type: "image" },
      published,
    ],
    titleField: "title",
    columns: [
      { field: "imageUrl", label: "Photo", kind: "image" },
      { field: "title", label: "Title" },
      { field: "date", label: "Date", kind: "date" },
      { field: "published", label: "Visible", kind: "toggle" },
    ],
    orderBy: "date",
    paths: ["/", "/events"],
  },
} satisfies Record<string, CollectionDef>;

export type CollectionKey = keyof typeof COLLECTIONS;

export function isCollectionKey(key: string): key is CollectionKey {
  return key in COLLECTIONS;
}

export function getCollection(key: CollectionKey): CollectionDef {
  return COLLECTIONS[key];
}
