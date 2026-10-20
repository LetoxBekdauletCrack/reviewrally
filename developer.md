# Developer Work Log (developer.md)

**Role:** Full-Stack AI Engineer  
**Sprint:** ReviewRally MVP & Post-MVP Delivery  
**Status:** Completed  

---

## 1. Iteration Roadmap & Execution Log

### [x] Iteration 1: Frontend + Mock Service (Issues #1–#5)
- **Actions:**
  - Initialized Next.js 14 App Router with TypeScript.
  - Configured Tailwind CSS with custom dark-mode tokens and glassmorphism styling tokens.
  - Implemented shadcn/ui primitives: `Button`, `Card`, `Badge`, `Skeleton`, `Table`, `Dialog`.
  - Built `mock-service.ts` with typed interfaces (`Review`, `SentimentData`, `ResponseSuggestion`), artificial latency (~300ms), and edge cases (`text: null`, `text: ""`).
  - Implemented responsive SaaS dashboard shell: collapsible `Sidebar`, `Topbar` with location switcher, `StatCards` (Total Reviews, Avg Rating, Negative Count, Response Rate).
  - Built `ReviewsTable` with star ratings, category pills, and sentiment badges.
  - Integrated Recharts: Donut chart for sentiment split and 14-day area trend chart.
- **Commands Run:**
  - `npm install`
  - `npx tsc --noEmit`

### [x] Iteration 2: OpenAPI Contract (Issue #6)
- **Actions:**
  - Authored `openapi.yml` at repository root defining `GET /api/reviews`, `GET /api/analytics/sentiment`, and `POST /api/reviews/{id}/suggest-response`.
  - Defined schemas with nullable fields: `Review` (`text` nullable), `SentimentData`, `ResponseSuggestion`, `ErrorResponse`.
  - Validated specification structure and endpoints via `scripts/validate-openapi.mjs`.

### [x] Iteration 3: Backend In-Memory Server (Issues #7, #8)
- **Actions:**
  - Built Hono backend in `backend/index.ts` using `@hono/node-server` and `hono/cors`.
  - Implemented `InMemoryReviewStore` in `backend/in-memory-store.ts` implementing all endpoints over `Map()`.
  - Verified `GET /api/health` returns HTTP 200 `{ status: "ok", service: "reviewrally-api" }`.

### [x] Iteration 4: Persistence with Prisma & SQLite (Issues #9–#11)
- **Actions:**
  - Created `prisma/schema.prisma` with `provider = "sqlite"` and `DATABASE_URL="file:./dev.db"`.
  - Models: `Review` (`id` cuid, `author`, `text` nullable, `rating`, `sentiment`, `category`, `businessId`, `createdAt`), `User`, `Business`, `Subscription`.
  - Executed migration: `npx prisma migrate dev --name init`.
  - Wrote `prisma/seed.ts` seeding 500 reviews across Food, Service, and Ambiance, including verified edge cases (`text: null` and `text: ""`).
  - Swapped Hono controllers to `PrismaReviewStore` (`backend/prisma-store.ts`).

### [x] Iteration 5: Connect Frontend to Backend (Issues #12–#14)
- **Actions:**
  - Built typed API client `lib/api.ts` calling Hono backend endpoints.
  - Removed all mock imports from application components and pages.
  - Added skeleton loaders, connection error state with retry button, and toast notifications.
  - Implemented `SuggestResponseModal` displaying AI drafts with one-click copy to clipboard.

### [x] Iteration 6: Automated Testing & Bug Protocol (Issues #15–#17)
- **Actions:**
  - Created Vitest integration harness in `tests/integration.test.ts`.
  - Executed full 5-step Bug Protocol on GitHub for Issue #16 (TypeError on null text) and Issue #17 (divide-by-zero NaN% on 0 reviews).
  - Added regression test cases covering null text, empty text, empty database, and 404 responses.
  - Re-ran tests: 14 out of 14 tests passing 100%.

### [x] Iteration 7: Post-MVP Architecture Slices (Issues #18–#20)
- **Actions:**
  - **Issue #18 (CI):** Created `.github/workflows/ci.yml` running validation, migration, seed, and Vitest suite on main/PRs.
  - **Issue #19 (Stripe):** Integrated Stripe SDK in `backend/index.ts` with dual-mode support (real Stripe checkout session when `STRIPE_SECRET_KEY` exists, mock session fallback when keys absent) and `POST /api/billing/webhook` updating `Subscription` records.
  - **Issue #20 (Multi-Tenant Auth):** Configured NextAuth credentials provider with bcrypt password hashing in `app/api/auth/[...nextauth]/route.ts`. Verified strict row-level tenant isolation between `biz-1` and `biz-2`. Built `app/login/page.tsx` and `app/register/page.tsx`.

---

## 2. Key Architecture Decisions
1. **Contract-First Development:** `openapi.yml` served as the single source of truth, guaranteeing zero schema drift across in-memory, SQLite, and client tiers.
2. **Defensive UI Rendering:** Excerpts safely format null/undefined texts without invoking string operations directly, preventing white-screen crashes.
3. **Dual Persistence Mode:** Hono server dynamically detects `STORE_MODE` and defaults to Prisma SQLite while supporting fast in-memory testing.
