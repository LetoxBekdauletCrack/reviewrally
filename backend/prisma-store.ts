import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaReviewStore {
  async getReviews(businessId = "biz-1", sentiment?: string, category?: string) {
    const where: any = { businessId };
    if (sentiment && sentiment !== "ALL") {
      where.sentiment = sentiment;
    }
    if (category && category !== "ALL") {
      where.category = category;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async getReviewById(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) return null;
    return {
      ...review,
      createdAt: review.createdAt.toISOString(),
    };
  }

  async getSentiment(businessId = "biz-1") {
    const reviews = await prisma.review.findMany({
      where: { businessId },
    });

    const totalReviews = reviews.length;
    const avg =
      totalReviews > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;
    const negativeReviews = reviews.filter((r) => r.sentiment === "NEGATIVE");

    // Group reviews into daily buckets for the last 14 days
    const dailyMap = new Map<string, { positive: number; neutral: number; negative: number; total: number }>();
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyMap.set(dateStr, { positive: 0, neutral: 0, negative: 0, total: 0 });
    }

    for (const r of reviews) {
      const dateStr = r.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dailyMap.has(dateStr)) {
        const bucket = dailyMap.get(dateStr)!;
        bucket.total++;
        if (r.sentiment === "POSITIVE") bucket.positive++;
        else if (r.sentiment === "NEUTRAL") bucket.neutral++;
        else if (r.sentiment === "NEGATIVE") bucket.negative++;
      }
    }

    const dailyTrends = Array.from(dailyMap.entries()).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    return {
      totalReviews,
      averageRating: Number(avg.toFixed(1)),
      negativeCount: negativeReviews.length,
      responseRate: totalReviews > 0 ? 94 : 0,
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

  async suggestResponse(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) return null;

    let suggestion = "";
    if (review.sentiment === "NEGATIVE") {
      if (review.category === "FOOD") {
        suggestion = `Dear ${review.author},\n\nThank you for bringing your dining experience to our attention. We hold our kitchen to the highest culinary standards, and we sincerely apologize that your meal did not reflect the quality and temperature you expected. We would love the opportunity to make this right on your next visit. Please reach out directly to our General Manager at gm@reviewrally.com so we can extend a personal invitation.\n\nWarm regards,\nThe Culinary Team`;
      } else if (review.category === "SERVICE") {
        suggestion = `Dear ${review.author},\n\nWe appreciate you taking the time to share your feedback. Timely, attentive service is central to who we are, and we are genuinely sorry that your party experienced unacceptable delays. We have addressed this directly with our front-of-house team. Please contact us at hospitality@reviewrally.com so we can welcome you back for the seamless experience you deserve.\n\nSincerely,\nGuest Relations`;
      } else {
        suggestion = `Dear ${review.author},\n\nThank you for your candid feedback regarding our ambiance. We strive to maintain a balanced, comfortable atmosphere for all guests, and we apologize if the noise levels or seating impacted your experience. We value your patronage and look forward to reserving a quieter booth for you next time.\n\nWarm regards,\nThe Management Team`;
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
}

export const prismaStore = new PrismaReviewStore();
export { prisma };
