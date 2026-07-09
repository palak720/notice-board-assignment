# The Notice Board

A full CRUD notice board built with **Next.js (Pages Router)** and **Prisma**.
Notices support create, read, update and delete, with Urgent notices always
pinned above Normal ones (sorted in the database, not in the browser).

## Tech stack

- Framework: Next.js 14, **Pages Router** (`pages/`)
- Database access: Prisma ORM
- Database: any free hosted MySQL/Postgres — set up for **TiDB Cloud
  Serverless** (MySQL-compatible) by default; Neon/Supabase (Postgres) also
  work with a one-line schema change (see below)
- Styling: Tailwind CSS
- Hosting: Vercel (Hobby/free tier)

## Project structure

```
pages/
  index.js                 # List page (SSR, Prisma orderBy: Urgent first)
  notices/new.js            # Create form
  notices/[id]/edit.js      # Edit form, pre-filled from Prisma
  api/notices/index.js      # GET (list), POST (create)
  api/notices/[id].js       # GET (one), PUT/PATCH (update), DELETE
components/
  Layout.js, NoticeCard.js, NoticeForm.js, ConfirmDeleteButton.js
lib/
  prisma.js                 # Prisma client singleton
  validateNotice.js         # Server-side validation (used by both API routes)
prisma/
  schema.prisma
```

## Running locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up a free hosted database**

   Recommended: [TiDB Cloud Serverless](https://tidbcloud.com) (MySQL-compatible, free, no credit card).

   - Create a free cluster, then create a database (e.g. `noticeboard`).
   - Get the connection string from the cluster's "Connect" panel.

   Alternative: [Neon](https://neon.tech) or [Supabase](https://supabase.com) (Postgres, also free).
   If you use Postgres instead of MySQL, open `prisma/schema.prisma` and change:

   ```prisma
   datasource db {
     provider = "postgresql"   // was "mysql"
     url      = env("DATABASE_URL")
   }
   ```

   and change the `image` field's `@db.LongText` to `@db.Text`.

3. **Configure environment variables**

   Copy `.env.example` to `.env` and paste in your connection string:

   ```bash
   cp .env.example .env
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
   in the Vercel project settings.
4. Deploy. Vercel runs `npm run build`, which runs `prisma generate` then
   `next build`. No further configuration is needed.
5. Confirm the deployment is public (opens without logging in).

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
  hosted database, so it survives refreshes and redeploys — no local
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

This project was built with Claude (Anthropic). AI was used to:

- Scaffold the Next.js Pages Router structure, the Prisma schema, and the
  CRUD API routes.
- Write the shared server-side validation helper.
- Generate the Tailwind-based UI (layout, notice cards, the create/edit
  form, and the delete-confirmation dialog).
- Write this README.

All generated code was reviewed, and the build was verified locally
(`next build`, type/lint checks) before committing. No AI-generated code
was submitted without being read and understood first.
