# Daily Progress Tracker (`daily_progress_tracker`)

Full-stack web app: **React + Tailwind** in `client/` (Vite dev server proxies `/api` → `backend/`), **Express + MongoDB + JWT** in `backend/`.

## Quick start

1. Install **MongoDB** (local or Atlas) and set `backend/.env` from `.env.example`.
2. From the **repo root** (recommended):

   ```bash
   npm install
   npm run install:all
   npm run dev
   ```

   This runs **API** (`http://localhost:5000`) and **Vite** (`http://localhost:5173`) together.

   Or run separately: `npm run dev` inside `backend/` and `client/`.

3. Open **`http://localhost:5173`** — use **`/auth`** to sign up or log in.

**Do not** open files from disk in the browser; the app must run through Vite so routing and `/api` proxy work.

## Web app / PWA

- `client/public/manifest.webmanifest` — installable metadata (Add to Home Screen on supported browsers).
- `index.html` — `theme-color`, viewport, manifest link.

## Structure (high level)

| Area | Contents |
|------|----------|
| `client/src/config/navigation.js` | Shared routes for **Sidebar** + **MobileNav** (single source of truth) |
| `client/src/components/` | Layout, Sidebar, Navbar, MobileNav, Card, ToggleButton |
| `client/src/pages/` | Dashboard, WeeklyPlanner, Progress, Projects, Notes, Settings, Auth |
| `client/src/features/` | Tracker, projects, notes UI pieces |
| `client/src/services/` | API clients (`api`, `authService`, `trackerService`, …) |
| `backend/` | `server.js`, `routes/`, `controllers/`, `models/`, `middleware/` |

## Routing note

Protected routes use a guard that renders **`<Outlet />`** so nested **`<Layout />`** and **`<Outlet />`** receive React Router context correctly (sidebar / mobile links navigate as expected).

## Legacy

The old standalone `daily_progress_tracker.html` / `.css` / `.js` files were **removed**; this repo is the **client + backend** app only.
