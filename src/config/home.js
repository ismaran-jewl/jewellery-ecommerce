import { Instagram, Facebook, Sparkles, Twitter } from "lucide-react";

export const HERO_DEFAULT_SLIDES = [
  { id: 1, title: "The Diamond Solitaire", sub: "A promise that lasts forever.", img: "https://images.unsplash.com/photo-1598560912005-59a09551e474?auto=format&fit=crop&w=1920&q=80" },
  { id: 2, title: "Golden Hour Charms", sub: "24k Craftsmanship in every link.", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1920&q=80" },
  { id: 3, title: "Midnight Gold Edition", sub: "Where luxury meets the dark.", img: "https://images.unsplash.com/photo-1573408302354-010549b15295?auto=format&fit=crop&w=1920&q=80" },
];

export const HERO_WAVE_BARS = [8, 18, 24, 14, 20, 10, 22, 16];

export const HERO_FLOATING_CARDS_DEFAULT = {
  qrText: "Scan to hear",
  audioId: "Audio ID: 882",
  ratingCount: "9k+ Happy Voices",
  ratingLabel: "100% Artisan Crafted"
};

export const HERO_TICKER_ITEMS_DEFAULT = [
  "Free Gift Wrapping",
  "Voice Notes Included",
  "QR Code Enabled",
  "Luxury Box Included",
  "BIS Hallmarked Gold",
  "Insured Shipping"
];

export const FEATURED_PRODUCTS_FALLBACK = [
  { id: 1, name: "Peach Sapphire Solitaire", price: "1,20,000", image: "https://i.pinimg.com/1200x/11/40/f9/1140f9933b0c265cd646744b5c00ac18.jpg" },
  { id: 2, name: "Rose Gold Temple Set", price: "85,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" },
  { id: 3, name: "Blush Emerald Drops", price: "60,000", image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4" },
];

export const HOME_COLLECTIONS = [
  {
    name: "Modern Minimalist",
    desc: "Everyday luxury for the office",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    size: "col-span-1 md:col-span-1 h-[240px] md:h-[500px]"
  },
  {
    name: "The Bridal Suite",
    desc: "Timeless pieces for your big day",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    size: "col-span-1 md:col-span-2 h-[300px] md:h-[500px]"
  },
  {
    name: "Royal Heritage",
    desc: "Inspired by ancient craftsmanship",
    image: "https://i.pinimg.com/736x/28/26/f3/2826f32d2e67a1baf351356d800fd049.jpg",
    size: "col-span-2 md:col-span-3 h-[250px] md:h-[500px]"
  },
];

export const SEASONAL_OFFERS_FALLBACK = [
  { type: "image", src: "/images/product1.jpg", label: "New Arrival", id: 1 },
  { type: "video", src: "/videos/product1.mp4", label: "Live Demo", id: 2 },
  { type: "image", src: "/images/product2.jpg", label: "Limited Edition", id: 3 },
  { type: "image", src: "/images/product3.jpg", label: "Organic", id: 4 },
  { type: "video", src: "/videos/product2.mp4", label: "BTS", id: 5 },
  { type: "image", src: "/images/product4.jpg", label: "Best Seller", id: 6 },
  { type: "image", src: "/images/product5.jpg", label: "Trending", id: 7 },
  { type: "video", src: "/videos/product3.mp4", label: "Collection", id: 8 },
];

export const SHARE_YOUR_STORY_STORIES = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
    name: "Sarah & James",
    text: `"We'll never forget the day he proposed. This ring is a symbol of our beginning."`,
    x: "5%", y: "20%", rotate: -6, delay: 0
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
    name: "Elena's 30th",
    text: `"My friends gifted me this necklace for my birthday. It shines as bright as our memories together."`,
    x: "75%", y: "15%", rotate: 6, delay: 0.1
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    name: "The Graduation",
    text: `"A gift from my parents to celebrate a new chapter. It reminds me how far I've come."`,
    x: "10%", y: "65%", rotate: 4, delay: 0.2
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    name: "Anniversary",
    text: `"Ten years of love, captured in one timeless piece. It's more than a jewel, it's our story."`,
    x: "80%", y: "60%", rotate: -4, delay: 0.3
  },
];

export const SHARE_YOUR_STORY_SOCIALS = [
  { id: 101, img: "https://images.unsplash.com/photo-1573408302354-010549b15295?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "2%", y: "45%", rotate: 8, delay: 0.4, icon: Instagram },
  { id: 102, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop", platform: "Facebook", x: "90%", y: "25%", rotate: -10, delay: 0.6, icon: Facebook },
  { id: 103, img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop", platform: "Pinterest", x: "12%", y: "85%", rotate: 5, delay: 0.8, icon: Sparkles },
  { id: 104, img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "82%", y: "5%", rotate: -7, delay: 1.0, icon: Instagram },
  { id: 105, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop", platform: "Twitter", x: "70%", y: "92%", rotate: 12, delay: 1.2, icon: Twitter },
  { id: 106, img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=300&auto=format&fit=crop", platform: "Instagram", x: "28%", y: "92%", rotate: -5, delay: 1.4, icon: Instagram },
];
