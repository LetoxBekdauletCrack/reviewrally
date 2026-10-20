# Product Manager (pm.md)

**Role:** Product Manager  
**Platform:** ReviewRally  
**Current Phase:** Sprint Execution (MVP & Post-MVP Delivery)

---

## 1. Executive Summary & MVP Scope
ReviewRally is an AI-native B2B Reputation Management SaaS platform designed to solve the critical revenue vulnerability of negative customer reviews for restaurants, boutique hotels, and local service providers.

### Core Value Drivers:
1. **Reputation Monitoring:** Unified view of customer sentiment across ratings and hospitality pillars (Food, Service, Ambiance).
2. **AI Actionability:** One-click empathetic, de-escalating review response drafts tailored to rating severity and complaint category.
3. **Data Integrity & Tenancy:** Clean isolation between business profiles and robust error handling for real-world malformed data.

---

## 2. Issue Backlog & Priorities

| Issue # | Type | Title | Priority | Target Milestone |
|---|---|---|---|---|
| #1 | mvp | Setup Next.js, Tailwind, and shadcn/ui project structure | P0 | Iteration 1 |
| #2 | mvp | Generate and implement v0.dev style Dashboard layout | P0 | Iteration 1 |
| #3 | mvp | Build Reviews List UI component | P0 | Iteration 1 |
| #4 | mvp | Implement mock-service.ts for frontend | P0 | Iteration 1 |
| #5 | mvp | Wire Dashboard charts to mock data | P1 | Iteration 1 |
| #6 | mvp | Define OpenAPI contract (openapi.yml) | P0 | Iteration 2 |
| #7 | mvp | Initialize Hono backend server | P0 | Iteration 3 |
| #8 | mvp | Implement In-Memory storage controllers | P0 | Iteration 3 |
| #9 | mvp | Setup Prisma schema with SQLite provider | P0 | Iteration 4 |
| #10 | mvp | Run Prisma migrations for SQLite DB | P0 | Iteration 4 |
| #11 | mvp | Create DB seed script for 500 test reviews | P1 | Iteration 4 |
| #12 | mvp | Connect Frontend to Hono Backend API | P0 | Iteration 5 |
| #13 | mvp | Implement "Suggest AI Response" API endpoint | P0 | Iteration 5 |
| #14 | mvp | Add loading states and error handling to frontend | P1 | Iteration 5 |
| #15 | mvp | Write Hono Integration Tests | P0 | Iteration 6 |
| #16 | user-test-bug | Dashboard crashes with TypeError on null/empty review text | P0 (Blocker) | Iteration 6 Bug Protocol |
| #17 | user-test-bug | Sentiment pie chart shows "NaN%" when DB has 0 reviews | P1 (Visual Polish) | Iteration 6 Bug Protocol |
| #18 | post-mvp | Setup CI pipeline (GitHub Actions) | P1 | Iteration 7 |
| #19 | post-mvp | Integrate Stripe subscriptions (test-mode slice) | P1 | Iteration 7 |
| #20 | post-mvp | Add multi-tenant authentication (NextAuth credentials slice) | P0 | Iteration 7 |

---

## 3. Grooming & Bug Triage Notes

### Bug #16: Dashboard crashes on review with empty/null text body
- **Priority:** P0 Blocker
- **Root Cause Assessment:** Frontend assumes `review.text` is always a string and calls string methods (`substring`, `toLowerCase`) without null checks.
- **PM Requirement:** The UI must never crash on null, undefined, or empty review text. When text is absent, render a subtle italicized badge or placeholder: *"No text provided"*. AI response generator should still function by generating a graceful inquiry acknowledging the star rating.

### Bug #17: Sentiment pie chart displays "NaN%" when DB has 0 reviews
- **Priority:** P1 High
- **Root Cause Assessment:** Dividing by `totalReviews = 0` calculates `0 / 0 = NaN`.
- **PM Requirement:** When total reviews count is 0, do not display broken percentage labels or empty SVG artifacts. Instead, render a polished empty state card over the chart canvas: *"Waiting for your first reviews… Customer insights will appear as feedback arrives."*

---

## 4. Deferral Decisions
*None. All 20 backlog issues are prioritized for active implementation and QA verification in this sprint cycle.*
