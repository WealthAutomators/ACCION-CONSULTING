import { ProductReview, RatingBreakdown } from "@/types";

const FIRST_NAMES = [
  "Sarah", "James", "Emily", "Michael", "Jessica", "David", "Amanda", "Robert",
  "Jennifer", "Chris", "Lauren", "Daniel", "Rachel", "Mark", "Ashley", "Brian",
  "Nicole", "Kevin", "Stephanie", "Jason", "Michelle", "Ryan", "Laura", "Eric",
  "Heather", "Matt", "Kimberly", "Andrew", "Lisa", "Thomas",
];

const LAST_INITIALS = "ABCDEFGHJKLMNPRSTW";

const REVIEW_PHOTOS = Array.from({ length: 8 }, (_, i) => `/reviews/review-${i + 1}.jpg`);

const REVIEW_TITLES_5 = [
  "Absolutely love this",
  "Best purchase I've made",
  "Exceeded my expectations",
  "Worth every penny",
  "Perfect quality",
  "Will buy again",
  "Highly recommend",
  "Exactly what I needed",
  "Outstanding product",
  "My new favorite",
  "Couldn't be happier",
  "Fantastic find",
  "Great value for the price",
  "Surpassed expectations",
  "Works perfectly",
];

const REVIEW_TITLES_4 = [
  "Very good, minor issue",
  "Great overall",
  "Almost perfect",
  "Good quality, slow shipping",
  "Really nice, slightly smaller than expected",
  "Solid purchase",
  "Happy with it",
  "Good but not perfect",
];

const REVIEW_TITLES_3 = [
  "Decent but expected more",
  "It's okay",
  "Average quality",
  "Mixed feelings",
  "Not bad, not great",
];

const BODIES_5 = [
  "Ordered this along with a few other items and everything arrived well-packaged. Quality is exactly what you'd expect from a premium marketplace. Already planning my next order.",
  "I've compared prices across several sites and this was the best deal. Product works flawlessly and shipping was faster than expected. Very impressed with FELI.",
  "Bought this as a gift and the recipient loved it. Packaging was neat, product feels premium, and it works exactly as described. Will definitely shop here again.",
  "This has become a daily essential in our household. Build quality is solid, setup was easy, and it performs better than products I've paid twice as much for elsewhere.",
  "Wasn't sure about ordering online but this exceeded all expectations. Arrived in two days, works perfectly out of the box, and customer support answered my pre-purchase questions quickly.",
  "Third time ordering from FELI and they never disappoint. Consistent quality, fair prices, and reliable shipping every single time. Highly recommend.",
  "The product photos don't do it justice — it's even better in person. Sturdy construction, thoughtful design details, and great value for what you get.",
  "Perfect for what I needed. Easy to use, well-made, and the price point is very competitive. My whole family has been using it daily since it arrived.",
  "I read a lot of reviews before buying and I'm glad I went with this one. Does everything it promises and then some. Five stars without hesitation.",
  "Fast delivery, great packaging, and a product that actually lives up to the description. It's rare to find all three — FELI nailed it.",
  "Replaced an older version of a similar product and this is a massive upgrade. Better materials, better performance, and it looks great too.",
  "Ordered during a sale and still would have been happy at full price. Quality is top-notch and it integrated seamlessly into my daily routine.",
];

const BODIES_4 = [
  "Really happy with this purchase overall. Product quality is great and it works as expected. Took an extra day to ship but arrived in good condition.",
  "Good product for the price. Does what it's supposed to do well. Only minor complaint is the instruction manual could be clearer, but setup was still manageable.",
  "Solid quality and fast delivery. Gave 4 stars instead of 5 because it's slightly smaller than I imagined from the photos, but functionally it's excellent.",
  "Very pleased with the purchase. Works great and looks good. One small cosmetic imperfection on arrival but nothing that affects performance.",
  "Good value and reliable performance. Would recommend to others. Shipping was a bit slower than the estimate but the product itself is worth the wait.",
  "Nice product that meets expectations. Quality materials and decent packaging. Lost one star because I wish there were more color options available.",
];

const BODIES_3 = [
  "It's fine for the price. Does the job but nothing particularly stood out. Shipping was quick which was a plus. Might look at alternatives next time.",
  "Average product — works but I expected a bit more given the reviews. Might improve with more use. Customer service was helpful when I had questions.",
  "Decent enough. Not bad quality but not amazing either. It serves its purpose. Would consider buying again if the price drops.",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function formatDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function generateReviewsForProduct(productId: string, productName: string): ProductReview[] {
  const seed = hashString(productId);
  const rand = seededRandom(seed);
  const count = 12 + Math.floor(rand() * 9);

  const reviews: ProductReview[] = [];

  const ratingDistribution: number[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    if (r < 0.62) ratingDistribution.push(5);
    else if (r < 0.85) ratingDistribution.push(4);
    else if (r < 0.95) ratingDistribution.push(3);
    else if (r < 0.98) ratingDistribution.push(2);
    else ratingDistribution.push(1);
  }

  ratingDistribution.sort((a, b) => b - a);

  for (let i = 0; i < count; i++) {
    const rating = ratingDistribution[i];
    const firstName = pick(FIRST_NAMES, rand);
    const lastInitial = LAST_INITIALS[Math.floor(rand() * LAST_INITIALS.length)];

    let title: string;
    let body: string;

    if (rating >= 5) {
      title = pick(REVIEW_TITLES_5, rand);
      body = pick(BODIES_5, rand);
    } else if (rating >= 4) {
      title = pick(REVIEW_TITLES_4, rand);
      body = pick(BODIES_4, rand);
    } else {
      title = pick(REVIEW_TITLES_3, rand);
      body = pick(BODIES_3, rand);
    }

    if (i === 0) {
      body = `${body.split(".")[0]}. The ${productName.toLowerCase()} specifically has been great — ${body.split(".").slice(1).join(".").trim()}`;
    }

    const daysAgo = Math.floor(rand() * 365) + 1;
    const hasImage = rating >= 4 && rand() > 0.75;

    reviews.push({
      id: `${productId}-review-${i}`,
      productId,
      name: `${firstName} ${lastInitial}.`,
      rating,
      title,
      body,
      date: formatDate(daysAgo),
      verified: rand() > 0.15,
      helpful: Math.floor(rand() * 48),
      image: hasImage ? REVIEW_PHOTOS[Math.floor(rand() * REVIEW_PHOTOS.length)] : undefined,
    });
  }

  return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRatingBreakdown(reviews: ProductReview[]): RatingBreakdown {
  const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = r.rating as keyof RatingBreakdown;
    if (key >= 1 && key <= 5) breakdown[key]++;
  });
  return breakdown;
}

export function getAverageRating(reviews: ProductReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getReviewCount(reviews: ProductReview[]): number {
  return reviews.length;
}
