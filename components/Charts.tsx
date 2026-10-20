"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SentimentData } from "@/lib/api";
import { Utensils, Users, Building, Inbox } from "lucide-react";

interface ChartsProps {
  data: SentimentData | null;
  loading?: boolean;
}

const SENTIMENT_COLORS = {
  Positive: "#10b981", // Emerald
  Neutral: "#94a3b8",  // Slate
  Negative: "#f43f5e", // Rose
};

export function Charts({ data, loading }: ChartsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-6">
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-full" />
        </Card>
        <Card className="lg:col-span-2 p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-60 mb-6" />
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    );
  }

  const isZeroReviews = data.totalReviews === 0;

  const pieData = isZeroReviews
    ? []
    : [
        { name: "Positive", value: data.sentimentCounts.positive },
        { name: "Neutral", value: data.sentimentCounts.neutral },
        { name: "Negative", value: data.sentimentCounts.negative },
      ];

  const total = data.totalReviews;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Sentiment Split Donut Chart */}
      <Card className="lg:col-span-1 border-border/80 flex flex-col justify-between">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Sentiment Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution across positive, neutral, and negative customer feedback
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 relative flex-1 flex flex-col items-center justify-center">
          {isZeroReviews ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-foreground">
                  Waiting for your first reviews…
                </h4>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  Customer sentiment distribution will appear here as soon as new reviews arrive.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const val = Number(item.value || 0);
                        const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                        return (
                          <div className="rounded-lg border border-border bg-card p-2 shadow-xl text-xs">
                            <span className="font-semibold" style={{ color: item.color }}>
                              {item.name}:
                            </span>{" "}
                            {val} ({pct}%)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          SENTIMENT_COLORS[
                            entry.name as keyof typeof SENTIMENT_COLORS
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => {
                      const count =
                        data.sentimentCounts[
                          value.toLowerCase() as keyof typeof data.sentimentCounts
                        ] || 0;
                      const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
                      return (
                        <span className="text-xs text-muted-foreground">
                          {value} ({pct}%)
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center stat in donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {total}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Reviews
                </span>
              </div>
            </div>
          )}

          {/* Hospitality Category Indicators */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60 text-center">
            <div className="p-2 rounded-lg bg-card/60 border border-border/60">
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Utensils className="h-3 w-3 text-amber-400" />
                <span>Food</span>
              </div>
              <span className="text-sm font-semibold">{data.categoryCounts.food}</span>
            </div>
            <div className="p-2 rounded-lg bg-card/60 border border-border/60">
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Users className="h-3 w-3 text-blue-400" />
                <span>Service</span>
              </div>
              <span className="text-sm font-semibold">{data.categoryCounts.service}</span>
            </div>
            <div className="p-2 rounded-lg bg-card/60 border border-border/60">
              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                <Building className="h-3 w-3 text-purple-400" />
                <span>Ambiance</span>
              </div>
              <span className="text-sm font-semibold">{data.categoryCounts.ambiance}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 14-Day Review Trend Area Chart */}
      <Card className="lg:col-span-2 border-border/80 flex flex-col justify-between">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                14-Day Review Volume & Sentiment Trend
              </CardTitle>
              <CardDescription className="text-xs">
                Daily incoming feedback trajectory tracking customer experience over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Positive</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-muted-foreground">Negative</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.dailyTrends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#positiveGrad)"
                  name="Positive"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#negativeGrad)"
                  name="Negative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
