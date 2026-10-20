import React from "react";
import {
  MessageSquare,
  Star,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentData } from "@/lib/api";

interface StatCardsProps {
  data: SentimentData | null;
  loading?: boolean;
}

export function StatCards({ data, loading }: StatCardsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-36" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Reviews",
      value: data.totalReviews.toLocaleString(),
      change: "+14% vs last week",
      trend: "up",
      icon: MessageSquare,
      color: "text-primary",
      bgGlow: "from-primary/10 via-transparent to-transparent",
    },
    {
      title: "Average Rating",
      value: `${data.averageRating.toFixed(1)} / 5.0`,
      change: "+0.3 stars vs 30d",
      trend: "up",
      icon: Star,
      color: "text-amber-400",
      bgGlow: "from-amber-500/10 via-transparent to-transparent",
    },
    {
      title: "Negative Feedback",
      value: data.negativeCount.toString(),
      change: "-2% fewer complaints",
      trend: "down",
      icon: AlertTriangle,
      color: "text-rose-400",
      bgGlow: "from-rose-500/10 via-transparent to-transparent",
    },
    {
      title: "AI Response Rate",
      value: `${data.responseRate}%`,
      change: "Avg response < 4 hours",
      trend: "up",
      icon: Zap,
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/10 via-transparent to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className={`glow-card relative overflow-hidden bg-gradient-to-b ${card.bgGlow}`}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="p-2 rounded-lg bg-card/80 border border-border/80">
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                  {card.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-emerald-400" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
