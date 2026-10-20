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

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-001",
    author: "Elena Rostova",
    text: "The truffle pasta was lukewarm and took 45 minutes to arrive. Disappointing for the price point.",
    rating: 2,
    sentiment: "NEGATIVE",
    category: "FOOD",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "rev-002",
    author: "Marcus Chen",
    text: null, // Edge case: text is null
    rating: 1,
    sentiment: "NEGATIVE",
    category: "SERVICE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "rev-003",
    author: "Sophie Laurent",
    text: "Spectacular wine selection and intimate candlelight setting. The sommelier was world-class!",
    rating: 5,
    sentiment: "POSITIVE",
    category: "AMBIANCE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "rev-004",
    author: "David Miller",
    text: "", // Edge case: empty string
    rating: 3,
    sentiment: "NEUTRAL",
    category: "SERVICE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "rev-005",
    author: "Aria Thorne",
    text: "Waited 20 minutes past our reservation time at the hostess stand. The manager never acknowledged the delay.",
    rating: 2,
    sentiment: "NEGATIVE",
    category: "SERVICE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "rev-006",
    author: "Liam O'Connor",
    text: "Decent ribeye steak, but the dining room was so loud we could barely hear each other across a table of two.",
    rating: 3,
    sentiment: "NEUTRAL",
    category: "AMBIANCE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "rev-007",
    author: "Hannah Abbott",
    text: "Crispy duck breast was seasoned to perfection. Our server Chloe made our anniversary dinner unforgettable.",
    rating: 5,
    sentiment: "POSITIVE",
    category: "FOOD",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "rev-008",
    author: "Nathan Vance",
    text: "Cocktails took forever and bartender seemed overwhelmed on a Thursday evening.",
    rating: 2,
    sentiment: "NEGATIVE",
    category: "SERVICE",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  },
  {
    id: "rev-009",
    author: "Claire Dupont",
    text: "Outstanding tiramisu and warm hospitality. Will definitely bring our out-of-town guests here again.",
    rating: 5,
    sentiment: "POSITIVE",
    category: "FOOD",
    businessId: "biz-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
  },
];

export async function getReviews(businessId = "biz-1"): Promise<Review[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_REVIEWS.filter((r) => r.businessId === businessId);
}

export async function getSentiment(businessId = "biz-1"): Promise<SentimentData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const reviews = MOCK_REVIEWS.filter((r) => r.businessId === businessId);
  const totalReviews = reviews.length;
  const avg =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;
  const negativeReviews = reviews.filter((r) => r.sentiment === "NEGATIVE");

  const dailyTrends = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const pos = Math.floor(Math.random() * 4) + 1;
    const neu = Math.floor(Math.random() * 2);
    const neg = Math.floor(Math.random() * 2);
    return {
      date: dateStr,
      positive: pos,
      neutral: neu,
      negative: neg,
      total: pos + neu + neg,
    };
  });

  return {
    totalReviews,
    averageRating: Number(avg.toFixed(1)),
    negativeCount: negativeReviews.length,
    responseRate: 92,
    sentimentCounts: {
      positive: reviews.filter((r) => r.sentiment === "POSITIVE").length,
      neutral: reviews.filter((r) => r.sentiment === "NEUTRAL").length,
      negative: negativeReviews.length,
    },
    categoryCounts: {
      food: reviews.filter((r) => r.category === "FOOD").length,
      service: reviews.filter((r) => r.category === "SERVICE").length,
      ambiance: reviews.filter((r) => r.category === "AMBIANCE").length,
    },
    dailyTrends,
  };
}

export async function suggestResponse(reviewId: string): Promise<ResponseSuggestion> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  if (!review) {
    throw new Error(`Review with ID "${reviewId}" not found`);
  }

  let suggestion = "";
  if (review.sentiment === "NEGATIVE") {
    if (review.category === "FOOD") {
      suggestion = `Dear ${review.author},\n\nThank you for bringing your dining experience to our attention. We hold our kitchen to the highest culinary standards, and we sincerely apologize that your meal did not reflect the quality and temperature you expected. We would love the opportunity to make this right on your next visit. Please reach out directly to our General Manager at gm@reviewrally.com so we can extend a personal invitation.\n\nWarm regards,\nThe Management Team`;
    } else if (review.category === "SERVICE") {
      suggestion = `Dear ${review.author},\n\nWe appreciate you taking the time to share your feedback. Timely, attentive service is central to who we are, and we are genuinely sorry that your party experienced unacceptable delays. We have addressed this directly with our front-of-house team. Please contact us at hospitality@reviewrally.com so we can welcome you back for the seamless experience you deserve.\n\nSincerely,\nGuest Relations`;
    } else {
      suggestion = `Dear ${review.author},\n\nThank you for your candid feedback regarding our ambiance. We strive to maintain a balanced, comfortable atmosphere for all guests, and we apologize if the noise levels impacted your conversation. We value your patronage and look forward to reserving a quieter booth for you next time.\n\nWarm regards,\nThe Team`;
    }
  } else if (review.sentiment === "POSITIVE") {
    suggestion = `Dear ${review.author},\n\nThank you so much for the glowing review! We are delighted to hear you enjoyed your visit with us. Our team puts heart into every detail, and your words mean the world. We cannot wait to welcome you back again soon!\n\nCheers,\nThe Team`;
  } else {
    suggestion = `Dear ${review.author},\n\nThank you for visiting and taking the time to leave your feedback. We are always working to elevate our guest experience and would love to hear any additional thoughts you have. We hope to see you again soon!\n\nBest regards,\nThe Team`;
  }

  return {
    reviewId: review.id,
    suggestion,
    category: review.category,
    suggestedAction: "Copy to clipboard and paste to Google Business / Yelp",
  };
}
