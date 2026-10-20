"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Review } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Star, Sparkles, Filter, Inbox } from "lucide-react";

interface ReviewsTableProps {
  reviews: Review[];
  loading?: boolean;
  onSuggestResponse?: (review: Review) => void;
}

export function ReviewsTable({
  reviews,
  loading,
  onSuggestResponse,
}: ReviewsTableProps) {
  const [filterSentiment, setFilterSentiment] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filtered = reviews.filter((r) => {
    if (filterSentiment !== "ALL" && r.sentiment !== filterSentiment) return false;
    if (filterCategory !== "ALL" && r.category !== filterCategory) return false;
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  const getSentimentVariant = (sentiment: Review["sentiment"]) => {
    switch (sentiment) {
      case "POSITIVE":
        return "positive";
      case "NEUTRAL":
        return "neutral";
      case "NEGATIVE":
        return "negative";
      default:
        return "default";
    }
  };

  // Safe excerpt formatter addressing Bug #16:
  // Handles null, undefined, and empty string safely without calling substring on null
  const renderReviewText = (text: string | null | undefined) => {
    if (!text || text.trim() === "") {
      return (
        <span className="text-muted-foreground/60 italic text-xs">
          No text provided
        </span>
      );
    }
    return (
      <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
        {text}
      </p>
    );
  };

  return (
    <Card className="border-border/80">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Customer Reviews
            </CardTitle>
            <CardDescription className="text-xs">
              Live feedback feed across connected reputation channels
            </CardDescription>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
              <Filter className="h-3 w-3" />
              <span>Filter:</span>
            </div>

            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="h-8 rounded-lg bg-card/80 border border-border/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-8 rounded-lg bg-card/80 border border-border/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">Food</option>
              <option value="SERVICE">Service</option>
              <option value="AMBIANCE">Ambiance</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-48 flex-1" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
              <Inbox className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">No reviews found</h4>
              <p className="text-xs text-muted-foreground">
                Try adjusting your filter selection or connect an additional review source.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-[160px]">Customer</TableHead>
                <TableHead className="w-[120px]">Rating</TableHead>
                <TableHead className="w-[110px]">Category</TableHead>
                <TableHead className="w-[110px]">Sentiment</TableHead>
                <TableHead>Review Content</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[150px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rev) => (
                <TableRow key={rev.id} className="group">
                  <TableCell className="font-medium text-foreground">
                    <div className="text-xs font-semibold">{rev.author}</div>
                    <div className="text-[10px] text-muted-foreground">Verified Diner</div>
                  </TableCell>
                  <TableCell>{renderStars(rev.rating)}</TableCell>
                  <TableCell>
                    <Badge variant="category" className="text-[10px] uppercase font-bold tracking-wider">
                      {rev.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getSentimentVariant(rev.sentiment)}
                      className="text-[10px] uppercase font-bold tracking-wider"
                    >
                      {rev.sentiment}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    {renderReviewText(rev.text)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(rev.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={rev.sentiment === "NEGATIVE" ? "subtle" : "outline"}
                      className="text-xs gap-1.5 h-8 font-medium shadow-none"
                      onClick={() => onSuggestResponse?.(rev)}
                    >
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>AI Draft</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
