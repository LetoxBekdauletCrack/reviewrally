import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const AUTHORS = [
  "Elena Rostova", "Marcus Chen", "Sophie Laurent", "David Miller",
  "Aria Thorne", "Liam O'Connor", "Hannah Abbott", "Nathan Vance",
  "Claire Dupont", "Julian Morales", "Maya Lin", "Oliver Bennett",
  "Emma Watson", "Lucas Silva", "Isabella Rossi", "Noah Kim",
  "Chloe Davenport", "Alexander Wright", "Zoe Kravitz", "Benjamin Hayes"
];

const FOOD_POSITIVE_SNIPPETS = [
  "The truffle risotto was cooked to sheer perfection. Rich, aromatic, and decadent.",
  "Crispy duck confit with cherry reduction was phenomenal. High culinary mastery.",
  "Fresh handmade pasta with burrata that melted instantly. Will definitely return!",
  "The dry-aged ribeye had exceptional crust and marbling. One of the best steaks in town."
];

const FOOD_NEGATIVE_SNIPPETS = [
  "The salmon was lukewarm and dry in the center. Extremely disappointing for $42.",
  "Soup was completely over-salted and pasta was rubbery and overcooked.",
  "Burger bun was soggy and French fries arrived cold and stale.",
  "Underwhelmed by the steak, requested medium-rare but arrived well-done and chewy."
];

const SERVICE_POSITIVE_SNIPPETS = [
  "Our server Chloe was attentive, knowledgeable, and timed every course flawlessly.",
  "Staff welcomed us warmly and accommodated our allergy requirements with immense care.",
  "Fast, gracious service even during peak Saturday dinner rush. Outstanding team work.",
  "The general manager personally checked on our table to ensure everything was perfect."
];

const SERVICE_NEGATIVE_SNIPPETS = [
  "Waited 35 minutes just to have our drink orders taken. Hostess was completely indifferent.",
  "Server disappeared after dropping the entrees. Had to flag down another staff member for water.",
  "Brought out the wrong appetizers twice and bill had erroneous charges on it.",
  "Very rude bartender when asking for a mocktail option on a Thursday night."
];

const AMBIANCE_POSITIVE_SNIPPETS = [
  "Intimate candlelight, plush velvet seating, and smooth jazz. The perfect anniversary ambiance.",
  "Stunning modern interior design with warm wooden accents and gorgeous acoustic balance.",
  "Cozy courtyard patio with fairy lights and lovely heater lamps. Magical evening.",
  "Tasteful decor and vibrant cocktail lounge energy without being overpowering."
];

const AMBIANCE_NEGATIVE_SNIPPETS = [
  "The dining room was deafeningly loud; we literally had to shout across a 2-person table.",
  "Drafty table placed right next to the drafty front entrance door. Freezing throughout.",
  "Tables are crammed together so tightly that servers kept bumping into our chairs.",
  "Harsh fluorescent lighting killed what was supposed to be a romantic dinner."
];

const NEUTRAL_SNIPPETS = [
  "Decent meal overall, but nothing particularly stood out as memorable.",
  "Average experience. Food was okay, prices are on the higher side.",
  "Standard bistro fare. Acceptable for a quick weekday lunch.",
  "Pleasant atmosphere, though menu selections felt slightly limited."
];

async function main() {
  console.log("Seeding database with businesses, users, and 500 realistic reviews...");

  // 1. Clean existing records
  await prisma.review.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  // 2. Create Businesses
  const biz1 = await prisma.business.create({
    data: {
      id: "biz-1",
      name: "Bistro Belle (Downtown)",
      tier: "pro",
    },
  });

  const biz2 = await prisma.business.create({
    data: {
      id: "biz-2",
      name: "The Grand Grill (Westside)",
      tier: "starter",
    },
  });

  // 3. Create Users with bcrypt passwords
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.createMany({
    data: [
      {
        id: "usr-1",
        email: "admin@bistrobelle.com",
        name: "Elena (Owner)",
        password: passwordHash,
        businessId: biz1.id,
      },
      {
        id: "usr-2",
        email: "admin@grandgrill.com",
        name: "Marcus (General Manager)",
        password: passwordHash,
        businessId: biz2.id,
      },
    ],
  });

  // 4. Create Subscriptions
  await prisma.subscription.createMany({
    data: [
      {
        businessId: biz1.id,
        tier: "pro",
        status: "active",
        stripeSessionId: "mock_sub_session_pro",
      },
      {
        businessId: biz2.id,
        tier: "starter",
        status: "active",
        stripeSessionId: "mock_sub_session_starter",
      },
    ],
  });

  // 5. Generate 500 reviews across 14 days
  const reviewsData: any[] = [];
  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 500; i++) {
    const author = AUTHORS[i % AUTHORS.length];
    const timestamp = new Date(now - Math.floor(Math.random() * fourteenDaysMs));
    const businessId = i % 8 === 0 ? "biz-2" : "biz-1"; // 87.5% biz-1, 12.5% biz-2

    // Category distribution: 50% Food, 30% Service, 20% Ambiance
    const catRand = Math.random();
    let category: "FOOD" | "SERVICE" | "AMBIANCE" = "FOOD";
    if (catRand > 0.8) category = "AMBIANCE";
    else if (catRand > 0.5) category = "SERVICE";

    // Rating distribution: 65% Positive (4-5), 20% Neutral (3), 15% Negative (1-2)
    const ratingRand = Math.random();
    let rating = 5;
    let sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" = "POSITIVE";
    let text: string | null = "";

    // Explicit edge cases:
    if (i === 12 || i === 87 || i === 245) {
      // EDGE CASE 1: null text
      text = null;
      rating = 1;
      sentiment = "NEGATIVE";
      category = "SERVICE";
    } else if (i === 34 || i === 150) {
      // EDGE CASE 2: empty string text
      text = "";
      rating = 3;
      sentiment = "NEUTRAL";
      category = "FOOD";
    } else if (ratingRand < 0.15) {
      // Negative
      rating = Math.random() < 0.5 ? 1 : 2;
      sentiment = "NEGATIVE";
      if (category === "FOOD") {
        text = FOOD_NEGATIVE_SNIPPETS[i % FOOD_NEGATIVE_SNIPPETS.length];
      } else if (category === "SERVICE") {
        text = SERVICE_NEGATIVE_SNIPPETS[i % SERVICE_NEGATIVE_SNIPPETS.length];
      } else {
        text = AMBIANCE_NEGATIVE_SNIPPETS[i % AMBIANCE_NEGATIVE_SNIPPETS.length];
      }
    } else if (ratingRand < 0.35) {
      // Neutral
      rating = 3;
      sentiment = "NEUTRAL";
      text = NEUTRAL_SNIPPETS[i % NEUTRAL_SNIPPETS.length];
    } else {
      // Positive
      rating = Math.random() < 0.6 ? 5 : 4;
      sentiment = "POSITIVE";
      if (category === "FOOD") {
        text = FOOD_POSITIVE_SNIPPETS[i % FOOD_POSITIVE_SNIPPETS.length];
      } else if (category === "SERVICE") {
        text = SERVICE_POSITIVE_SNIPPETS[i % SERVICE_POSITIVE_SNIPPETS.length];
      } else {
        text = AMBIANCE_POSITIVE_SNIPPETS[i % AMBIANCE_POSITIVE_SNIPPETS.length];
      }
    }

    reviewsData.push({
      author,
      text,
      rating,
      sentiment,
      category,
      businessId,
      createdAt: timestamp,
    });
  }

  // Batch insert in chunks of 100
  for (let i = 0; i < reviewsData.length; i += 100) {
    const chunk = reviewsData.slice(i, i + 100);
    await prisma.review.createMany({ data: chunk });
  }

  const count = await prisma.review.count();
  console.log(`Successfully seeded ${count} reviews into SQLite database.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
