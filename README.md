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
