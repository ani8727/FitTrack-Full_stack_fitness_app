# FitTrack Frontend (Vite + React)

## What this frontend does
- Provides the web UI for FitTrack: dashboards, activity tracking, AI recommendations, profile and admin screens.
- Talks only to the API Gateway (no direct calls to individual backend services).
- Uses Auth0 for authentication and authorization.

## Tech stack
- Vite + React 19
- React Router (SPA routing)
- Redux Toolkit for auth/user state
- Tailwind CSS + custom UI components
- Auth0 React SDK (`@auth0/auth0-react`)

## Architecture (high-level)
- `src/main.jsx` – bootstraps React, wraps App with `ThemeProvider`, `Auth0Provider`, and Redux `Provider`.
- `src/App.jsx` – central routing & layout:
  - Handles Auth0 login state and token loading.
  - Defines routes for dashboards, activities, profile, admin, and legal pages.
  - Wraps authenticated pages in `SiteLayout` and `ProtectedRoute`.
- `src/shared/ui` – layout + shared UI:
  - `SiteLayout.jsx` – shell with `Navbar`, `Sidebar`, `Footer` and main content.
  - `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx`, `Icons.jsx`, `ContactModal.jsx`.
- `src/features` – domain-specific UI:
  - `activities/` – activity list, form, detail, quick actions.
  - `profile/` – profile view/update, account settings.
  - `recommendations/` – AI recommendations page.
  - `legal/` – Terms & Privacy wrappers.
- `src/pages` – top-level pages used by the router (DashboardEnhanced, Admin pages, landing, onboarding, etc.).
- `src/services` / `src/api` – API client using Axios, configured with `VITE_API_URL`.
- `src/context/ThemeContext.jsx` – light/dark theme state used by layout & components.

## Environment variables (Vite)
Set these in:
- Local dev: `frontend/.env` (or `.env.local`).
- Vercel / Render: Project Environment Variables.

Required:
- `VITE_API_URL` – base URL of the API Gateway
  - Example (prod): `https://fittrack-gateway.onrender.com`
  - Example (local): `http://localhost:8080/api` (or whatever your gateway exposes)
- `VITE_AUTH0_DOMAIN` – Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` – SPA client id
- `VITE_AUTH0_AUDIENCE` – API audience configured in Auth0 (e.g. `fitness_auth`)
- `VITE_AUTH0_REDIRECT_URI` – allowed callback URL for Auth0

Optional:
- `VITE_API_BASE_URL` – kept for compatibility; usually same as `VITE_API_URL`.
- `VITE_SITE_LINKEDIN` – used in footer/social links.
- `VITE_ADMIN_EMAIL`, `VITE_EMAILJS_*` – used by contact form if configured.

For full examples, see:
- `frontend/.env.example` – local dev template.
- `frontend/.env.production` – production template matching gateway + Auth0.

## How it talks to the backend
- All API calls go through the API Gateway using `VITE_API_URL`.
- The Auth0 React SDK obtains an access token and `App.jsx` stores it in `sessionStorage`:
  - `token` – used by Axios interceptor to send `Authorization: Bearer <token>`.
  - `userId` – derived from Auth0 `sub` claim.
- The Gateway validates the JWT and forwards requests to microservices (users, activity, AI, admin).

## Running locally
From the project root:
1. Copy `frontend/.env.example` to `frontend/.env` and fill values for your local Auth0 + gateway.
2. Start backend + gateway (see `backend/*/HELP.md` and docs in `docs/`).
3. In `frontend/` run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## Building & deploying
- Build: from `frontend/` run `npm run build` (outputs to `dist/`).
- Vercel/Render settings (for the frontend app):
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment: set all `VITE_*` variables listed above.

Once deployed, the frontend will:
- Redirect unauthenticated users to Auth0 via the landing page.
- After login, call the API Gateway with the Auth0 access token.
- Render dashboards, activities, recommendations and admin views based on roles.
