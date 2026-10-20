"use client";

import React, { useEffect, useState } from "react";
import { Charts } from "@/components/Charts";
import { StatCards } from "@/components/StatCards";
import { SentimentData, fetchSentiment } from "@/lib/api";

export default function AnalyticsPage() {
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentiment("biz-1")
      .then(setSentiment)
      .catch((err) => console.error("Error fetching sentiment:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reputation Analytics & Sentiment Intelligence
        </h1>
        <p className="text-sm text-muted-foreground">
          Deep dive into category distribution and sentiment volume trajectory.
        </p>
      </div>

      <StatCards data={sentiment} loading={loading} />
      <Charts data={sentiment} loading={loading} />
    </div>
  );
}
