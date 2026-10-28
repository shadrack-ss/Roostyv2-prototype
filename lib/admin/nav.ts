import { COLLECTIONS, type CollectionKey } from "@/lib/content/collections";
import { PAGES, type PageKey } from "@/lib/content/sections";

/**
 * The admin sidebar, built from the content registries: adding a page or a
 * collection there adds its menu entry here with no other change.
 */

export type NavItem = { label: string; href: string; badge?: "bookings" | "messages" };
export type NavGroup = { label: string; items: NavItem[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Inbox",
    items: [
      { label: "Bookings", href: "/admin/bookings", badge: "bookings" },
      { label: "Messages", href: "/admin/messages", badge: "messages" },
    ],
  },
  {
    label: "Pages",
    items: (Object.keys(PAGES) as PageKey[]).map((key) => ({
      label: PAGES[key].label,
      href: `/admin/pages/${key}`,
    })),
  },
  {
    label: "Collections",
    items: (Object.keys(COLLECTIONS) as CollectionKey[]).map((key) => ({
      label: COLLECTIONS[key].label,
      href: `/admin/collections/${key}`,
    })),
  },
  {
    label: "Settings",
    items: [
      { label: "Site settings", href: "/admin/settings" },
      { label: "Admins", href: "/admin/admins" },
      { label: "Activity log", href: "/admin/activity" },
      { label: "My profile", href: "/admin/profile" },
    ],
  },
];

export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
