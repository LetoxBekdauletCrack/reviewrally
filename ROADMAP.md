# ReviewRally Product Roadmap & Post-MVP Architecture

This roadmap outlines the long-term vision, scaling milestones, and production rollout plans for ReviewRally following the delivery of our MVP and initial Post-MVP architecture slices.

---

## 1. Post-MVP Slices: Current Status & Future Rollout

### 1.1 CI/CD Automation Pipeline (Issue #18)
- **Current Slice:** GitHub Actions workflow running automated linting, Prisma schema validation, and full Vitest integration suites on main and PR branches.
- **Future Full Rollout:**
  - Parallel matrix testing across Node 20, 22, and 24.
  - Integration with Playwright for headless visual regression testing.
  - Automated deployment preview environments (Vercel preview + Railway staging).
  - Code coverage reporting via Codecov with strict 85% branch coverage thresholds.

### 1.2 Monetization & Billing (Issue #19)
- **Current Slice:** Stripe SDK integrated with dual-mode operational support:
  - Real Stripe Checkout session creation when `STRIPE_SECRET_KEY` is present.
  - Fully functional local mock checkout fallback when keys are absent for automated testing and sandbox previews.
  - Webhook processing pipeline updating SQLite subscription state.
- **Future Full Rollout:**
  - Stripe Customer Portal integration for self-serve subscription cancellation and payment method updates.
  - Metered billing for high-volume AI response generation beyond plan limits.
  - Annual billing discount toggle with automatic invoice generation and tax ID support via Stripe Tax.

### 1.3 Multi-Tenant Authentication & Organization Workspaces (Issue #20)
- **Current Slice:** NextAuth credentials provider storing bcrypt-hashed credentials with tenant isolation (`businessId` tenant key on reviews and queries) and protected API route enforcement.
- **Future Full Rollout:**
  - OAuth 2.0 / Social Sign-In providers: Google Workspace and GitHub SSO.
  - SAML / Enterprise SSO for multi-unit restaurant franchise accounts.
  - Role-Based Access Control (RBAC): `Owner`, `Location Manager`, `Support Responder`, and `Read-Only Viewer`.
  - Multi-business workspace switcher allowing agency accounts to toggle between 10+ client locations without re-authenticating.

---

## 2. Upcoming Product Iterations

### Q1 2027: Integrations & Direct Sync
- **Google Business Profile API:** Direct two-way sync to pull Google Reviews in real time and publish approved AI responses directly to Google Maps.
- **Yelp Fusion API:** Real-time webhook notifications for 1-star and 2-star complaints.
- **TripAdvisor & OpenTable Connectors:** Specialized sentiment extraction for hospitality dining feedback.

### Q2 2027: Advanced AI & Automation
- **Fine-Tuned Hospitality LLM:** Domain-specific tone tuning (Casual, Fine Dining, Luxury Hotel, Fast Casual).
- **Auto-Pilot Auto-Reply:** Automatic publishing for 5-star gratitude responses, requiring human review only for ratings <= 3 stars.
- **Root Cause Clustering:** Cluster repeated complaints (e.g., "cold soup", "Friday valet delay") and notify general managers via Slack/SMS.
