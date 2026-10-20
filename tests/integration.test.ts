import { describe, it, expect, beforeAll } from "vitest";
import { app } from "../backend/index.js";
import { prisma } from "../backend/prisma-store.js";

describe("ReviewRally Hono API Integration Tests", () => {
  beforeAll(async () => {
    // Ensure DB connection is active
    await prisma.$connect();
  });

  describe("GET /api/health", () => {
    it("should return HTTP 200 with service status", async () => {
      const res = await app.request("/api/health");
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.status).toBe("ok");
      expect(body.service).toBe("reviewrally-api");
      expect(body.persistence).toBe("sqlite");
    });
  });

  describe("GET /api/reviews", () => {
    it("should return seeded reviews for biz-1", async () => {
      const res = await app.request("/api/reviews?businessId=biz-1");
      expect(res.status).toBe(200);

      const reviews = await res.json();
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);

      const first = reviews[0];
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("author");
      expect(first).toHaveProperty("rating");
      expect(first).toHaveProperty("sentiment");
      expect(first).toHaveProperty("category");
    });

    it("should filter reviews by sentiment", async () => {
      const res = await app.request("/api/reviews?businessId=biz-1&sentiment=NEGATIVE");
      expect(res.status).toBe(200);

      const reviews = await res.json();
      expect(reviews.every((r: any) => r.sentiment === "NEGATIVE")).toBe(true);
    });

    it("should filter reviews by category", async () => {
      const res = await app.request("/api/reviews?businessId=biz-1&category=FOOD");
      expect(res.status).toBe(200);

      const reviews = await res.json();
      expect(reviews.every((r: any) => r.category === "FOOD")).toBe(true);
    });

    // REGRESSION TEST CASE FOR BUG #16
    it("[Regression #16] should safely return reviews with null and empty text bodies", async () => {
      const res = await app.request("/api/reviews?businessId=biz-1");
      const reviews = await res.json();

      const nullTextReview = reviews.find((r: any) => r.text === null);
      const emptyTextReview = reviews.find((r: any) => r.text === "");

      expect(nullTextReview).toBeDefined();
      expect(nullTextReview.text).toBeNull();

      expect(emptyTextReview).toBeDefined();
      expect(emptyTextReview.text).toBe("");
    });
  });

  describe("GET /api/analytics/sentiment", () => {
    it("should return aggregated sentiment and category statistics", async () => {
      const res = await app.request("/api/analytics/sentiment?businessId=biz-1");
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(typeof data.totalReviews).toBe("number");
      expect(typeof data.averageRating).toBe("number");
      expect(typeof data.negativeCount).toBe("number");
      expect(data.sentimentCounts).toBeDefined();
      expect(data.categoryCounts).toBeDefined();
      expect(Array.isArray(data.dailyTrends)).toBe(true);
      expect(data.dailyTrends.length).toBe(14);
    });

    // REGRESSION TEST CASE FOR BUG #17
    it("[Regression #17] should gracefully handle empty database with 0 reviews without returning NaN", async () => {
      const res = await app.request("/api/analytics/sentiment?businessId=biz-nonexistent");
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.totalReviews).toBe(0);
      expect(data.averageRating).toBe(0);
      expect(data.negativeCount).toBe(0);
      expect(Number.isNaN(data.averageRating)).toBe(false);
      expect(data.sentimentCounts.positive).toBe(0);
      expect(data.sentimentCounts.neutral).toBe(0);
      expect(data.sentimentCounts.negative).toBe(0);
    });
  });

  describe("POST /api/reviews/:id/suggest-response", () => {
    it("should return a context-aware resolution draft for an existing review", async () => {
      const revsRes = await app.request("/api/reviews?businessId=biz-1");
      const reviews = await revsRes.json();
      const targetReview = reviews[0];

      const res = await app.request(`/api/reviews/${targetReview.id}/suggest-response`, {
        method: "POST",
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.reviewId).toBe(targetReview.id);
      expect(typeof data.suggestion).toBe("string");
      expect(data.suggestion.length).toBeGreaterThan(20);
      expect(data.category).toBe(targetReview.category);
    });

    // REGRESSION TEST CASE FOR BUG #16 (AI Suggestion on null-text review)
    it("[Regression #16] should generate an AI draft for a review with null text without crashing", async () => {
      const revsRes = await app.request("/api/reviews?businessId=biz-1");
      const reviews = await revsRes.json();
      const nullTextReview = reviews.find((r: any) => r.text === null);
      expect(nullTextReview).toBeDefined();

      const res = await app.request(`/api/reviews/${nullTextReview.id}/suggest-response`, {
        method: "POST",
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(typeof data.suggestion).toBe("string");
      expect(data.suggestion.length).toBeGreaterThan(20);
    });

    it("should return HTTP 404 for nonexistent review ID", async () => {
      const res = await app.request("/api/reviews/non-existent-review-id/suggest-response", {
        method: "POST",
      });
      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe("Review not found");
    });
  });

  describe("POST /api/billing/checkout & Webhook (Issue #19)", () => {
    it("should return a mock Stripe checkout session in sandbox mode", async () => {
      const res = await app.request("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "agency", businessId: "biz-1" }),
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.mock).toBe(true);
      expect(data.status).toBe("success");
      expect(data.tier).toBe("agency");
      expect(data.sessionId).toContain("mock_session_");

      // Verify DB was updated
      const sub = await prisma.subscription.findUnique({ where: { businessId: "biz-1" } });
      expect(sub?.tier).toBe("agency");
    });

    it("should process webhook and update subscription status", async () => {
      const res = await app.request("/api/billing/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "customer.subscription.updated",
          data: {
            object: {
              metadata: { businessId: "biz-2", tier: "pro" },
            },
          },
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.received).toBe(true);

      const sub = await prisma.subscription.findUnique({ where: { businessId: "biz-2" } });
      expect(sub?.tier).toBe("pro");
    });
  });

  describe("Multi-Tenant Isolation & Authentication Slice (Issue #20)", () => {
    it("should enforce strict row-level tenant isolation between biz-1 and biz-2", async () => {
      const res1 = await app.request("/api/reviews?businessId=biz-1");
      const reviewsBiz1 = await res1.json();

      const res2 = await app.request("/api/reviews?businessId=biz-2");
      const reviewsBiz2 = await res2.json();

      expect(reviewsBiz1.length).toBeGreaterThan(0);
      expect(reviewsBiz2.length).toBeGreaterThan(0);

      // Verify biz-1 only contains biz-1 records
      expect(reviewsBiz1.every((r: any) => r.businessId === "biz-1")).toBe(true);
      // Verify biz-2 only contains biz-2 records
      expect(reviewsBiz2.every((r: any) => r.businessId === "biz-2")).toBe(true);

      // Verify no ID overlap
      const idsBiz1 = new Set(reviewsBiz1.map((r: any) => r.id));
      const hasLeakage = reviewsBiz2.some((r: any) => idsBiz1.has(r.id));
      expect(hasLeakage).toBe(false);
    });

    it("should verify bcrypt credential hashing and tenant assignment for seeded users", async () => {
      const bcrypt = (await import("bcryptjs")).default;
      const user = await prisma.user.findUnique({
        where: { email: "admin@bistrobelle.com" },
      });

      expect(user).toBeDefined();
      expect(user?.businessId).toBe("biz-1");

      const isMatch = await bcrypt.compare("password123", user!.password);
      expect(isMatch).toBe(true);

      const wrongMatch = await bcrypt.compare("wrongpass", user!.password);
      expect(wrongMatch).toBe(false);
    });
  });
});
