export interface Review {
  id: string;
  author: string;
  text: string | null;
  rating: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  category: "FOOD" | "SERVICE" | "AMBIANCE";
  businessId: string;
  createdAt: string;
}

export interface SentimentData {
  totalReviews: number;
  averageRating: number;
  negativeCount: number;
  responseRate: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  categoryCounts: {
    food: number;
    service: number;
    ambiance: number;
  };
  dailyTrends: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  }>;
}

export interface ResponseSuggestion {
  reviewId: string;
  suggestion: string;
  category: string;
  suggestedAction: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchReviews(
  businessId = "biz-1",
  sentiment?: string,
  category?: string
): Promise<Review[]> {
  const params = new URLSearchParams({ businessId });
  if (sentiment && sentiment !== "ALL") params.append("sentiment", sentiment);
  if (category && category !== "ALL") params.append("category", category);

  const res = await fetch(`${API_BASE}/api/reviews?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchSentiment(businessId = "biz-1"): Promise<SentimentData> {
  const params = new URLSearchParams({ businessId });
  const res = await fetch(`${API_BASE}/api/analytics/sentiment?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch sentiment analytics: ${res.statusText}`);
  }
  return res.json();
}

export async function requestAiResponse(reviewId: string): Promise<ResponseSuggestion> {
  const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/suggest-response`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to generate AI response: ${res.statusText}`);
  }
  return res.json();
}
