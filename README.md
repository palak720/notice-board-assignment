# The Notice Board

A full CRUD notice board built with **Next.js (Pages Router)** and **Prisma**.
Notices support create, read, update and delete, with Urgent notices always
pinned above Normal ones (sorted in the database, not in the browser).

## Tech stack

- Framework: Next.js 14, **Pages Router** (`pages/`)
- Database access: Prisma ORM
- Database: **Neon** (Postgres), free tier
- Styling: Tailwind CSS
- Hosting: Vercel (Hobby/free tier)

## Project structure

```
pages/
  index.js                 # List page (SSR, Prisma orderBy: Urgent first)
  notices/new.js             # Create form
  notices/[id]/edit.js       # Edit form, pre-filled from Prisma
  api/notices/index.js       # GET (list), POST (create)
  api/notices/[id].js        # GET (one), PUT/PATCH (update), DELETE
components/
  Layout.js, NoticeCard.js, NoticeForm.js, ConfirmDeleteButton.js
lib/
  prisma.js                  # Prisma client singleton
  validateNotice.js          # Server-side validation (used by both API routes)
prisma/
  schema.prisma
```

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up a free hosted database (Neon)**

   - Go to [neon.tech](https://neon.tech), sign up free (no credit card needed).
   - Create a project, then copy the connection string it gives you
     (starts with `postgresql://...` and includes `?sslmode=require`).

   > Any Postgres-compatible free host (e.g. Supabase) or a MySQL-compatible
   > one (e.g. TiDB Cloud) also works — see "Using a different database"
   > below if you switch.

3. **Configure environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Then paste your connection string into it:

   ```
   DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
   ```

4. **Push the schema to your database**

   ```bash
   npx prisma db push
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel (free Hobby tier)

1. Push this repo to a **public** GitHub repository.
2. In Vercel, "Add New Project" → import the repo.
3. Add the `DATABASE_URL` environment variable (same value as your `.env`)
   in the Vercel project settings before deploying.
4. Deploy. Vercel runs `npm run build`, which runs `prisma generate` then
   `next build`. No further configuration is needed.
5. Confirm the deployment is public (opens without logging in).

## Using a different database

This project ships with `prisma/schema.prisma` configured for Postgres
(Neon). If you'd rather use a MySQL-compatible host like TiDB Cloud, change:

```prisma
datasource db {
  provider = "mysql"   // was "postgresql"
  url      = env("DATABASE_URL")
}
```

and change the `image` field's `@db.Text` to `@db.LongText`.

## How the requirements are met

- **Full CRUD**: `pages/api/notices/index.js` handles `GET` (list) and
  `POST` (create); `pages/api/notices/[id].js` handles `GET` (single, used
  to pre-fill the edit form), `PUT`/`PATCH` (update) and `DELETE`, with
  correct status codes (200/201/204/400/404/405/500).
- **Server-side validation**: `lib/validateNotice.js` runs inside the API
  routes and rejects empty required fields, invalid category/priority
  values, and unparsable dates with a `400` and field-level error messages.
  The form in the browser also validates for instant feedback, but the
  server never trusts client input.
- **Urgent-first ordering in the database**: both `pages/index.js`
  (`getServerSideProps`) and `pages/api/notices/index.js` use
  `prisma.notice.findMany({ orderBy: [{ priority: "desc" }, { publishDate: "desc" }] })`.
  No sorting happens in the browser.
- **Delete confirmation**: `components/ConfirmDeleteButton.js` opens a
  modal dialog that requires an explicit "Delete notice" click before
  calling the API.
- **Responsive design**: the card grid collapses to a single column on
  phones and up to three columns on desktop (Tailwind's `sm:`/`lg:`
  breakpoints), with a mobile-friendly header and forms.
- **Persistence**: all data is read and written through Prisma against a
  hosted Neon database, so it survives refreshes and redeploys — no local
  SQLite file is used.
- **Images**: uploaded images are read client-side and sent as a base64
  data URL, then stored directly in the database (`image` column), so no
  separate file-storage service or credentials are required.

## One thing I'd improve with more time

I'd move image storage off the database and into a small object storage
bucket (e.g. Vercel Blob or an S3-compatible free tier), storing just the
URL in Prisma. That keeps the database lean and avoids the payload-size
ceiling that comes with storing base64 images inline. I'd also add
pagination/infinite scroll once the notice count grows, and a search/filter
bar (by category and by keyword) on the list page.

## Where and how AI was used

This project was built with help from **Claude (Anthropic AI)**, which
generated the initial codebase based on the assignment's requirements:
the Next.js Pages Router structure, the Prisma schema, the CRUD API
routes, the server-side validation helper, and the Tailwind-based UI
(notice cards, the create/edit form, and the delete-confirmation dialog).

I reviewed the generated code, then handled the rest of the project
myself:
- Set up the Neon Postgres database and adjusted `schema.prisma`
  (provider and the `image` column type) for it.
- Configured `.env` with my own `DATABASE_URL` and ran `npx prisma db push`
  to create the schema.
- Initialized git, committed the project, and pushed it to a public
  GitHub repository.
- Deployed the project to Vercel and configured the `DATABASE_URL`
  environment variable there.
- Manually tested create, edit, delete and the Urgent-first ordering on
  the live deployment.

No AI-generated code was submitted without being read and understood
first.