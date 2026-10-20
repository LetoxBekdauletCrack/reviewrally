# Product Manager (pm.md)

**Role:** Product Manager  
**Platform:** ReviewRally  
**Status:** MVP & Post-MVP Delivery Complete — 100% Closed  

---

## 1. Executive Summary & Product Scope
ReviewRally is an AI-native B2B Reputation Management SaaS platform engineered to protect restaurant, hospitality, and local service revenues by neutralizing bad reviews and boosting customer goodwill.

### Core Value Drivers:
1. **Reputation Monitoring:** Unified view of customer feedback across ratings and hospitality pillars: **Food**, **Service**, and **Ambiance**.
2. **AI Actionability:** One-click empathetic, de-escalating review response drafts tailored to rating severity, complaint category, and diner name.
3. **Data Integrity & Tenancy:** Strict row-level isolation between business profiles and robust error handling for real-world malformed data (null/empty bodies).

---

## 2. Issue Backlog, Priorities & Delivery Status

| Issue # | Type | Title | Priority | Status | Resolution |
|---|---|---|---|---|---|
| #1 | mvp | Setup Next.js, Tailwind, and shadcn/ui project structure | P0 | CLOSED | Base layout and dark tokens verified |
| #2 | mvp | Generate and implement v0.dev style Dashboard layout | P0 | CLOSED | Responsive shell, sidebar, and stat cards verified |
| #3 | mvp | Build Reviews List UI component | P0 | CLOSED | Reviews table, star rating, badges verified |
| #4 | mvp | Implement mock-service.ts for frontend | P0 | CLOSED | Data layer with edge cases verified |
| #5 | mvp | Wire Dashboard charts to mock data | P1 | CLOSED | Recharts donut and area trend verified |
| #6 | mvp | Define OpenAPI contract (openapi.yml) | P0 | CLOSED | OpenAPI 3.0.3 contract validated |
| #7 | mvp | Initialize Hono backend server | P0 | CLOSED | Hono server on port 3001 with CORS verified |
| #8 | mvp | Implement In-Memory storage controllers | P0 | CLOSED | In-memory Map() controllers verified |
| #9 | mvp | Setup Prisma schema with SQLite provider | P0 | CLOSED | schema.prisma validated |
| #10 | mvp | Run Prisma migrations for SQLite DB | P0 | CLOSED | Initial migration applied and dev.db created |
| #11 | mvp | Create DB seed script for 500 test reviews | P1 | CLOSED | 500 reviews with edge cases seeded |
| #12 | mvp | Connect Frontend to Hono Backend API | P0 | CLOSED | Typed fetch client in lib/api.ts connected |
| #13 | mvp | Implement "Suggest AI Response" API endpoint | P0 | CLOSED | POST /api/reviews/:id/suggest-response verified |
| #14 | mvp | Add loading states and error handling to frontend | P1 | CLOSED | Skeletons, error recovery, toast alerts verified |
| #15 | mvp | Write Hono Integration Tests | P0 | CLOSED | Vitest integration test suite passed 100% |
| #16 | user-test-bug | Dashboard crashes with TypeError on null review text | P0 | CLOSED | Fixed with fallback "No text provided" copy |
| #17 | user-test-bug | Sentiment pie chart shows "NaN%" when DB has 0 reviews | P1 | CLOSED | Fixed with empty state overlay |
| #18 | post-mvp | Setup CI pipeline (GitHub Actions) | P1 | CLOSED | .github/workflows/ci.yml created and validated |
| #19 | post-mvp | Integrate Stripe subscriptions (test-mode slice) | P1 | CLOSED | Mock checkout & webhook handling verified |
| #20 | post-mvp | Add multi-tenant authentication (NextAuth credentials) | P0 | CLOSED | NextAuth credentials & RLS isolation verified |

---

## 3. Bug Protocol Grooming & Decisions

### Bug #16: Dashboard crashes on review with empty/null text body
- **Priority:** P0 Blocker
- **Root Cause Assessment:** Frontend assumes `review.text` is always a string and calls string methods (`substring`, `toLowerCase`) without null checks.
- **PM Requirement:** The UI must never crash on null, undefined, or empty review text. When text is absent, render a subtle italicized badge: *"No text provided"*. AI response generator synthesizes a gracious acknowledgment tailored to the star rating.
- **Outcome:** Fixed and verified. Zero crashes observed.

### Bug #17: Sentiment pie chart displays "NaN%" when DB has 0 reviews
- **Priority:** P1 High
- **Root Cause Assessment:** Dividing by `totalReviews = 0` calculates `0 / 0 = NaN`.
- **PM Requirement:** When total reviews count is 0, do not display broken percentage labels or empty SVG artifacts. Instead, render a polished empty state card over the chart canvas: *"Waiting for your first reviews… Customer insights will appear as feedback arrives."*
- **Outcome:** Fixed and verified. Clean empty state rendered on zero reviews.

---

## 4. Deferral Decisions
*None. All 20 backlog issues (MVP, user test bugs, and Post-MVP slices) have been successfully implemented, verified by QA, and closed on GitHub.*
