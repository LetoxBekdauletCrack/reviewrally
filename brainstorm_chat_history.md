# Brainstorming & Architecture Session: ReviewRally

**Date:** 2026-10-20  
**Participants:** Founder / Product Lead & Lead AI Architect  
**Objective:** Identify a high-leverage B2B Micro-SaaS opportunity inspired by top-performing revenue models on TrustMRR, finalize product scope, establish technology stack, and lock in the design language.

---

### Phase 1: Exploring TrustMRR Opportunities

**Founder:**  
Looking at recent TrustMRR listings and profitable micro-SaaS case studies, several recurring high-margin patterns stand out:
1. SEO & Backlink monitors ($3k-$10k MRR) — highly saturated, hard to differentiate.
2. Review & Reputation Management for Local Businesses ($5k-$25k MRR) — sticky, high willingness to pay, massive pain point with negative Yelp/Google reviews.
3. Form / Survey builders ($2k-$8k MRR) — commoditized by Typeform/Tally.

I want to build a modern, high-value reputation management platform tailored for hospitality and local service businesses (restaurants, boutique hotels, salons).

**AI Architect:**  
The Reputation Management space is great for B2B SaaS for several reasons:
- **Direct ROI:** One unaddressed 1-star Yelp/Google review costs a restaurant ~30 potential diners. Owners lose sleep over bad reviews.
- **Actionable AI Hook:** Most platforms just send alert notifications. Business owners are too busy or emotionally charged to write empathetic, de-escalating responses. Automated, context-aware AI response drafts (addressing specific complaint categories like Food, Service, or Ambiance) provide instant tangible value.
- **Pricing Power:** $29/mo (Starter) to $199/mo (Agency/Multi-location) is an easy impulse expense for a small business.

Let's call the product **ReviewRally**.

---

### Phase 2: Core Value Proposition & Scope

**Founder:**  
Let's define what makes ReviewRally indispensable:
1. **Unified Dashboard:** High-level metrics (Total Reviews, Average Rating, Negative Review Alerts, Sentiment Breakdown).
2. **Sentiment & Topic Breakdown:** Automatic categorization into Hospitality pillars: **Food**, **Service**, and **Ambiance**.
3. **AI Response Assistant:** One-click generation of professional, de-escalating review responses tailored to the sentiment and specific complaint.
4. **Multi-Tenancy:** Multi-business isolation so owners or agencies can manage distinct brand locations without cross-contamination.

**AI Architect:**  
Agreed. To build this cleanly in an AI-native workflow, we will structure the development into strict iterations:
1. **Frontend + Mock Service:** Standalone UI with rich dark-mode visuals, interactive Recharts, and edge case handling (`text: null`, `text: ""`).
2. **OpenAPI 3.0 Contract:** `openapi.yml` defining `GET /api/reviews`, `GET /api/analytics/sentiment`, and `POST /api/reviews/{id}/suggest-response`.
3. **Hono In-Memory Backend:** Ultra-fast route prototyping using in-memory `Map()`.
4. **Prisma + SQLite Persistence:** Production-ready relational persistence with 500 seeded real-world hospitality reviews spanning 14 days.
5. **Full Stack Connect:** Typed fetch client wiring Next.js to Hono.
6. **Testing & Bug Protocol:** Automated Vitest suite + manual E2E user testing, strictly executing the Bug Protocol for edge cases (null review body crash, divide-by-zero NaN on empty analytics).
7. **Post-MVP Slices:** GitHub Actions CI, Stripe subscription checkout mock slice, and NextAuth credentials multi-tenant auth slice.

---

### Phase 3: Design Language & Aesthetics

**Founder:**  
Standard bootstrap or generic admin dashboard templates are unacceptable. We need a sleek, modern v0.dev / Lovable aesthetic.

**AI Architect:**  
We will execute on a curated dark-mode design system:
- **Color Palette:** Deep zinc/slate canvas (`#09090b` / `#18181b`), emerald-500 for positive sentiment, slate-400 for neutral, rose-500 for negative/critical alerts.
- **Components:** Sidebar navigation with collapsed/expanded states, stat cards with subtle borders and glow effects, interactive Recharts donuts and area charts with custom tooltips, responsive modal dialogs for AI response generation with one-click copy.
- **Edge-Case Resilience:** Skeleton loaders for throttled networks, empty state illustrations ("Waiting for your first reviews..."), and robust null-fallback UI.

---

### Phase 4: Sign-Off

**Founder & AI Architect Decision:**  
- Product Name: **ReviewRally**  
- Core Stack: **Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Hono, Prisma, SQLite, NextAuth, Stripe SDK**  
- Roles Activated: `pm.md`, `developer.md`, `qa-engineer.md`  
- Proceed to Step 1 execution and project setup.
