import { notFound } from 'next/navigation';

// The site and the admin have separate root layouts, so there is no single
// top-level layout for Next's default 404 to render inside. This catch-all
// sends every unknown public URL to app/(site)/not-found.tsx, which renders
// within the site's own header and footer.
export default function Missing() {
  notFound();
}
