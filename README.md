# Haven Homes - hotel & lodge website template

A website for a guesthouse, lodge or small hotel: rooms with prices, services,
events, an online booking request form and a contact form. The public site is
built on a Bootstrap theme. Every piece of text, every photo and every list on
it is editable from the admin dashboard at `/admin`.

The demo content is a fictional lodge called **Haven Homes**. To rebrand,
change the name, logo initials and contact details in **Admin > Site settings**.

## Stack

- **Next.js 16** (App Router, server components, server actions). This
  version has breaking changes from older Next.js, so check
  `node_modules/next/dist/docs/` before writing framework code (see `AGENTS.md`).
- **PostgreSQL** via **Prisma 7** and the `@prisma/adapter-pg` driver adapter.
  The client is generated into `generated/prisma` on `npm install`.
- **Auth.js v5** credentials sign-in for admins (bcrypt hashes, JWT sessions).
  There is no public sign-up.
- **Tailwind CSS v4** for the admin only (`app/admin/admin.css`). The public
  site keeps the vendored theme under `public/theme`.
- **Nodemailer** for booking and message alerts (optional).
- **Image uploads** go to `public/uploads` locally, or to Vercel Blob when
  `BLOB_READ_WRITE_TOKEN` is set. Every upload is resized and converted to WebP.

## Getting started

```bash
npm install
cp .env.example .env        # then fill in AUTH_SECRET and ADMIN_PASSWORD
docker compose up -d        # local Postgres on port 5434 (or set your own DATABASE_URL)
npx prisma migrate deploy   # create the tables
npm run db:seed             # first admin + Haven Homes demo content
npm run dev                 # http://localhost:3000, admin at /admin
```

Generate `AUTH_SECRET` with `npx auth secret`. The seed creates the admin
account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Change that password after the
first sign-in (Admin > My profile).

The seed is safe to re-run. It only fills lists that are empty, so it never
duplicates items or overwrites edits.

## Environment variables

See `.env.example` for annotated defaults.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. |
| `AUTH_SECRET` | Signs admin sessions. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The first admin, created by `npm run db:seed`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Outgoing mail. Leave `SMTP_PASSWORD` empty to turn email off; requests still land in the admin inbox. |
| `NOTIFY_TO`, `MAIL_FROM_NAME` | Fallback alert address and sender name. The admin's "Send alerts to" setting wins. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for uploads (required on Vercel, whose filesystem is read-only). |

## How content is organised

All content falls into one of three kinds. Each kind has one storage pattern
and one admin screen.

| Kind | What it is | Defined in | Edited at |
| --- | --- | --- | --- |
| **Settings** | Brand name, logo initials, address, phones, emails, social links, SEO | `lib/content/settings.ts` -> `SiteSettings` table (one row) | `/admin/settings` |
| **Sections** | Fixed blocks of copy on a page: headings, paragraphs, buttons, banner photos | `lib/content/sections.ts` -> `PageSection` table (one JSON row per block) | `/admin/pages/<page>` |
| **Collections** | Repeating lists: hero slides, rooms, services, amenities, gallery, testimonials, team, posts | `lib/content/collections.ts` -> one Prisma model per list | `/admin/collections/<list>` |

The bookings inbox, messages inbox, admin accounts and activity log are
separate screens built on their own tables.

Every admin form is generated from a list of fields (`lib/content/fields.ts`),
so the same form, parser (`lib/content/parse.ts`) and table power all of
these screens.

Section text may contain `{brand}`, `{phone}` and `{email}`. These are
filled in from Site settings when the page renders, so copy follows a rebrand
automatically.

### Adding a block of text to a page

1. Add an entry to `SECTIONS` in `lib/content/sections.ts` with its `page`,
   `fields` and `defaults`.
2. Read it in the page with `await getSection("<page>.<block>")`.

No migration is needed. The block shows its defaults until someone edits it in
the admin, and the admin page for that site page picks it up automatically.

### Adding a new list

1. Add a Prisma model with `published Boolean @default(true)` and
   `sortOrder Int @default(0)`, then run `npx prisma migrate dev`.
2. Add an entry to `COLLECTIONS` in `lib/content/collections.ts` with its
   fields, table columns and the public paths that show it.
3. Add a cached reader to `lib/content/queries.ts` and use it in the page.

The sidebar entry and the list, create, edit, reorder, show/hide and delete
screens all come from the registry.

## Project layout

```
app/
  (site)/          public website (its own root layout with the theme)
  admin/           admin dashboard (its own root layout with Tailwind)
  api/auth/        Auth.js route
  uploads/         serves uploaded images at request time
components/
  admin/           generic admin UI: shell, field renderer, forms
  site/            public blocks shared by several pages
lib/
  content/         registries (settings, sections, collections) + reads/parsing
  admin/nav.ts     admin sidebar, built from the registries
  auth*.ts         sign-in, admin guard, audit log
  public-actions.ts  booking and contact submissions
prisma/            schema, migrations, seed
proxy.ts           sends signed-out visitors on /admin to the login page
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server (the build does not need a database) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create and apply a migration after a schema change |
| `npm run db:seed` | Seed the first admin and demo content |
