export interface BackendReview {
  id: string;
  author: string;
  text: string | null;
  rating: number;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  category: "FOOD" | "SERVICE" | "AMBIANCE";
  businessId: string;
  createdAt: string;
}

export class InMemoryReviewStore {
  private reviews: Map<string, BackendReview> = new Map();

  constructor() {
    this.seedInitial();
  }

  private seedInitial() {
    const initialData: BackendReview[] = [
      {
        id: "rev-mem-1",
        author: "Elena Rostova",
        text: "The truffle pasta was lukewarm and took 45 minutes to arrive. Disappointing for the price point.",
        rating: 2,
        sentiment: "NEGATIVE",
        category: "FOOD",
        businessId: "biz-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
      {
        id: "rev-mem-2",
        author: "Marcus Chen",
        text: null, // Edge case: text is null
        rating: 1,
        sentiment: "NEGATIVE",
        category: "SERVICE",
        businessId: "biz-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: "rev-mem-3",
        author: "Sophie Laurent",
        text: "Spectacular wine selection and intimate candlelight setting. The sommelier was world-class!",
        rating: 5,
        sentiment: "POSITIVE",
        category: "AMBIANCE",
        businessId: "biz-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "rev-mem-4",
        author: "David Miller",
        text: "", // Edge case: empty text
        rating: 3,
        sentiment: "NEUTRAL",
        category: "SERVICE",
        businessId: "biz-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        id: "rev-mem-5",
        author: "Chloe Davenport",
        text: "Staff was remarkably polite and accommodated our peanut allergy flawlessly.",
        rating: 5,
        sentiment: "POSITIVE",
        category: "SERVICE",
        businessId: "biz-1",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ];

    for (const r of initialData) {
      this.reviews.set(r.id, r);
    }
  }

  public getReviews(businessId = "biz-1", sentiment?: string, category?: string): BackendReview[] {
    let list = Array.from(this.reviews.values()).filter((r) => r.businessId === businessId);
    if (sentiment && sentiment !== "ALL") {
      list = list.filter((r) => r.sentiment === sentiment);
    }
    if (category && category !== "ALL") {
      list = list.filter((r) => r.category === category);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReviewById(id: string): BackendReview | undefined {
    return this.reviews.get(id);
  }

  public getSentiment(businessId = "biz-1") {
    const reviews = Array.from(this.reviews.values()).filter((r) => r.businessId === businessId);
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

  public suggestResponse(id: string) {
    const review = this.reviews.get(id);
    if (!review) return null;

    let suggestion = "";
    if (review.sentiment === "NEGATIVE") {
      if (review.category === "FOOD") {
        suggestion = `Dear ${review.author},\n\nThank you for bringing your meal experience to our attention. We hold our kitchen to the highest culinary standards, and we sincerely apologize that your food did not meet expectations. We would love the chance to welcome you back for a complimentary tasting. Please email gm@reviewrally.com so we can take care of you.\n\nWarm regards,\nThe Culinary Team`;
      } else if (review.category === "SERVICE") {
        suggestion = `Dear ${review.author},\n\nWe appreciate you taking the time to share your feedback. Timely, gracious service is our top priority, and we regret falling short during your visit. We have reviewed this with our service staff. Please contact us at hospitality@reviewrally.com so we can invite you back.\n\nSincerely,\nGuest Services`;
      } else {
        suggestion = `Dear ${review.author},\n\nThank you for your feedback regarding our atmosphere. We aim to ensure a comfortable ambiance for all guests and apologize if noise or seating caused any inconvenience. We look forward to welcoming you back for a quieter experience.\n\nWarm regards,\nThe Management`;
      }
    } else if (review.sentiment === "POSITIVE") {
      suggestion = `Dear ${review.author},\n\nThank you so much for the fantastic feedback! We are thrilled that you had a wonderful time with us and cannot wait to welcome you back soon.\n\nCheers,\nThe Team`;
    } else {
      suggestion = `Dear ${review.author},\n\nThank you for sharing your feedback with us. We value your input as we continually refine our guest experience. We look forward to hosting you again.\n\nBest regards,\nThe Team`;
    }

    return {
      reviewId: review.id,
      suggestion,
      category: review.category,
      suggestedAction: "Copy to clipboard and paste to Google Business",
    };
  }
}

export const inMemoryStore = new InMemoryReviewStore();
