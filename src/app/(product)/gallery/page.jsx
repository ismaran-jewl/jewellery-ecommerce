"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronDown, Heart, Star, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

// ─── COLLECTIONS (static) ───────────────────────────────────────────────────
const collections = [
  { id: 1, name: "Modern Minimalist", category: "Everyday", desc: "Everyday luxury for the office. Clean lines, refined silhouettes, and understated elegance for the modern woman.", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", pieces: 24, tag: "New Arrivals", accent: "#2D5A40" },
  { id: 2, name: "The Bridal Suite", category: "Bridal", desc: "Timeless pieces for your big day. Radiant designs crafted to be cherished across generations.", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800", pieces: 18, tag: "Bestseller", accent: "#8B5E6A" },
  { id: 3, name: "Royal Heritage", category: "Heritage", desc: "Inspired by ancient craftsmanship. Each piece tells a story of tradition, culture, and artisanal mastery.", image: "https://i.pinimg.com/736x/28/26/f3/2826f32d2e67a1baf351356d800fd049.jpg", pieces: 31, tag: "Signature", accent: "#4A6355" },
  { id: 4, name: "Celestial Dreams", category: "Statement", desc: "Reach for the stars with celestial-inspired pieces adorned with shimmering stones and cosmic motifs.", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800", pieces: 15, tag: "Limited", accent: "#2D5A40" },
  { id: 5, name: "Garden in Bloom", category: "Everyday", desc: "Nature-inspired florals reimagined in gold and gemstones. Wear the beauty of a garden wherever you go.", image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800", pieces: 22, tag: "New Arrivals", accent: "#8B5E6A" },
  { id: 6, name: "The Golden Hour", category: "Heritage", desc: "Warm, luminous gold pieces that capture the magic of dusk. Crafted for moments worth remembering.", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80&w=800", pieces: 19, tag: "Signature", accent: "#4A6355" },
  { id: 7, name: "Noir et Or", category: "Statement", desc: "Bold contrasts of black enamel and 22k gold. Dramatic statement pieces for the woman who commands attention.", image: "https://images.unsplash.com/photo-1573408301185-9519f94815b1?auto=format&fit=crop&q=80&w=800", pieces: 12, tag: "Limited", accent: "#2D5A40" },
  { id: 8, name: "Pearl Reverie", category: "Bridal", desc: "Freshwater pearls reimagined with a modern spirit. Delicate layering pieces for the romantic at heart.", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800", pieces: 27, tag: "Bestseller", accent: "#8B5E6A" },
];

const collectionCategories = ["All", "Everyday", "Bridal", "Heritage", "Statement"];

export default function GalleryPage() {
  const heroRef = useRef(null);
  const [activeCollection, setActiveCollection] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  // ── Real products from your API ──
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Support both { products: [...] } and plain array responses
        const list = Array.isArray(data) ? data : (data.products || []);
        setProducts(list);

        // Build unique category list from real data
        const cats = ["All", ...new Set(list.map((p) => p.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const filteredCollections = activeCollection === "All"
    ? collections
    : collections.filter((c) => c.category === activeCollection);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  // ── Helpers to read real product fields safely ──
  const getImage = (p) =>
    (Array.isArray(p.images) ? p.images[0] : p.image) ||
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600";

  const getPrice = (p) => {
    const price = p.price ?? p.salePrice ?? 0;
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const getOriginalPrice = (p) => {
    if (p.originalPrice && p.originalPrice > (p.price ?? 0)) {
      return `₹${Number(p.originalPrice).toLocaleString("en-IN")}`;
    }
    return null;
  };

  const getRating = (p) => p.rating ?? p.averageRating ?? 0;
  const getReviews = (p) => p.reviews ?? p.reviewCount ?? p.numReviews ?? 0;
  const getName = (p) => p.name ?? p.title ?? "Unnamed";
  const getMaterial = (p) => p.material ?? p.metal ?? p.description?.slice(0, 40) ?? "";

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-serif">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[70vh] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=1800" alt="Gallery hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D5A40]/60 via-[#2D5A40]/30 to-[#FAF7F2]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="block text-[#FFDAB9] text-xs uppercase font-sans font-bold tracking-[0.4em] mb-6">
            Handpicked Treasures
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-6xl md:text-9xl text-white leading-[0.9] mb-6">
            Curated<br /><span className="italic font-light text-[#FFDAB9]">Gallery</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/70 font-sans text-base md:text-lg max-w-md mx-auto">
            Every collection, a chapter. Every piece, a memory waiting to be made.
          </motion.p>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs font-sans tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} className="text-white/50" />
        </motion.div>
      </section>

      {/* ── COLLECTION FILTER BAR ── */}
      <section className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#2D5A40]/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {collectionCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCollection(cat)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-sans transition-all duration-300 border ${activeCollection === cat ? "bg-[#2D5A40] text-[#FFDAB9] border-[#2D5A40]" : "bg-transparent text-[#2D5A40] border-[#2D5A40]/30 hover:border-[#2D5A40]"}`}>
                {cat}
              </button>
            ))}
          </div>
          <span className="text-[#4A6355] font-sans text-sm shrink-0">{filteredCollections.length} Collections</span>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-24">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection, i) => (
              <motion.div key={collection.id} layout initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${i === 0 ? "md:col-span-2 h-[200px] md:h-[420px]" : i === 3 ? "lg:col-span-2 h-[180px] md:h-[380px]" : "h-[180px] md:h-[380px]"}`}
                onMouseEnter={() => setHoveredId(`c-${collection.id}`)} onMouseLeave={() => setHoveredId(null)}>
                <motion.img src={collection.image} alt={collection.name} animate={{ scale: hoveredId === `c-${collection.id}` ? 1.08 : 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 transition-opacity duration-500" style={{ background: `linear-gradient(to top, ${collection.accent}EE 0%, ${collection.accent}44 50%, transparent 100%)`, opacity: hoveredId === `c-${collection.id}` ? 0.95 : 0.75 }} />
                <div className="absolute top-5 left-5 z-10">
                  <span className="bg-[#FFDAB9]/90 text-[#2D5A40] text-xs font-sans font-bold tracking-widest uppercase px-3 py-1 rounded-full">{collection.tag}</span>
                </div>
                <div className="absolute top-5 right-5 z-10">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-sans px-3 py-1 rounded-full">{collection.pieces} pieces</span>
                </div>
                <div className="absolute inset-0 p-4 md:p-7 flex flex-col justify-end z-10">
                  <span className="hidden md:block text-[#FFDAB9]/80 text-xs font-sans tracking-[0.3em] uppercase mb-2">{collection.category}</span>
                  <h3 className="text-lg md:text-4xl text-white mb-1 md:mb-3 leading-tight group-hover:-translate-y-1 transition-transform duration-300">{collection.name}</h3>
                  <div className="hidden md:block overflow-hidden transition-all duration-500" style={{ maxHeight: hoveredId === `c-${collection.id}` ? "120px" : "0px" }}>
                    <p className="text-white/80 font-sans text-sm leading-relaxed mb-4">{collection.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button asChild className="bg-[#FFDAB9] text-[#2D5A40] hover:bg-white rounded-full px-3 py-1 md:px-6 md:py-2 text-xs md:text-sm font-sans flex items-center gap-1 group/btn transition-all w-fit">
                      <Link href="/shop">View <span className="hidden md:inline">Collection</span> <ArrowUpRight size={13} className="group-hover/btn:rotate-45 transition-transform" /></Link>
                    </Button>
                  </div>
                </div>
                <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] pointer-events-none transition-opacity duration-500" style={{ opacity: hoveredId === `c-${collection.id}` ? 1 : 0 }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── SECTION DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-[#2D5A40]/15" />
          <span className="text-[#2D5A40] font-serif text-2xl italic whitespace-nowrap">Featured Pieces</span>
          <div className="flex-1 h-px bg-[#2D5A40]/15" />
        </div>
      </div>

      {/* ── PRODUCT FILTER BAR ── */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-sans transition-all duration-300 border ${activeCategory === cat ? "bg-[#2D5A40] text-[#FFDAB9] border-[#2D5A40]" : "bg-transparent text-[#2D5A40] border-[#2D5A40]/30 hover:border-[#2D5A40]"}`}>
                {cat}
              </button>
            ))}
          </div>
          {!loading && (
            <span className="text-[#4A6355] font-sans text-sm">{filteredProducts.length} pieces</span>
          )}
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pb-24">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={36} className="text-[#2D5A40] animate-spin" />
            <p className="text-[#4A6355] font-sans text-sm tracking-wide">Loading pieces...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-[#8B5E6A] font-sans text-sm mb-4">Could not load products. Please try again.</p>
            <Button onClick={() => window.location.reload()} className="bg-[#2D5A40] text-[#FFDAB9] rounded-full px-6 py-2 font-sans text-sm">
              Retry
            </Button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#4A6355] font-sans text-sm">No products found in this category.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => {
                const pid = product._id ?? product.id;
                const image = getImage(product);
                const price = getPrice(product);
                const originalPrice = getOriginalPrice(product);
                const rating = getRating(product);
                const reviews = getReviews(product);
                const name = getName(product);
                const material = getMaterial(product);

                return (
                  <motion.div key={pid} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.04 }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col"
                    onMouseEnter={() => setHoveredId(`p-${pid}`)} onMouseLeave={() => setHoveredId(null)}>

                    {/* Image */}
                    <Link href={`/product/${pid}`} className="block relative overflow-hidden h-36 sm:h-52 lg:h-60 shrink-0">
                      <motion.img src={image} alt={name} animate={{ scale: hoveredId === `p-${pid}` ? 1.07 : 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="w-full h-full object-cover" />

                      {/* Wishlist */}
                      <button onClick={(e) => { e.preventDefault(); toggleWishlist(pid); }}
                        className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 z-10">
                        <Heart size={12} className={wishlist.includes(pid) ? "fill-[#8B5E6A] text-[#8B5E6A]" : "text-[#2D5A40]"} />
                      </button>

                      {/* Hover overlay — desktop only */}
                      <div className={`hidden sm:flex absolute inset-0 bg-[#2D5A40]/80 items-center justify-center transition-opacity duration-300 ${hoveredId === `p-${pid}` ? "opacity-100" : "opacity-0"}`}>
                        <span className="text-white font-sans text-xs tracking-widest uppercase border border-white/40 px-4 py-2 rounded-full flex items-center gap-2">
                          View Details <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-2.5 sm:p-4 flex flex-col gap-1 flex-1">
                      <Link href={`/product/${pid}`}>
                        <h4 className="text-[#2D5A40] font-serif text-xs sm:text-base leading-snug hover:text-[#4A8565] transition-colors line-clamp-2">{name}</h4>
                      </Link>

                      {/* Stars — hidden on mobile */}
                      {rating > 0 && (
                        <div className="hidden sm:flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, s) => (
                              <Star key={s} size={10} className={s < Math.round(rating) ? "fill-[#FFDAB9] text-[#FFDAB9]" : "fill-gray-200 text-gray-200"} />
                            ))}
                          </div>
                          {reviews > 0 && <span className="text-[#4A6355]/50 font-sans text-[10px]">({reviews})</span>}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                        <span className="text-[#2D5A40] font-serif text-sm sm:text-lg">{price}</span>
                        {originalPrice && (
                          <span className="text-[#4A6355]/40 font-sans text-[10px] sm:text-xs line-through">{originalPrice}</span>
                        )}
                      </div>

                      {/* CTA */}
                      <Link href={`/product/${pid}`}
                        className="mt-1.5 w-full text-center bg-[#FAF7F2] hover:bg-[#2D5A40] text-[#2D5A40] hover:text-[#FFDAB9] border border-[#2D5A40]/20 hover:border-[#2D5A40] rounded-full py-1.5 sm:py-2 text-[10px] sm:text-xs font-sans tracking-wider uppercase transition-all duration-300">
                        Shop Now
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ── CTA STRIP ── */}
      <section className="relative py-24 overflow-hidden bg-[#2D5A40]">
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute -top-20 -left-20 w-96 h-96 bg-[#4A8565]/40 rounded-full blur-[100px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], y: [0, 60, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[#FFDAB9]/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="block text-[#FFDAB9]/70 text-xs font-sans tracking-[0.4em] uppercase mb-6">Your Story Awaits</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl text-white mb-6 leading-tight">
            Find the piece<br /><span className="italic font-light text-[#FFDAB9]">that speaks to you</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/60 font-sans mb-10 text-lg">
            Browse our full shop for every occasion, every emotion, every milestone.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button asChild className="bg-[#FFDAB9] text-[#2D5A40] hover:bg-white rounded-full px-10 py-6 text-base font-sans flex items-center gap-3 mx-auto w-fit group transition-all">
              <Link href="/shop">Explore Full Shop <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}