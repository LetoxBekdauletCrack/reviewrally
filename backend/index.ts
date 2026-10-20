import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { prismaStore, prisma } from "./prisma-store.js";
import { inMemoryStore } from "./in-memory-store.js";

export const app = new Hono();

// Check if store mode is in-memory or prisma (defaults to prisma)
const usePrisma = process.env.STORE_MODE !== "in-memory";

// CORS configuration for frontend
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// 1. Health check
app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    service: "reviewrally-api",
    persistence: usePrisma ? "sqlite" : "in-memory",
    timestamp: new Date().toISOString(),
  });
});

// 2. Reviews endpoint
app.get("/api/reviews", async (c) => {
  const businessId = c.req.query("businessId") || "biz-1";
  const sentiment = c.req.query("sentiment");
  const category = c.req.query("category");

  const reviews = usePrisma
    ? await prismaStore.getReviews(businessId, sentiment, category)
    : inMemoryStore.getReviews(businessId, sentiment, category);

  return c.json(reviews);
});

// 3. Analytics sentiment endpoint
app.get("/api/analytics/sentiment", async (c) => {
  const businessId = c.req.query("businessId") || "biz-1";
  const data = usePrisma
    ? await prismaStore.getSentiment(businessId)
    : inMemoryStore.getSentiment(businessId);

  return c.json(data);
});

// 4. Suggest AI response endpoint
app.post("/api/reviews/:id/suggest-response", async (c) => {
  const id = c.req.param("id");
  const suggestion = usePrisma
    ? await prismaStore.suggestResponse(id)
    : inMemoryStore.suggestResponse(id);

  if (!suggestion) {
    return c.json({ error: "Review not found" }, 404);
  }

  return c.json(suggestion);
});

// 5. Billing Stripe checkout endpoint (Post-MVP slice with mock fallback)
app.post("/api/billing/checkout", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const tier = body.tier || "pro";
  const businessId = body.businessId || "biz-1";

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `ReviewRally ${tier.toUpperCase()} Plan` },
              unit_amount: tier === "agency" ? 19900 : tier === "pro" ? 7900 : 2900,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: "http://localhost:3000/billing?success=true",
        cancel_url: "http://localhost:3000/billing?canceled=true",
        metadata: { businessId, tier },
      });
      return c.json({ url: session.url, sessionId: session.id, mock: false });
    } catch (err: any) {
      console.warn("Stripe live session error, proceeding with mock fallback:", err.message);
    }
  }

  // Fallback to test/mock mode session
  const mockSessionId = `mock_session_${Date.now()}`;
  await prisma.subscription.upsert({
    where: { businessId },
    update: { tier, status: "active", stripeSessionId: mockSessionId },
    create: { businessId, tier, status: "active", stripeSessionId: mockSessionId },
  });

  return c.json({
    mock: true,
    sessionId: mockSessionId,
    tier,
    status: "success",
    message: `Mock Stripe Checkout session created for ${tier.toUpperCase()} tier`,
  });
});

// 6. Billing Stripe webhook handler
app.post("/api/billing/webhook", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const event = body.type || "customer.subscription.updated";
  const businessId = body.data?.object?.metadata?.businessId || "biz-1";
  const tier = body.data?.object?.metadata?.tier || "pro";

  await prisma.subscription.upsert({
    where: { businessId },
    update: { tier, status: "active" },
    create: { businessId, tier, status: "active" },
  });

  return c.json({ received: true, event });
});

// Start listener when executed directly
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
if (process.env.NODE_ENV !== "test") {
  serve(
    {
      fetch: app.fetch,
      port: PORT,
    },
    (info) => {
      console.log(`🚀 ReviewRally Hono server listening on http://localhost:${info.port}`);
    }
  );
}
