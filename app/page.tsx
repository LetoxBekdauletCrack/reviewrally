"use client";

import React, { useEffect, useState } from "react";
import { StatCards } from "@/components/StatCards";
import { Charts } from "@/components/Charts";
import { ReviewsTable } from "@/components/ReviewsTable";
import { SuggestResponseModal } from "@/components/SuggestResponseModal";
import {
  Review,
  SentimentData,
  fetchReviews,
  fetchSentiment,
  requestAiResponse,
} from "@/lib/api";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Suggest Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [revs, sent] = await Promise.all([
        fetchReviews("biz-1"),
        fetchSentiment("biz-1"),
      ]);
      setReviews(revs);
      setSentiment(sent);
    } catch (err: any) {
      console.error("Failed to load dashboard data from Hono API", err);
      setError(err?.message || "Failed to connect to ReviewRally backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSuggestModal = async (review: Review) => {
    setSelectedReview(review);
    setAiSuggestion(null);
    setSuggestError(null);
    setModalOpen(true);
    setSuggestLoading(true);

    try {
      const res = await requestAiResponse(review.id);
      setAiSuggestion(res.suggestion);
    } catch (err: any) {
      setSuggestError(err?.message || "Failed to generate AI response");
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Reputation Overview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30">
              Live SQLite Data
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor customer ratings, identify kitchen vs service friction points, and de-escalate with AI drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Feed</span>
          </Button>

          <Button size="sm" className="text-xs gap-1.5 h-9 shadow-lg shadow-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Auto-Draft All Pending</span>
          </Button>
        </div>
      </div>

      {/* Error state with retry */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <div className="font-semibold text-sm">Connection Alert</div>
              <div className="text-xs opacity-90">{error}</div>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={loadData} className="text-xs">
            Retry Connection
          </Button>
        </div>
      )}

      {/* 1. Stat Cards */}
      <StatCards data={sentiment} loading={loading} />

      {/* 2. Visual Analytics (Charts) */}
      <Charts data={sentiment} loading={loading} />

      {/* 3. Customer Reviews Feed */}
      <ReviewsTable
        reviews={reviews}
        loading={loading}
        onSuggestResponse={handleOpenSuggestModal}
      />

      {/* Suggest AI Response Modal */}
      <SuggestResponseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        review={selectedReview}
        suggestion={aiSuggestion}
        loading={suggestLoading}
        error={suggestError}
      />
    </div>
  );
}
