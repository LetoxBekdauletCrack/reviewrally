# ReviewRally — AI-Powered Reputation Management SaaS

> B2B SaaS platform for restaurants, boutique hotels, and hospitality operators to aggregate customer feedback, analyze sentiment categorized into **Food**, **Service**, and **Ambiance**, display analytics dashboards, and generate empathetic, de-escalating AI review responses.

Inspired by top-performing B2B micro-SaaS models on TrustMRR.

---

## 🚀 Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui primitives, Recharts
- **Design System:** v0.dev / Lovable-style dark-mode SaaS aesthetic, custom glow tokens, responsive sidebar, stat cards, and skeleton loaders
- **Backend:** Hono lightweight Node.js HTTP server (`@hono/node-server`, `hono/cors`)
- **Persistence:** SQLite via Prisma ORM (DBMS-agnostic, zero-config local persistence)
- **Monetization Slice:** Stripe SDK with dual-mode operational support (real Stripe checkout session or local mock session when API keys are absent) + webhook handling
- **Auth & Multi-Tenancy Slice:** NextAuth.js credentials provider with bcrypt password hashing and row-level tenant isolation
- **Automated Verification:** Vitest integration test suite (14/14 tests green) + GitHub Actions CI pipeline

---

## 📦 Iteration Lifecycle Summary

Development proceeded autonomously through strict, mandatory AI-native iterations:

1. **Iteration 1 — Frontend + Mock Service:** Complete UI with dark-mode SaaS shell, sidebar, stat cards, Recharts sentiment donut & 14-day trend area chart, and `mock-service.ts` with ~300ms latency and edge cases (`text: null`, `text: ""`).
2. **Iteration 2 — OpenAPI Contract:** Formal `openapi.yml` (OpenAPI 3.0.3) at repository root as the single contract source of truth.
3. **Iteration 3 — Backend In-Memory:** Hono server implementing all endpoints over an in-memory `Map()`.
4. **Iteration 4 — Backend SQLite:** Prisma schema with SQLite provider, initial migration `20261020012347_init`, seed script populating 500 reviews with edge cases, and swapped controllers to Prisma.
5. **Iteration 5 — Full-Stack Connect:** Typed fetch client `lib/api.ts` connecting Next.js to Hono; zero mock imports remaining in application code.
6. **Iteration 6 — Test & Fix (Bug Protocol):** Vitest test harness with 14 tests; full 5-step Bug Protocol executed on GitHub for Issue #16 (TypeError on null text) and Issue #17 (divide-by-zero NaN% on 0 reviews).
7. **Iteration 7 — Post-MVP Slices:** GitHub Actions CI (`.github/workflows/ci.yml`), Stripe subscription checkout slice (`app/billing/page.tsx`), and NextAuth multi-tenant credentials authentication slice with tenant-isolated database queries.

---

## 🛠️ Quickstart & Local Setup

### 1. Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Migration & Seed
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```
*Seeds 500 realistic dining reviews spanning 14 days, demo tenant accounts, and subscription tiers.*

### 4. Run Servers
In terminal 1 (Hono Backend):
```bash
npm run server
# Listening on http://localhost:3001
```

In terminal 2 (Next.js Frontend):
```bash
npm run dev
# Ready on http://localhost:3000
```

### 5. Run Automated Tests
```bash
npm test
```

---

## 👥 Seeded Demo Accounts (Multi-Tenant)

| Business Name | Tenant ID | Demo Email | Password | Tier |
|---|---|---|---|---|
| Bistro Belle (Downtown) | `biz-1` | `admin@bistrobelle.com` | `password123` | Pro |
| The Grand Grill (Westside) | `biz-2` | `admin@grandgrill.com` | `password123` | Starter |

---

## 🧪 Automated Test Suite (14 Tests Passing)

```
✓ tests/integration.test.ts (14 tests) 331ms
  ✓ GET /api/health -> HTTP 200 with service status
  ✓ GET /api/reviews -> seeded reviews for biz-1
  ✓ GET /api/reviews -> filter reviews by sentiment
  ✓ GET /api/reviews -> filter reviews by category
  ✓ GET /api/reviews -> [Regression #16] safe return of reviews with null/empty text
  ✓ GET /api/analytics/sentiment -> aggregated statistics and daily trends
  ✓ GET /api/analytics/sentiment -> [Regression #17] graceful empty database handling (0 reviews, no NaN)
  ✓ POST /api/reviews/:id/suggest-response -> context-aware resolution draft
  ✓ POST /api/reviews/:id/suggest-response -> [Regression #16] AI draft for null-text review
  ✓ POST /api/reviews/:id/suggest-response -> HTTP 404 for nonexistent review ID
  ✓ POST /api/billing/checkout -> mock Stripe checkout session in sandbox mode
  ✓ POST /api/billing/webhook -> webhook subscription status update
  ✓ Multi-Tenant Isolation -> row-level tenant isolation between biz-1 and biz-2
  ✓ Authentication Slice -> bcrypt credential verification and tenant assignment
```

---

## 📋 Role Documentation

- [`brainstorm_chat_history.md`](./brainstorm_chat_history.md) — Product ideation, TrustMRR inspiration, stack selection, and aesthetic decisions.
- [`pm.md`](./pm.md) — Product Manager scope, issue priorities, Bug Protocol grooming notes, and delivery tracking.
- [`developer.md`](./developer.md) — Developer iteration logs, architectural decisions, and command logs.
- [`qa-engineer.md`](./qa-engineer.md) — QA test strategy, regression suites, manual E2E logs, and final sign-off.
- [`ROADMAP.md`](./ROADMAP.md) — Future production rollout plans for CI matrix, live Stripe billing, and OAuth SSO.
- [`GITHUB_ISSUES.md`](./GITHUB_ISSUES.md) — Live mirror of all 20 closed GitHub issues.
