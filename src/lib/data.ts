// Mock catalog tailored for a Bangladesh digital marketplace.
// All amounts in BDT.

export type CategorySlug =
  | "streaming"
  | "ai-tools"
  | "game-topup"
  | "cd-keys"
  | "gift-cards"
  | "software"
  | "vpn"
  | "education"
  | "social";

export type Category = {
  slug: CategorySlug;
  name: string;
  bn: string;
  tagline: string;
  emoji: string;
  accent: string; // tailwind color hint
  count: number;
};

export const categories: Category[] = [
  { slug: "streaming",   name: "Streaming",       bn: "স্ট্রিমিং",      tagline: "Netflix, Spotify, YouTube",     emoji: "🎬", accent: "from-pink-500/40 to-violet-500/30", count: 184 },
  { slug: "ai-tools",    name: "AI & Productivity", bn: "এআই টুলস",     tagline: "ChatGPT, Claude, Midjourney",   emoji: "🤖", accent: "from-cyan-400/40 to-iris-500/30", count: 96 },
  { slug: "game-topup",  name: "Game Top-ups",    bn: "গেম টপআপ",      tagline: "Free Fire, PUBG UC, ML Diamonds", emoji: "🎮", accent: "from-amber-400/40 to-pink-500/30", count: 312 },
  { slug: "cd-keys",     name: "CD Keys",         bn: "সিডি কী",        tagline: "Steam, Epic, Battle.net",       emoji: "🗝️", accent: "from-emerald-400/40 to-cyan-500/30", count: 421 },
  { slug: "gift-cards",  name: "Gift Cards",      bn: "গিফট কার্ড",     tagline: "Steam, PSN, Google Play, Razer", emoji: "🎁", accent: "from-fuchsia-500/40 to-iris-500/30", count: 148 },
  { slug: "software",    name: "Software",        bn: "সফটওয়্যার",      tagline: "Windows, Office, IDM, Antivirus", emoji: "💻", accent: "from-sky-400/40 to-iris-500/30", count: 73 },
  { slug: "vpn",         name: "VPN & Security",  bn: "ভিপিএন",         tagline: "Nord, Express, Surfshark",      emoji: "🛡️", accent: "from-emerald-400/40 to-sky-500/30", count: 41 },
  { slug: "education",   name: "Education",       bn: "শিক্ষা",          tagline: "Coursera, Udemy, LinkedIn",     emoji: "📚", accent: "from-amber-400/40 to-emerald-500/30", count: 58 },
  { slug: "social",      name: "Social",          bn: "সোশ্যাল",         tagline: "Telegram Premium, Nitro",       emoji: "💬", accent: "from-cyan-400/40 to-fuchsia-500/30", count: 29 },
];

export type DeliveryType = "instant" | "manual-15m" | "manual-1h" | "manual-24h";
export type Region = "global" | "bd" | "in" | "asia" | "eu" | "us";

export type Seller = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  rating: number;
  totalSales: number;
  totalReviews: number;
  joined: string;
  location: string;
  responseTime: string;
  verified: boolean;
  topRated: boolean;
  badges: string[];
  avatarColor: string;
  cover: string;
};

export const sellers: Seller[] = [
  {
    id: "s1", handle: "dhakadigital", displayName: "Dhaka Digital",
    bio: "Bangladesh's most trusted Netflix and Spotify reseller. 24/7 replacement guarantee, instant delivery via email.",
    rating: 4.96, totalSales: 18420, totalReviews: 6210,
    joined: "2022-03-14T00:00:00Z", location: "Dhaka, Bangladesh",
    responseTime: "Avg. 4 mins", verified: true, topRated: true,
    badges: ["Top Rated", "Power Seller", "Fast Delivery"],
    avatarColor: "from-iris-500 to-cyan-400",
    cover: "from-iris-700 via-iris-500 to-cyan-500",
  },
  {
    id: "s2", handle: "ggboost-bd", displayName: "GG Boost BD",
    bio: "Specialists in Free Fire, PUBG, and Mobile Legends top-ups. Just need your player ID — diamonds delivered in under 5 minutes.",
    rating: 4.92, totalSales: 24102, totalReviews: 9180,
    joined: "2021-08-02T00:00:00Z", location: "Chittagong, Bangladesh",
    responseTime: "Avg. 2 mins", verified: true, topRated: true,
    badges: ["Top Rated", "Gaming Specialist"],
    avatarColor: "from-amber-400 to-pink-500",
    cover: "from-amber-500 via-pink-500 to-iris-600",
  },
  {
    id: "s3", handle: "keyhouse", displayName: "KeyHouse",
    bio: "Steam, Epic, Origin and Battle.net keys at the best Bangladeshi prices. Region-locked? We tell you up front.",
    rating: 4.88, totalSales: 9821, totalReviews: 3140,
    joined: "2023-01-19T00:00:00Z", location: "Sylhet, Bangladesh",
    responseTime: "Avg. 9 mins", verified: true, topRated: false,
    badges: ["Verified", "CD Key Expert"],
    avatarColor: "from-emerald-400 to-cyan-500",
    cover: "from-emerald-500 via-cyan-500 to-iris-600",
  },
  {
    id: "s4", handle: "promptbox", displayName: "PromptBox",
    bio: "ChatGPT Plus, Claude Pro, Midjourney and other AI subs — shared and personal plans for Bangladesh.",
    rating: 4.81, totalSales: 4760, totalReviews: 1490,
    joined: "2023-11-10T00:00:00Z", location: "Dhaka, Bangladesh",
    responseTime: "Avg. 6 mins", verified: true, topRated: false,
    badges: ["Verified", "AI Specialist"],
    avatarColor: "from-cyan-400 to-iris-500",
    cover: "from-cyan-500 via-iris-500 to-fuchsia-500",
  },
  {
    id: "s5", handle: "softline", displayName: "Softline BD",
    bio: "Genuine Microsoft, Adobe and antivirus licenses with invoice. Trusted by 200+ Bangladeshi SMBs.",
    rating: 4.94, totalSales: 6210, totalReviews: 2050,
    joined: "2020-06-22T00:00:00Z", location: "Dhaka, Bangladesh",
    responseTime: "Avg. 12 mins", verified: true, topRated: true,
    badges: ["Top Rated", "Business Verified"],
    avatarColor: "from-sky-400 to-iris-500",
    cover: "from-sky-500 via-iris-500 to-iris-700",
  },
  {
    id: "s6", handle: "giftbazar", displayName: "Gift Bazar",
    bio: "Gift cards for Steam, PSN, Xbox, Google Play and Razer Gold. Pay with bKash, Nagad or Rocket.",
    rating: 4.79, totalSales: 11340, totalReviews: 4080,
    joined: "2022-12-01T00:00:00Z", location: "Khulna, Bangladesh",
    responseTime: "Avg. 7 mins", verified: true, topRated: false,
    badges: ["Verified"],
    avatarColor: "from-fuchsia-500 to-iris-500",
    cover: "from-fuchsia-600 via-iris-500 to-cyan-500",
  },
];

export type ProductVariant = {
  id: string;
  label: string;
  duration?: string;
  price: number;
  originalPrice?: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDesc: string;
  longDesc: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  sold: number;
  delivery: DeliveryType;
  region: Region;
  platform?: string;
  warranty?: string;
  sellerId: string;
  tags: string[];
  badges: string[]; // "Best Seller" | "New" | "Hot" | "Limited" | "Verified Stock"
  brandColor: string; // gradient classes for art tile
  brandLabel: string; // logo placeholder text
  variants?: ProductVariant[];
  features: string[];
  faqs: { q: string; a: string }[];
};

const features = {
  netflix: [
    "Ultra HD (4K) supported on compatible plans",
    "Works on TV, mobile, laptop and tablet",
    "Account with PIN-protected profile included",
    "Replacement guarantee within warranty period",
    "Email + password delivered instantly after payment",
  ],
  game: [
    "Just provide your in-game player ID",
    "Top-up applied directly to your game account",
    "100% safe — no account login required",
    "Instant delivery, usually within 5 minutes",
    "Customer support 24/7 in Bangla and English",
  ],
  cdkey: [
    "Original CD key delivered via email and dashboard",
    "Region restrictions clearly mentioned in description",
    "Activate on the platform listed (Steam / Epic / etc.)",
    "Once activated, the game is yours forever",
    "Refund only if key fails to redeem",
  ],
  ai: [
    "Login credentials delivered to your email",
    "Works on web and mobile apps",
    "Do not change password or 2FA settings",
    "Replacement within warranty period",
    "Pay with bKash, Nagad or Rocket",
  ],
};

const faqs = {
  general: [
    { q: "How does delivery work?",         a: "After successful payment your order is processed automatically. Most products are delivered within 1–10 minutes. You will receive an email and a notification on your dashboard." },
    { q: "Is buyer protection included?",   a: "Yes. Every order is covered by our 7–30 day buyer protection policy depending on the product. If the product is not delivered or doesn't work, you are eligible for a free replacement or full refund." },
    { q: "Can I pay with bKash or Nagad?",  a: "Absolutely. We accept bKash, Nagad, Rocket, Upay, Visa, Mastercard and bank transfer. All payments are processed securely." },
    { q: "What if my product stops working?", a: "Contact the seller from your order page. Sellers respond within their listed response time. If they don't, our support team will step in and resolve the issue within 24 hours." },
  ],
  game: [
    { q: "What information do you need?",     a: "Only your in-game player ID. We never ask for your password or login details." },
    { q: "How long does top-up take?",        a: "Almost always under 5 minutes. During flash sales it may take up to 30 minutes." },
    { q: "Will my account get banned?",       a: "No. Top-ups are done through official payment gateways." },
  ],
};

export const products: Product[] = [
  {
    id: "p1", slug: "netflix-premium-1-month", name: "Netflix Premium — 1 Month",
    category: "streaming", shortDesc: "4K UHD plan with replacement guarantee. Instant email delivery.",
    longDesc: "Get a Netflix Premium account valid for 1 month with full access to 4K UHD streaming on up to 4 devices simultaneously. Watch the latest series and movies on your TV, phone, laptop or tablet. We provide a 30-day replacement guarantee — if anything happens to your access, we'll fix it.",
    price: 220, originalPrice: 1499, rating: 4.9, reviewCount: 2104, sold: 18450,
    delivery: "instant", region: "global", platform: "Netflix",
    warranty: "30 days replacement", sellerId: "s1",
    tags: ["netflix", "streaming", "4k", "premium"],
    badges: ["Best Seller", "Verified Stock"],
    brandColor: "from-rose-600 via-rose-700 to-zinc-900", brandLabel: "NETFLIX",
    variants: [
      { id: "v1", label: "1 Month — Premium", duration: "30 days", price: 220, originalPrice: 1499, stock: 142 },
      { id: "v2", label: "3 Months — Premium", duration: "90 days", price: 590, originalPrice: 4497, stock: 87 },
      { id: "v3", label: "6 Months — Premium", duration: "180 days", price: 1090, originalPrice: 8994, stock: 41 },
      { id: "v4", label: "1 Year — Premium",  duration: "365 days", price: 2090, originalPrice: 17988, stock: 18 },
    ],
    features: features.netflix,
    faqs: faqs.general,
  },
  {
    id: "p2", slug: "spotify-premium-individual", name: "Spotify Premium — Individual",
    category: "streaming", shortDesc: "Ad-free music, offline downloads, high-quality audio.",
    longDesc: "Spotify Premium Individual subscription. Listen to over 100 million songs and 5 million podcasts ad-free, download to listen offline, and stream in high-quality audio. Delivered as a personal account that you'll fully own — no shared logins.",
    price: 180, originalPrice: 850, rating: 4.85, reviewCount: 1340, sold: 9210,
    delivery: "instant", region: "global", platform: "Spotify",
    warranty: "30 days replacement", sellerId: "s1",
    tags: ["spotify", "music", "premium"],
    badges: ["Hot"],
    brandColor: "from-emerald-500 via-emerald-700 to-zinc-900", brandLabel: "SPOTIFY",
    variants: [
      { id: "v1", label: "1 Month", price: 180, originalPrice: 850, stock: 210 },
      { id: "v2", label: "3 Months", price: 480, originalPrice: 2550, stock: 110 },
      { id: "v3", label: "6 Months", price: 850, originalPrice: 5100, stock: 60 },
    ],
    features: features.netflix,
    faqs: faqs.general,
  },
  {
    id: "p3", slug: "youtube-premium-family", name: "YouTube Premium — Family",
    category: "streaming", shortDesc: "Ad-free YouTube + YouTube Music. Up to 5 family invites.",
    longDesc: "YouTube Premium Family plan delivered as an invite to your existing Google account. No ads, background play, downloads, and YouTube Music included.",
    price: 240, originalPrice: 1390, rating: 4.78, reviewCount: 612, sold: 4220,
    delivery: "manual-1h", region: "global", platform: "YouTube",
    warranty: "30 days replacement", sellerId: "s1",
    tags: ["youtube", "premium", "family"],
    badges: [],
    brandColor: "from-red-600 via-rose-700 to-zinc-900", brandLabel: "YOUTUBE",
    features: features.netflix,
    faqs: faqs.general,
  },
  {
    id: "p4", slug: "chatgpt-plus-1-month", name: "ChatGPT Plus — 1 Month",
    category: "ai-tools", shortDesc: "GPT-5, advanced reasoning, image gen, full priority access.",
    longDesc: "ChatGPT Plus subscription with full access to OpenAI's latest models, image generation, voice, deep research, and unlimited file uploads. Personal account delivered to your email.",
    price: 1690, originalPrice: 2400, rating: 4.86, reviewCount: 982, sold: 5410,
    delivery: "manual-15m", region: "global", platform: "OpenAI",
    warranty: "30 days replacement", sellerId: "s4",
    tags: ["chatgpt", "ai", "openai"],
    badges: ["Hot", "Verified Stock"],
    brandColor: "from-emerald-500 via-teal-700 to-zinc-900", brandLabel: "ChatGPT",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p5", slug: "claude-pro-1-month", name: "Claude Pro — 1 Month",
    category: "ai-tools", shortDesc: "5x more usage, priority access to Claude Sonnet & Opus.",
    longDesc: "Anthropic Claude Pro subscription with extended usage limits, priority access during high traffic, and early access to new features.",
    price: 1790, originalPrice: 2400, rating: 4.82, reviewCount: 410, sold: 1980,
    delivery: "manual-15m", region: "global", platform: "Anthropic",
    warranty: "30 days replacement", sellerId: "s4",
    tags: ["claude", "ai", "anthropic"],
    badges: ["New"],
    brandColor: "from-amber-600 via-orange-700 to-zinc-900", brandLabel: "Claude",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p6", slug: "midjourney-basic-1-month", name: "Midjourney Basic — 1 Month",
    category: "ai-tools", shortDesc: "200 fast generations / month. Personal account.",
    longDesc: "Midjourney Basic plan delivered to your email. Generate stunning AI imagery on Discord and the Midjourney web app.",
    price: 1290, originalPrice: 1100, rating: 4.74, reviewCount: 280, sold: 1140,
    delivery: "manual-1h", region: "global", platform: "Midjourney",
    warranty: "15 days replacement", sellerId: "s4",
    tags: ["midjourney", "ai", "image"],
    badges: [],
    brandColor: "from-iris-600 via-iris-700 to-zinc-900", brandLabel: "Midjourney",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p7", slug: "free-fire-diamonds-310", name: "Free Fire — 310 Diamonds",
    category: "game-topup", shortDesc: "Direct top-up to your Free Fire account. Just need player ID.",
    longDesc: "Top-up 310 Diamonds (310 + bonus) directly to your Free Fire account. Just provide your player ID — we'll top up within 5 minutes.",
    price: 290, originalPrice: 320, rating: 4.94, reviewCount: 5420, sold: 32400,
    delivery: "instant", region: "global", platform: "Free Fire",
    warranty: "Top-up guarantee", sellerId: "s2",
    tags: ["freefire", "garena", "diamonds"],
    badges: ["Best Seller", "Hot"],
    brandColor: "from-orange-500 via-red-600 to-zinc-900", brandLabel: "FREE FIRE",
    variants: [
      { id: "v1", label: "100 Diamonds", price: 95, stock: 999 },
      { id: "v2", label: "310 Diamonds", price: 290, originalPrice: 320, stock: 999 },
      { id: "v3", label: "520 Diamonds", price: 480, stock: 999 },
      { id: "v4", label: "1060 Diamonds", price: 950, stock: 999 },
      { id: "v5", label: "2180 Diamonds", price: 1890, stock: 600 },
      { id: "v6", label: "5600 Diamonds", price: 4790, stock: 220 },
    ],
    features: features.game,
    faqs: faqs.game,
  },
  {
    id: "p8", slug: "pubg-uc-660", name: "PUBG Mobile — 660 UC",
    category: "game-topup", shortDesc: "660 UC top-up to your PUBG Mobile account.",
    longDesc: "Direct UC top-up to your PUBG Mobile account. Provide your player ID and we'll add the UC within 10 minutes.",
    price: 1090, originalPrice: 1190, rating: 4.91, reviewCount: 3180, sold: 18800,
    delivery: "instant", region: "global", platform: "PUBG Mobile",
    warranty: "Top-up guarantee", sellerId: "s2",
    tags: ["pubg", "uc", "mobile"],
    badges: ["Best Seller"],
    brandColor: "from-amber-400 via-orange-600 to-zinc-900", brandLabel: "PUBG",
    variants: [
      { id: "v1", label: "60 UC", price: 110, stock: 999 },
      { id: "v2", label: "325 UC", price: 540, stock: 999 },
      { id: "v3", label: "660 UC", price: 1090, originalPrice: 1190, stock: 999 },
      { id: "v4", label: "1800 UC", price: 2890, stock: 600 },
    ],
    features: features.game,
    faqs: faqs.game,
  },
  {
    id: "p9", slug: "mlbb-diamonds-257", name: "Mobile Legends — 257 Diamonds",
    category: "game-topup", shortDesc: "257 ML Diamonds delivered in minutes.",
    longDesc: "Top-up Mobile Legends Bang Bang diamonds with just your User ID and Server.",
    price: 410, rating: 4.88, reviewCount: 1620, sold: 9240,
    delivery: "instant", region: "global", platform: "Mobile Legends",
    warranty: "Top-up guarantee", sellerId: "s2",
    tags: ["mlbb", "mobilelegends", "diamonds"],
    badges: ["Hot"],
    brandColor: "from-blue-600 via-iris-700 to-zinc-900", brandLabel: "MLBB",
    features: features.game,
    faqs: faqs.game,
  },
  {
    id: "p10", slug: "valorant-points-475", name: "Valorant Points — 475 VP",
    category: "game-topup", shortDesc: "475 VP code for Valorant. Region: Asia Pacific.",
    longDesc: "Receive a Riot redemption code for 475 Valorant Points. Activate via the Riot client. Asia Pacific region.",
    price: 480, rating: 4.7, reviewCount: 412, sold: 2110,
    delivery: "manual-15m", region: "asia", platform: "Riot",
    warranty: "7 days redeem warranty", sellerId: "s3",
    tags: ["valorant", "riot", "vp"],
    badges: [],
    brandColor: "from-rose-600 via-red-800 to-zinc-900", brandLabel: "VALORANT",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p11", slug: "elden-ring-steam-key", name: "Elden Ring — Steam Key",
    category: "cd-keys", shortDesc: "Original Steam CD key. Global region.",
    longDesc: "Receive an original Steam CD key for Elden Ring. Activate on Steam and play forever. Global region.",
    price: 2890, originalPrice: 5990, rating: 4.95, reviewCount: 1320, sold: 4400,
    delivery: "instant", region: "global", platform: "Steam",
    warranty: "Activation guarantee", sellerId: "s3",
    tags: ["eldenring", "steam", "rpg"],
    badges: ["Best Seller", "Verified Stock"],
    brandColor: "from-amber-400 via-amber-700 to-zinc-900", brandLabel: "ELDEN RING",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p12", slug: "gta-v-premium-steam", name: "GTA V Premium Edition — Steam",
    category: "cd-keys", shortDesc: "GTA V Premium with Criminal Enterprise Pack. Steam.",
    longDesc: "Steam CD key for Grand Theft Auto V Premium Edition including the Criminal Enterprise Starter Pack. Global activation.",
    price: 1090, originalPrice: 2999, rating: 4.92, reviewCount: 2840, sold: 11200,
    delivery: "instant", region: "global", platform: "Steam",
    warranty: "Activation guarantee", sellerId: "s3",
    tags: ["gtav", "rockstar", "steam"],
    badges: ["Hot"],
    brandColor: "from-lime-500 via-emerald-700 to-zinc-900", brandLabel: "GTA V",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p13", slug: "cyberpunk-2077", name: "Cyberpunk 2077 — Steam Key",
    category: "cd-keys", shortDesc: "Original Steam CD key. Global region.",
    longDesc: "Original Steam CD key for Cyberpunk 2077 with all base content. Activate on Steam.",
    price: 1290, originalPrice: 3490, rating: 4.86, reviewCount: 980, sold: 3210,
    delivery: "instant", region: "global", platform: "Steam",
    warranty: "Activation guarantee", sellerId: "s3",
    tags: ["cyberpunk", "rpg", "steam"],
    badges: [],
    brandColor: "from-yellow-400 via-fuchsia-600 to-zinc-900", brandLabel: "CYBERPUNK",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p14", slug: "steam-wallet-500", name: "Steam Wallet — ৳500",
    category: "gift-cards", shortDesc: "৳500 Steam Wallet credit. Asia region.",
    longDesc: "Steam Wallet code worth ৳500. Redeem on the Steam client. Asia/Pacific region account required.",
    price: 540, originalPrice: 600, rating: 4.81, reviewCount: 320, sold: 2410,
    delivery: "instant", region: "asia", platform: "Steam",
    warranty: "Redeem guarantee", sellerId: "s6",
    tags: ["steam", "wallet", "giftcard"],
    badges: [],
    brandColor: "from-sky-500 via-iris-700 to-zinc-900", brandLabel: "STEAM",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p15", slug: "google-play-1000", name: "Google Play Gift Card — ৳1000",
    category: "gift-cards", shortDesc: "৳1000 Google Play credit. India region.",
    longDesc: "Google Play gift card worth ৳1000. Redeem in the Play Store. India region required.",
    price: 1090, rating: 4.74, reviewCount: 210, sold: 1410,
    delivery: "instant", region: "in", platform: "Google Play",
    warranty: "Redeem guarantee", sellerId: "s6",
    tags: ["googleplay", "giftcard"],
    badges: [],
    brandColor: "from-emerald-500 via-sky-600 to-zinc-900", brandLabel: "Google Play",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p16", slug: "psn-card-2000", name: "PSN Gift Card — ৳2000",
    category: "gift-cards", shortDesc: "৳2000 PlayStation Store credit. US region.",
    longDesc: "Add ৳2000 to your PSN wallet to buy games, DLC and PlayStation Plus. US region required.",
    price: 2190, rating: 4.78, reviewCount: 180, sold: 920,
    delivery: "instant", region: "us", platform: "PlayStation",
    warranty: "Redeem guarantee", sellerId: "s6",
    tags: ["psn", "playstation", "giftcard"],
    badges: [],
    brandColor: "from-blue-600 via-iris-700 to-zinc-900", brandLabel: "PlayStation",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p17", slug: "windows-11-pro", name: "Windows 11 Pro — Lifetime",
    category: "software", shortDesc: "Genuine retail key. Lifetime activation.",
    longDesc: "Genuine Windows 11 Pro retail key with lifetime activation. Bind to your Microsoft account for cloud backup of your license.",
    price: 1890, originalPrice: 14990, rating: 4.92, reviewCount: 720, sold: 4180,
    delivery: "instant", region: "global", platform: "Microsoft",
    warranty: "Lifetime", sellerId: "s5",
    tags: ["windows", "microsoft", "license"],
    badges: ["Best Seller"],
    brandColor: "from-sky-500 via-iris-700 to-zinc-900", brandLabel: "Windows 11",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p18", slug: "office-2021-pro", name: "Microsoft Office 2021 Pro Plus",
    category: "software", shortDesc: "Lifetime license. Bind to Microsoft account.",
    longDesc: "Microsoft Office 2021 Pro Plus lifetime license. Includes Word, Excel, PowerPoint, Outlook, Access and Publisher.",
    price: 1490, originalPrice: 22990, rating: 4.88, reviewCount: 510, sold: 2940,
    delivery: "instant", region: "global", platform: "Microsoft",
    warranty: "Lifetime", sellerId: "s5",
    tags: ["office", "microsoft"],
    badges: ["Hot"],
    brandColor: "from-orange-600 via-red-700 to-zinc-900", brandLabel: "Office 2021",
    features: features.cdkey,
    faqs: faqs.general,
  },
  {
    id: "p19", slug: "nordvpn-1y", name: "NordVPN — 1 Year",
    category: "vpn", shortDesc: "Premium VPN with global servers. Personal account.",
    longDesc: "NordVPN premium 1-year subscription delivered as a personal account. Servers in 60+ countries, kill switch, double VPN.",
    price: 1490, originalPrice: 6990, rating: 4.84, reviewCount: 320, sold: 1820,
    delivery: "manual-15m", region: "global", platform: "NordVPN",
    warranty: "30 days replacement", sellerId: "s5",
    tags: ["nordvpn", "vpn"],
    badges: [],
    brandColor: "from-iris-600 via-iris-800 to-zinc-900", brandLabel: "NordVPN",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p20", slug: "telegram-premium-3m", name: "Telegram Premium — 3 Months",
    category: "social", shortDesc: "Larger uploads, faster downloads, premium stickers.",
    longDesc: "Activate Telegram Premium on your account for 3 months. Larger uploads, exclusive stickers and reactions, no ads on public channels.",
    price: 590, originalPrice: 1290, rating: 4.7, reviewCount: 240, sold: 1180,
    delivery: "manual-15m", region: "global", platform: "Telegram",
    warranty: "Subscription guarantee", sellerId: "s4",
    tags: ["telegram", "premium"],
    badges: [],
    brandColor: "from-cyan-400 via-sky-600 to-zinc-900", brandLabel: "Telegram",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p21", slug: "discord-nitro-1y", name: "Discord Nitro — 1 Year",
    category: "social", shortDesc: "Boosts, larger uploads, custom emoji everywhere.",
    longDesc: "Discord Nitro full plan for 1 year activated to your account.",
    price: 2890, originalPrice: 4990, rating: 4.78, reviewCount: 410, sold: 1620,
    delivery: "manual-15m", region: "global", platform: "Discord",
    warranty: "Subscription guarantee", sellerId: "s4",
    tags: ["discord", "nitro"],
    badges: ["Hot"],
    brandColor: "from-iris-600 via-fuchsia-700 to-zinc-900", brandLabel: "Discord",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p22", slug: "coursera-plus-1m", name: "Coursera Plus — 1 Month",
    category: "education", shortDesc: "Unlimited certificates from 7000+ courses.",
    longDesc: "Coursera Plus subscription giving you unlimited access to 7000+ courses, certificates and specializations.",
    price: 1490, originalPrice: 4990, rating: 4.74, reviewCount: 180, sold: 920,
    delivery: "manual-1h", region: "global", platform: "Coursera",
    warranty: "30 days replacement", sellerId: "s4",
    tags: ["coursera", "education"],
    badges: [],
    brandColor: "from-blue-600 via-iris-700 to-zinc-900", brandLabel: "Coursera",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p23", slug: "canva-pro-1y", name: "Canva Pro — 1 Year",
    category: "ai-tools", shortDesc: "Premium templates, brand kit, AI design tools.",
    longDesc: "Canva Pro 1-year subscription delivered to your existing Canva account via team invite.",
    price: 690, originalPrice: 11990, rating: 4.91, reviewCount: 720, sold: 4810,
    delivery: "manual-1h", region: "global", platform: "Canva",
    warranty: "1 year subscription guarantee", sellerId: "s4",
    tags: ["canva", "design"],
    badges: ["Best Seller"],
    brandColor: "from-cyan-400 via-iris-600 to-zinc-900", brandLabel: "Canva",
    features: features.ai,
    faqs: faqs.general,
  },
  {
    id: "p24", slug: "razer-gold-1000", name: "Razer Gold — ৳1000",
    category: "gift-cards", shortDesc: "৳1000 Razer Gold credit. Global.",
    longDesc: "Razer Gold gift card worth ৳1000. Use across thousands of supported games.",
    price: 1090, rating: 4.7, reviewCount: 140, sold: 760,
    delivery: "instant", region: "global", platform: "Razer Gold",
    warranty: "Redeem guarantee", sellerId: "s6",
    tags: ["razer", "giftcard"],
    badges: [],
    brandColor: "from-emerald-500 via-emerald-800 to-zinc-900", brandLabel: "Razer Gold",
    features: features.cdkey,
    faqs: faqs.general,
  },
];

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getSeller(id: string) {
  return sellers.find((s) => s.id === id);
}

export function productsByCategory(slug: CategorySlug) {
  return products.filter((p) => p.category === slug);
}

export function productsBySeller(sellerId: string) {
  return products.filter((p) => p.sellerId === sellerId);
}

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  authorInitial: string;
  rating: number;
  title?: string;
  body: string;
  createdAt: string;
  verified: boolean;
};

export const reviews: Review[] = [
  { id: "r1", productId: "p1",  authorName: "Tanvir H.",     authorInitial: "T", rating: 5, title: "Faster than promised", body: "Paid via bKash, got the Netflix login in literally 2 minutes. Working great on TV and phone.", createdAt: "2026-04-22T11:30:00Z", verified: true },
  { id: "r2", productId: "p1",  authorName: "Sumaiya R.",    authorInitial: "S", rating: 5, body: "3rd time buying. Always smooth, great seller.", createdAt: "2026-04-21T09:00:00Z", verified: true },
  { id: "r3", productId: "p1",  authorName: "Rakib I.",      authorInitial: "R", rating: 4, title: "Good but...", body: "Account was great but had to ask for replacement once. Got it within an hour, no issues.", createdAt: "2026-04-19T16:14:00Z", verified: true },
  { id: "r4", productId: "p7",  authorName: "Mahbub A.",     authorInitial: "M", rating: 5, title: "Diamonds in 3 mins", body: "Just gave my player ID, got the diamonds super fast. Thanks bro!", createdAt: "2026-04-25T22:01:00Z", verified: true },
  { id: "r5", productId: "p7",  authorName: "Sabbir K.",     authorInitial: "S", rating: 5, body: "Best price for Free Fire diamonds in BD.", createdAt: "2026-04-24T18:30:00Z", verified: true },
  { id: "r6", productId: "p11", authorName: "Asif M.",       authorInitial: "A", rating: 5, title: "Original key, instant", body: "Activated on Steam without any issue. Half the official price.", createdAt: "2026-04-20T13:00:00Z", verified: true },
  { id: "r7", productId: "p4",  authorName: "Nusrat J.",     authorInitial: "N", rating: 5, title: "Real ChatGPT Plus", body: "Login worked, GPT-5 access. Will buy again.", createdAt: "2026-04-26T08:11:00Z", verified: true },
  { id: "r8", productId: "p17", authorName: "Iftekhar B.",   authorInitial: "I", rating: 5, title: "Genuine Windows", body: "Activated successfully, no issues with Microsoft account.", createdAt: "2026-04-18T17:25:00Z", verified: true },
];

export function reviewsForProduct(id: string) {
  return reviews.filter((r) => r.productId === id);
}

// Cart items for the mock cart page
export type CartItem = {
  productId: string;
  variantId?: string;
  qty: number;
};

export const sampleCart: CartItem[] = [
  { productId: "p1",  variantId: "v1", qty: 1 },
  { productId: "p7",  variantId: "v3", qty: 2 },
  { productId: "p11", qty: 1 },
];

export type Order = {
  id: string;
  createdAt: string;
  buyer: string;
  product: string;
  productId: string;
  status: "delivered" | "processing" | "refunded";
  total: number;
};

// Multi-seller offers ─ each product is sold by multiple verified sellers at different
// prices, delivery times and regions. We deterministically generate offers from the
// existing seller pool so render output stays stable across sessions.
export type SellerOffer = {
  id: string;
  productId: string;
  sellerId: string;
  price: number;
  originalPrice?: number;
  stock: number;
  delivery: DeliveryType;
  region: Region;
  warranty: string;
  badges: string[]; // "Best Price", "Fast Delivery", "Top Rated"
  payments: ("bkash" | "nagad" | "rocket" | "card" | "bank")[];
};

const REGION_POOL: Region[] = ["global", "bd", "asia", "in", "eu", "us"];
const DELIVERY_POOL: DeliveryType[] = ["instant", "manual-15m", "manual-1h", "manual-24h"];
const PAYMENT_POOLS: SellerOffer["payments"][] = [
  ["bkash", "nagad", "rocket", "card"],
  ["bkash", "nagad", "card"],
  ["bkash", "rocket", "card", "bank"],
  ["bkash", "nagad", "rocket"],
  ["bkash", "card"],
];
const WARRANTIES = ["7 days", "14 days", "30 days", "Lifetime", "60 days"];

// Tiny deterministic hash so we always pick the same sellers/prices for a given product.
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

const productOffersCache: Record<string, SellerOffer[]> = {};

export function getOffersForProduct(productId: string): SellerOffer[] {
  if (productOffersCache[productId]) return productOffersCache[productId];
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  const seed = hashString(productId);
  const numOffers = 3 + (seed % 4); // 3–6 offers
  const sellerPool = sellers.slice();

  // Always include the canonical seller as offer #0 with the listed (lowest) price.
  const ordered: Seller[] = [];
  const canonical = sellerPool.find((s) => s.id === product.sellerId);
  if (canonical) ordered.push(canonical);
  // Round-robin through remaining sellers using the seed.
  const remaining = sellerPool.filter((s) => s.id !== product.sellerId);
  for (let i = 0; i < numOffers - 1 && i < remaining.length; i++) {
    ordered.push(remaining[(seed + i * 7) % remaining.length]);
  }

  const base = product.price;
  const offers: SellerOffer[] = ordered.map((seller, i) => {
    const off = (seed + i * 31) >>> 0;
    // First offer = best price (matches product.price). Others mark up 4-32%.
    const markup = i === 0 ? 0 : 0.04 + ((off % 28) / 100);
    const price = i === 0 ? base : Math.round(base * (1 + markup));
    const originalPrice =
      i === 0
        ? product.originalPrice
        : Math.round(price * (1 + 0.10 + ((off % 25) / 100)));
    const delivery: DeliveryType =
      i === 0 ? product.delivery : DELIVERY_POOL[(off >>> 3) % DELIVERY_POOL.length];
    const region: Region =
      i === 0 ? product.region : REGION_POOL[(off >>> 5) % REGION_POOL.length];
    const stock = 1 + ((off >>> 7) % 240);
    const warranty =
      i === 0 ? (product.warranty || "30 days") : WARRANTIES[(off >>> 9) % WARRANTIES.length];
    const payments = PAYMENT_POOLS[(off >>> 11) % PAYMENT_POOLS.length];

    const badges: string[] = [];
    if (i === 0) badges.push("Best Price");
    if (seller.topRated) badges.push("Top Rated");
    if (delivery === "instant") badges.push("Fast Delivery");

    return {
      id: `${productId}-offer-${seller.id}`,
      productId,
      sellerId: seller.id,
      price,
      originalPrice,
      stock,
      delivery,
      region,
      warranty,
      badges,
      payments,
    };
  });

  productOffersCache[productId] = offers;
  return offers;
}

export function offerCountForProduct(productId: string): number {
  return getOffersForProduct(productId).length;
}

export const sellerOrders: Order[] = [
  { id: "BD-10248", createdAt: "2026-04-26T14:22:00Z", buyer: "Tanvir H.",   product: "Netflix Premium — 1 Month",     productId: "p1",  status: "delivered",  total: 220 },
  { id: "BD-10247", createdAt: "2026-04-26T13:51:00Z", buyer: "Sumaiya R.",  product: "Spotify Premium — 1 Month",     productId: "p2",  status: "delivered",  total: 180 },
  { id: "BD-10246", createdAt: "2026-04-26T12:48:00Z", buyer: "Rakib I.",    product: "ChatGPT Plus — 1 Month",        productId: "p4",  status: "processing", total: 1690 },
  { id: "BD-10245", createdAt: "2026-04-26T11:12:00Z", buyer: "Mahbub A.",   product: "Free Fire — 310 Diamonds",      productId: "p7",  status: "delivered",  total: 290 },
  { id: "BD-10244", createdAt: "2026-04-26T10:04:00Z", buyer: "Asif M.",     product: "Elden Ring — Steam Key",        productId: "p11", status: "delivered",  total: 2890 },
  { id: "BD-10243", createdAt: "2026-04-25T22:36:00Z", buyer: "Nusrat J.",   product: "Canva Pro — 1 Year",            productId: "p23", status: "delivered",  total: 690 },
  { id: "BD-10242", createdAt: "2026-04-25T21:14:00Z", buyer: "Iftekhar B.", product: "Windows 11 Pro — Lifetime",     productId: "p17", status: "delivered",  total: 1890 },
  { id: "BD-10241", createdAt: "2026-04-25T18:02:00Z", buyer: "Sabbir K.",   product: "PUBG Mobile — 660 UC",          productId: "p8",  status: "refunded",   total: 1090 },
];
