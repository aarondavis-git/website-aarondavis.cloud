# my-website-next

This is your site, migrated from Vite + React Router to Next.js 16 (App Router).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build and run the production server:

```bash
npm run build
npm run start
```

## What changed from the Vite version

**Routing.** `react-router-dom`'s `<Router>`/`<Routes>`/`<Route>` are gone.
Routes are now defined by the folder structure under `src/app`:

| Old (React Router) | New (Next.js file) |
|---|---|
| `/` → `pages/Home.tsx` | `src/app/page.tsx` |
| `/about` → `pages/About.tsx` | `src/app/about/page.tsx` |
| `/portfolio` → `pages/Portfolio/index.tsx` | `src/app/portfolio/page.tsx` |
| `/portfolio/machinelearningresearch` | `src/app/portfolio/machinelearningresearch/page.tsx` |
| `/services` → `pages/Services.tsx` | `src/app/services/page.tsx` |
| `/writings` → `pages/Writings.tsx` | `src/app/writings/page.tsx` |
| `/contact` → `pages/Contact.tsx` | `src/app/contact/page.tsx` |

`NavLink` → Next's `Link` + `usePathname()` (see `src/components/NavigationBar.tsx`).

**Layout.** `App.tsx` (nav bar + container div) became `src/app/layout.tsx`,
which now wraps every page automatically — no need to import it per-page.

**Client vs. server components.** Next renders components on the server by
default. Anything using hooks, `localStorage`, or browser-only APIs needs
`'use client'` at the top of the file. That's: `ThemeContext.tsx`,
`NavigationBar.tsx`, `DarkModeToggle.tsx`, and the
`machinelearningresearch/page.tsx` (it uses `useState`/`useEffect` and
Framer Motion). The purely static pages (Home, About, Services, Writings,
Portfolio index) needed no change here — they render on the server.

**Dark mode + hydration.** The old `ThemeContext` read `localStorage` in
`useState`'s initializer, which is fine for a client-only Vite app but
would cause a "flash of wrong theme" (and a hydration mismatch warning) in
Next, since the server has no `localStorage` to read from. Fixed with
`src/components/ThemeScript.tsx` — a small inline `<script>` in `<head>`
that runs before React hydrates and sets the `dark` class immediately.

Also fixed a bug from the original: `NavigationBar` was keeping its own
`darkMode` state under the `localStorage` key `"darkMode"`, separate from
`ThemeContext`'s `"theme"` key, so the two could disagree. They now share
one `ThemeContext`.

**Dropped:** `App.css` (dead code — it wasn't imported anywhere in the
original project), `vite-env.d.ts` / `vite.config.ts` (replaced by
`next-env.d.ts` / `next.config.ts`, both auto-managed by Next), and the
default Vite/React SVG assets (unused).

**Not carried over:** the three empty placeholder files under
`Portfolio/MachineLearningResearch/*/index.tsx` (Pong, Pruning, TicTacToe)
were 0 bytes in the original and weren't linked from anywhere — nothing to
migrate. If you want project detail pages, they'd live at
`src/app/portfolio/machinelearningresearch/[project]/page.tsx`.

## Notes

- Styling is unchanged: Tailwind v4 (via `@tailwindcss/postcss`) plus the
  same hand-written CSS files, just relocated next to the pages that use
  them (`portfolio.css`, `contact.css`) or globally (`globals.css`,
  `NavigationBar.css`).
- `npm run lint` and `npm run build` both pass clean.
- Deploys as-is to Vercel, or anywhere that runs `next build && next start`
  (or `next export`-style static hosting, since every route here is fully
  static).

## Obsidian vault

Projects, Research and Writings are read from an Obsidian vault at build time.
By default the vault is the `content/` folder: in Obsidian choose
**Open folder as vault** and pick it.

```
content/
  projects/*.md   -> /projects/<slug>
  research/*.md   -> /research/<slug>
  writings/*.md   -> /writings/<slug>
  attachments/    -> images used by ![[embeds]] (any folder works)
```

Every note becomes a card, and the card opens that note's own page. Notes
outside those three folders (daily notes, scratch, `.obsidian`) are never
published, and `publish: false` in a note's properties keeps it off the site.

Supported: `[[wikilinks]]` (`[[Note]]`, `[[Note|alias]]`, `[[Note#Heading]]`,
across all three sections, matched by filename, title or `aliases`),
`![[image.png]]` embeds, `> [!callouts]`, `%%comments%%`, and `$math$`.

Optional environment variables (see `.env.local.example`):
`OBSIDIAN_VAULT_PATH` to develop against a vault outside the repo, and
`OBSIDIAN_VAULT_NAME` to show an "Open in Obsidian" link on each note page.
Production reads whatever is in `content/` at build time, so commit your notes
there (or use a git submodule for the vault) before deploying.

## Database (contact form)

The contact form writes to Postgres through `src/app/api/connect/route.ts`.

**Local development (Docker Postgres):**

```bash
npm run db:up        # start only the Postgres container (creates tables on first run)
npm run db:migrate   # apply any sql/*.sql not yet applied
npm run dev          # site on http://localhost:3000, form posts to the local DB
npm run db:psql      # inspect: SELECT * FROM contact_submissions ORDER BY id DESC;
npm run db:down      # stop the container, keep the data
```

`.env.local` points `DATABASE_URL` at `127.0.0.1:5432` with `DATABASE_SSL=false`.

The API (`POST /api/connect`) trims and validates input (name <= 200, email <= 320,
message <= 5000 chars; limits live in `src/lib/contact.ts` and are mirrored by
CHECK constraints), drops honeypot submissions, and rate-limits each client to
5 messages per hour. Clients are identified by a salted SHA-256 of their IP
(`IP_HASH_SALT`); the raw IP is never stored. Each row has a `status`
(`new` / `read` / `replied` / `spam`) for triage.

**Production:**

1. Create a Postgres database (Neon, Supabase, or a Vercel Marketplace Postgres).
2. Copy `.env.local.example` to `.env.local` and set `DATABASE_URL` and `IP_HASH_SALT`.
3. Create the tables: `npm run db:migrate` (applies `sql/*.sql` in order and
   records what has run, so it is safe to repeat).
4. Set the same `DATABASE_URL` and `IP_HASH_SALT` in the Vercel project settings.
5. Check `/api/health` reports `db: "up"`, then submit the form once.

Schema changes go in a new file, `sql/002_<name>.sql` — never edit one that
has already been applied.

## Running with Docker Compose

`docker-compose.yml` runs the site and a local Postgres together:

```bash
docker compose up --build   # site on http://localhost:3000
docker compose down         # stop, keep the data
docker compose down -v      # stop and wipe the database
```

The `contact_submissions` table is created automatically the first time the
database starts (Postgres runs everything in `sql/` on an empty volume). For
a schema change later, add `sql/002_<name>.sql` and, with the stack running,
apply it from your machine:

```bash
DATABASE_URL=postgres://site:devpassword@127.0.0.1:5432/site npm run db:migrate
```

Postgres is published on `127.0.0.1:5432` only. Set `POSTGRES_PASSWORD` in a
`.env` file next to `docker-compose.yml` to replace the default dev password
(do this before the first start — the password is fixed when the volume is
created).
