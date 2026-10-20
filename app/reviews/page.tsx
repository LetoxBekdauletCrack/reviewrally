"use client";

import React, { useEffect, useState } from "react";
import { ReviewsTable } from "@/components/ReviewsTable";
import { SuggestResponseModal } from "@/components/SuggestResponseModal";
import { Review, fetchReviews, requestAiResponse } from "@/lib/api";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Suggest Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchReviews("biz-1")
      .then(setReviews)
      .catch((err) => console.error("Error fetching reviews:", err))
      .finally(() => setLoading(false));
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Reviews Feed
          </h1>
          <p className="text-sm text-muted-foreground">
            Filter, inspect sentiment categorization, and respond with one-click AI drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} className="text-xs gap-1.5 h-9">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-9">
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" className="text-xs gap-1.5 h-9">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Batch AI Review</span>
          </Button>
        </div>
      </div>

      <ReviewsTable
        reviews={reviews}
        loading={loading}
        onSuggestResponse={handleOpenSuggestModal}
      />

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
