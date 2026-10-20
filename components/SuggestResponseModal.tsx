"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/lib/api";
import { Sparkles, Copy, Check, MessageSquare } from "lucide-react";

interface SuggestResponseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  suggestion: string | null;
  loading: boolean;
  error?: string | null;
}

export function SuggestResponseModal({
  open,
  onOpenChange,
  review,
  suggestion,
  loading,
  error,
}: SuggestResponseModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (suggestion) {
      navigator.clipboard.writeText(suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-7 w-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <DialogTitle>AI Response Assistant</DialogTitle>
        </div>
        <DialogDescription>
          Context-aware, empathetic response drafted for {review.author}
        </DialogDescription>
      </DialogHeader>

      {/* Review Context Card */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 mb-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Review by {review.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="category" className="text-[10px]">
              {review.category}
            </Badge>
            <Badge
              variant={
                review.sentiment === "NEGATIVE"
                  ? "negative"
                  : review.sentiment === "POSITIVE"
                  ? "positive"
                  : "neutral"
              }
              className="text-[10px]"
            >
              {review.sentiment}
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground italic">
          "{review.text || "No text provided (Rating-only review)"}"
        </p>
      </div>

      {/* AI Draft Body */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Suggested Reply
          </span>
          <span className="text-[11px] text-muted-foreground">
            Professional & Empathetic Tone
          </span>
        </div>

        {loading ? (
          <div className="h-44 rounded-xl border border-border/80 bg-card/60 p-4 flex flex-col items-center justify-center space-y-3">
            <Sparkles className="h-6 w-6 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground animate-pulse">
              Generating tailored reputation resolution...
            </span>
          </div>
        ) : error ? (
          <div className="h-32 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-rose-400 font-medium">{error}</p>
          </div>
        ) : (
          <textarea
            readOnly
            value={suggestion || ""}
            className="w-full h-44 rounded-xl border border-border/80 bg-card/90 p-3.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed font-sans resize-none"
          />
        )}
      </div>

      <DialogFooter>
        <div className="w-full flex items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground hidden sm:block">
            Ready to paste into Google Maps or Yelp
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              disabled={loading || !suggestion}
              onClick={handleCopy}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
