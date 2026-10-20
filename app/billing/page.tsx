"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Shield, Zap, CreditCard, ArrowRight } from "lucide-react";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Ideal for single-location restaurants & cafes beginning reputation automation.",
    features: [
      "Up to 150 reviews analyzed / mo",
      "Food, Service, Ambiance sentiment tags",
      "Manual AI response generation",
      "Single location profile",
      "Weekly email digest",
    ],
    popular: false,
    cta: "Select Starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "Best for high-volume dining establishments and boutique hospitality.",
    features: [
      "Unlimited review ingestion",
      "Priority AI empathetic response generation",
      "14-day trend analytics & exports",
      "Multi-user team access",
      "Real-time negative review alerts",
      "Stripe payment integration",
    ],
    popular: true,
    cta: "Current Plan",
  },
  {
    id: "agency",
    name: "Agency / Multi-Unit",
    price: "$199",
    period: "/month",
    description: "Engineered for franchise operators and marketing agencies managing multiple brands.",
    features: [
      "Multi-tenant workspace isolation",
      "Unlimited client locations",
      "Dedicated account manager",
      "Custom brand voice AI fine-tuning",
      "Webhook & API access",
    ],
    popular: false,
    cta: "Upgrade to Agency",
  },
];

export default function BillingPage() {
  const [currentTier, setCurrentTier] = useState("pro");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleCheckout = async (tierId: string) => {
    setCheckoutLoading(tierId);
    setMessage(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.mock) {
        setCurrentTier(tierId);
        setMessage(`Successfully switched to ${tierId.toUpperCase()} plan (Stripe Mock Mode)!`);
      }
    } catch (err: any) {
      // In early frontend-only mock mode:
      setCurrentTier(tierId);
      setMessage(`Switched to ${tierId.toUpperCase()} plan (Client Mock Mode)!`);
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Subscription & Billing Plans
        </h1>
        <p className="text-sm text-muted-foreground">
          Transparent, ROI-focused plans designed to protect and accelerate your hospitality revenue.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          return (
            <Card
              key={tier.id}
              className={`relative flex flex-col justify-between ${
                tier.popular
                  ? "border-primary/50 shadow-lg shadow-primary/10 bg-gradient-to-b from-primary/10 via-card to-card"
                  : "border-border/80"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="text-[11px] font-bold px-3 py-0.5 shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-extrabold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <CardDescription className="text-xs mt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0 flex-1">
                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  {tier.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-foreground/90">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full gap-2 text-xs h-9"
                  variant={isCurrent ? "outline" : tier.popular ? "default" : "secondary"}
                  disabled={isCurrent || checkoutLoading === tier.id}
                  onClick={() => handleCheckout(tier.id)}
                >
                  {checkoutLoading === tier.id ? (
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  ) : isCurrent ? (
                    <Shield className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <CreditCard className="h-3.5 w-3.5" />
                  )}
                  <span>{isCurrent ? "Active Plan" : tier.cta}</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
