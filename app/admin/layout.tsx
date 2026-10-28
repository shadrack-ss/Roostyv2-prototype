import type { Metadata } from "next";
import "./admin.css";

// The admin is its own root layout (the public site's is app/(site)/layout.tsx),
// so none of the theme's Bootstrap, jQuery or fonts load here.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s - Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
