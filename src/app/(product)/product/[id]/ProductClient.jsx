"use client";

import { useState, use, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart, ShoppingCart, Truck, ShieldCheck, ArrowRight, Minus, Plus,
  Star, ZoomIn, Share2, Gift, RotateCcw, BadgeCheck, Loader2,
  ChevronRight, MessageSquare, ThumbsUp, X, Check, ChevronDown, Mic
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { getImageUrl } from "@/lib/utils";

// ── Image Zoom Component ─────────────────────────────────────
function ImageZoom({ src, alt }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [zoomed, setZoomed] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden rounded-2xl md:rounded-3xl border border-[#ede3d8] bg-white cursor-zoom-in select-none shadow-sm"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <img
        src={getImageUrl(src)}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200"
        style={
          zoomed
            ? { transform: "scale(2.4)", transformOrigin: `${pos.x}% ${pos.y}%` }
            : { transform: "scale(1)", transformOrigin: "center" }
        }
        draggable={false}
      />
      {!zoomed && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-full pointer-events-none">
          <ZoomIn className="w-3 h-3" /> Hover to Zoom
        </div>
      )}
    </div>
  );
}

// ── Product Gallery ──────────────────────────────────────────
function ProductGallery({ images, name }) {
  const [activeIdx, setActiveIdx] = useState(0);
  
  // Normalize images to an array (filter out falsy values like undefined/null)
  const imgArray = Array.isArray(images) ? images.filter(Boolean) : [images].filter(Boolean);
  
  if (imgArray.length === 0) {
    return <div className="aspect-square bg-[#fdf6ef] rounded-2xl border border-[#ede3d8]" />;
  }

  return (
    <div className="space-y-4">
      <ImageZoom src={imgArray[activeIdx]} alt={name} />
      
      {imgArray.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {imgArray.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === i 
                  ? "border-[#C59D5F] opacity-100 shadow-md scale-105" 
                  : "border-transparent opacity-60 hover:opacity-100 bg-[#fdf6ef]"
              }`}
            >
              <img 
                src={getImageUrl(src)} 
                alt={`${name} thumbnail ${i + 1}`} 
                className="w-full h-full object-cover bg-[#fdf6ef]" 
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Accordion Component ──────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e0d5cc] py-4">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-sm font-semibold tracking-widest uppercase text-[#2d1a10] group-hover:text-[#C05A2E] transition-colors">{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#a78b71] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2 text-sm text-[#7c6a58] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Star Rating Component ────────────────────────────────────
function StarRating({ rating, max = 5, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[...Array(max)].map((_, i) => {
        const val = i + 1;
        const filled = interactive ? (hovered || rating) >= val : rating >= val;
        const half = !interactive && rating >= val - 0.5 && rating < val;
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRate?.(val)}
            onMouseEnter={() => interactive && setHovered(val)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`${interactive ? "cursor-pointer hover:scale-125 transition-transform" : "cursor-default"}`}
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                filled ? "fill-[#E8A800] text-[#E8A800]" :
                half ? "fill-[#E8A800]/50 text-[#E8A800]" :
                "fill-transparent text-[#d4c4b0]"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Review Card ──────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#ede3d8] p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-[#2d1a10]">{review.name}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-[#2d9e6b] bg-[#e8faf2] px-2 py-0.5 rounded-full border border-[#b5e8d0]">
                <BadgeCheck className="w-2.5 h-2.5" /> Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-[10px] text-[#a78b71] shrink-0">
          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      <p className="font-semibold text-sm text-[#2d1a10]">{review.title}</p>
      <p className="text-xs text-[#7c6a58] leading-relaxed">{review.body}</p>
    </motion.div>
  );
}

// ── Review Form ──────────────────────────────────────────────
function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to submit review"); return; }
      toast.success("Review submitted! Thank you.");
      onSuccess?.(data.review);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#fdf8f4] rounded-2xl border border-[#ede3d8] p-5 space-y-4">
      <h4 className="font-serif font-bold text-[#2d1a10]">Write a Review</h4>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#7c6a58] uppercase tracking-wider">Your Rating</label>
        <StarRating rating={rating} interactive onRate={setRating} />
      </div>
      <div className="relative">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
          placeholder="Review headline"
          className="w-full border border-[#e0d5cc] bg-white rounded-xl px-3 py-2.5 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7] focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all"
        />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        maxLength={1000}
        rows={3}
        placeholder="Tell others about your experience with this piece..."
        className="w-full border border-[#e0d5cc] bg-white rounded-xl px-3 py-2.5 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7] focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 bg-[#2d1a10] text-white text-sm font-semibold rounded-xl hover:bg-[#4a2c1d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</> : "Submit Review"}
      </button>
    </form>
  );
}

// ── Reviews Section ──────────────────────────────────────────
function ReviewsSection({ productId, onDataFetched }) {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        onDataFetched?.({ avg: json.avgRating || 0, count: json.totalReviews || 0 });
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [productId, onDataFetched]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleNewReview = (review) => {
    fetchReviews();
    setShowForm(false);
  };

  const { reviews = [], avgRating = 0, totalReviews = 0, distribution = {} } = data ?? {};
  const ratingBars = [5, 4, 3, 2, 1];

  return (
    <div className="mt-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#2d1a10] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#C59D5F]" />
          Customer Reviews
        </h2>
        {session && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm text-[#C59D5F] font-semibold hover:underline"
          >
            <Star className="w-4 h-4" /> Write a Review
          </button>
        )}
      </div>

      {/* Aggregate rating */}
      {totalReviews > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 items-start bg-white rounded-2xl border border-[#ede3d8] p-6">
          <div className="text-center shrink-0">
            <p className="text-5xl font-bold text-[#2d1a10]">{avgRating}</p>
            <StarRating rating={avgRating} />
            <p className="text-xs text-[#a78b71] mt-1">{totalReviews} reviews</p>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {ratingBars.map((star) => {
              const count = distribution[star] ?? 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-[#7c6a58] w-3">{star}</span>
                  <Star className="w-3 h-3 fill-[#E8A800] text-[#E8A800]" />
                  <div className="flex-1 bg-[#f0e6dc] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full bg-[#E8A800] rounded-full"
                    />
                  </div>
                  <span className="text-[10px] text-[#a78b71] w-4">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ReviewForm productId={productId} onSuccess={handleNewReview} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#C59D5F]" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#ede3d8]">
          <Star className="w-10 h-10 text-[#d4c4b0] mx-auto mb-3" />
          <p className="text-[#7c6a58] font-medium">No reviews yet.</p>
          <p className="text-sm text-[#a78b71] mt-1">Be the first to share your experience!</p>
          {session && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-[#C59D5F] font-semibold underline"
            >
              Write a Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Product Page ────────────────────────────────────────
export default function ProductClient({ product: initialProduct, id }) {
  const { data: session } = useSession();

  const [product, setProduct] = useState(initialProduct);
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(!initialProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addToCart: addToCartHook } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  useEffect(() => {
    if (initialProduct) return;
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, initialProduct]);

  useEffect(() => {
    if (!product) return;
    fetch(`/api/products?category=${product.category}`)
      .then((r) => r.ok ? r.json() : { products: [] })
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setRelatedProducts(productsArray.filter((p) => p._id !== product._id).slice(0, 4));
      })
      .catch(console.error);

    // Recently viewed (localStorage)
    try {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updated = [product._id, ...viewed.filter((v) => v !== product._id)].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [product]);

  const handleAddToCart = async () => {
    if (!session) { toast.error("Please log in to add items to cart"); return; }
    setAddingToCart(true);
    await addToCartHook(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    setAddingToCart(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#C59D5F]" />
        <span className="text-sm text-[#9c8272]">Loading product…</span>
      </div>
    </main>
  );

  if (!product) return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-serif font-bold text-[#2d1a10]">Product Not Found</h1>
        <p className="text-[#9c8272] text-sm">This jewellery piece may have been moved or sold out.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 text-[#C59D5F] font-semibold hover:underline">
          Browse Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );

  const trustItems = [
    { icon: Truck, text: "Free Delivery over ₹10,000" },
    { icon: ShieldCheck, text: "BIS Hallmarked" },
    { icon: RotateCcw, text: "15-Day Easy Returns" },
    { icon: Gift, text: "Luxury Gift Packaging" },
  ];

  return (
    <main className="min-h-screen bg-[#fdf8f2] py-10 sm:py-14">
      {/* Top accent line */}
      <div className="h-0.5 w-full fixed top-0 left-0 z-50" style={{ background: "linear-gradient(90deg, transparent, #c4a882, #8B5E3C, #c4a882, transparent)" }} />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#a78b71] mb-8">
          <Link href="/shop" className="hover:text-[#2d1a10] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#2d1a10] transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#7c6a58] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* ── Image Gallery ───────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ProductGallery images={product.images?.length > 0 ? product.images : [product.image]} name={product.name} />

            {/* Social share */}
            <div className="flex items-center justify-end mt-3 gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-[#a78b71] hover:text-[#5c4632] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </motion.div>

          {/* ── Details ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:pt-2"
          >
            {/* Category */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Link href={`/shop?category=${product.category}`} className="text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase text-[#a78b71] hover:text-[#C05A2E] transition-colors">
                {product.category}
              </Link>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2d1a10] leading-snug">
              {product.name}
            </h1>

            {/* Rating summary */}
            {reviewStats.count > 0 && (
              <div className="flex items-center gap-3 text-sm text-[#7c6a58] mt-3">
                <StarRating rating={reviewStats.avg} />
                <span className="text-[#2d1a10] font-semibold">{reviewStats.avg.toFixed(1)}</span>
                <span className="text-[#d4c4b0]">·</span>
                <a href="#reviews" className="hover:text-[#C05A2E] hover:underline transition-colors">{reviewStats.count} Reviews</a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center flex-wrap gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#2d1a10] tracking-tight">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#a78b71] font-bold ml-2">
                Taxes Included
              </span>
            </div>

            <div className="h-px bg-[#ede3d8] w-full my-6" />

            {/* Action Bar */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-[#e0d5cc] rounded-xl bg-white overflow-hidden h-14 w-full sm:w-36 shrink-0 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="flex-1 h-full flex items-center justify-center hover:bg-[#fdf8f4] transition-colors disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4 text-[#7c6a58]" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-[#2d1a10]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="flex-1 h-full flex items-center justify-center hover:bg-[#fdf8f4] transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4 text-[#7c6a58]" />
                  </button>
                </div>

                {/* Stock Status */}
                <span className="text-xs font-semibold tracking-wide uppercase text-center sm:text-left w-full sm:w-auto">
                  {product.stock <= 5 && product.stock > 0 ? (
                    <span className="text-[#C05A2E]">Only {product.stock} Remaining</span>
                  ) : product.stock === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <span className="text-[#52B788]">In Stock</span>
                  )}
                </span>
              </div>

              {/* Primary Actions */}
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 h-14 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60
                    ${justAdded
                      ? "bg-[#52B788] text-white"
                      : "bg-gradient-to-r from-[#FFB085] via-[#FFCFA9] to-[#FFB085] bg-[length:200%_auto] text-[#2d1a10] hover:shadow-[0_10px_30px_rgba(255,176,133,0.4)] hover:bg-right"
                    }`}
                >
                  {addingToCart ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
                  ) : justAdded ? (
                    <><Check className="w-4 h-4" /> Added to Bag</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Bag</>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleWishlist(product)}
                  className={`w-14 h-14 shrink-0 rounded-xl border-2 flex items-center justify-center transition-all shadow-sm
                    ${isWishlisted
                      ? "bg-[#FFF5ED] border-[#FFD4C2] text-[#C05A2E]"
                      : "bg-white border-[#e0d5cc] text-[#a78b71] hover:border-[#FFD4C2] hover:bg-[#FFF5ED] hover:text-[#C05A2E]"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#C05A2E]" : ""}`} />
                </motion.button>
              </div>
            </div>

            {/* USP Badge */}
            <div className="bg-[#FFF5ED] border border-[#FFD4C2] rounded-lg p-4 flex items-start gap-4 shadow-sm my-6">
              <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                <Mic className="w-5 h-5 text-[#B5622A]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3D1F0D] mb-1 tracking-wide">Memory-Linked Jewellery</h4>
                <p className="text-xs text-[#7A4528] leading-relaxed">This piece features a hidden NFC chip and scannable QR. Upload a personal voice message or video that stays with it forever.</p>
              </div>
            </div>

            {/* Accordions */}
            <div className="pt-2">
              <Accordion title="Description" defaultOpen={true}>
                {product.description || `Elevate your style with this exquisite ${product.name}. Handcrafted with precision and care, this piece features premium ${product.material} and a timeless design suitable for any occasion. BIS Hallmarked for guaranteed purity.`}
              </Accordion>
              <Accordion title="Product Details">
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Material:</strong> {product.material}</li>
                  <li><strong>Type:</strong> <span className="capitalize">{product.type}</span></li>
                  <li><strong>Purity:</strong> BIS Hallmarked</li>
                  <li><strong>SKU:</strong> ISM-{product._id?.substring(0, 6).toUpperCase()}</li>
                </ul>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <p className="mb-2"><strong>Free Insured Shipping</strong> on all domestic orders over ₹10,000.</p>
                <p>Enjoy a 15-day easy return policy. Bespoke or engraved pieces are non-refundable.</p>
              </Accordion>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div id="reviews">
          <ReviewsSection productId={id} onDataFetched={setReviewStats} />
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#2d1a10]">You May Also Like</h2>
              <Link href={`/shop?category=${product.category}`} className="text-[#C59D5F] hover:underline text-sm font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp, i) => (
                <motion.div
                  key={rp._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#ede3d8] hover:border-[#c4a882] hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/product/${rp._id}`}>
                    <div className="aspect-[4/5] overflow-hidden bg-[#fdf6ef]">
                      <img
                        src={getImageUrl(rp.image)}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-[#2d1a10] truncate group-hover:text-[#C59D5F] transition-colors">{rp.name}</p>
                      <p className="text-[#5c4632] font-bold text-sm mt-1">₹{rp.price?.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
