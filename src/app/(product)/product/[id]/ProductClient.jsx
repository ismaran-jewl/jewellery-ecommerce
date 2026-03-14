"use client";

import { useState, use, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart, ShoppingCart, Truck, ShieldCheck, ArrowRight, Minus, Plus,
  Star, ZoomIn, Share2, Gift, RotateCcw, BadgeCheck, Loader2,
  ChevronRight, MessageSquare, ThumbsUp, X, Check
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import RecentlyViewed from "@/components/product/RecentlyViewed";

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
      className="relative aspect-square overflow-hidden rounded-2xl border border-[#ede3d8] bg-[#fdf6ef] cursor-zoom-in select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <img
        src={src}
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
function ReviewsSection({ productId }) {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleNewReview = (review) => {
    setData((prev) => ({
      ...prev,
      reviews: [review, ...(prev?.reviews ?? [])],
      totalReviews: (prev?.totalReviews ?? 0) + 1,
    }));
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
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setRelatedProducts(data.filter((p) => p._id !== product._id).slice(0, 4)))
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
          {/* ── Image ───────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ImageZoom src={product.image} alt={product.name} />

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
            {/* Category + type */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/shop?category=${product.category}`}>
                <Badge variant="secondary" className="capitalize px-3 py-1 bg-[#f5ede5] text-[#8B5E3C] border-0 hover:bg-[#ede3d8] transition-colors text-xs font-semibold">
                  {product.category}
                </Badge>
              </Link>
              <span className="text-[10px] uppercase tracking-widest text-[#b09070] font-semibold">{product.type}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d1a10] leading-snug">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 text-sm text-[#7c6a58]">
              <StarRating rating={4.8} />
              <span className="text-[#2d1a10] font-semibold">4.8</span>
              <span className="text-[#d4c4b0]">·</span>
              <span>120 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#2d1a10]">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-[#a78b71] line-through">
                ₹{Math.round(product.price * 1.2).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-[#2d9e6b] bg-[#e8faf2] px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </div>

            <Separator className="bg-[#f0e6dc]" />

            {/* Description */}
            <p className="text-[#7c6a58] leading-relaxed text-sm">
              {product.description ||
                `Elevate your style with this exquisite ${product.name}. Handcrafted with precision and care, this piece features premium ${product.material} and a timeless design suitable for any occasion. BIS Hallmarked for guaranteed purity.`}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Material", value: product.material },
                { label: "Type", value: product.type },
                { label: "Availability", value: product.stock > 0 ? `${product.stock} in stock` : "Out of stock", highlight: product.stock > 0 },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-[#ede3d8] px-3 py-2.5">
                  <p className="text-[9px] uppercase tracking-widest text-[#b09070] font-bold">{s.label}</p>
                  <p className={`text-sm font-semibold mt-0.5 capitalize ${s.highlight ? "text-[#2d9e6b]" : "text-[#2d1a10]"}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="bg-[#f0e6dc]" />

            {/* Quantity + CTA */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#e0d5cc] rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#f5ede5] transition-colors disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#5c4632]" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-[#2d1a10]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#f5ede5] transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#5c4632]" />
                  </button>
                </div>
                <span className="text-xs text-[#a78b71]">
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="text-[#e85d2f] font-semibold">Only {product.stock} left!</span>
                  )}
                </span>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-60
                    ${justAdded
                      ? "bg-[#2d9e6b] text-white"
                      : "bg-gradient-to-r from-[#2d1a10] to-[#5c3a1e] text-white hover:from-[#4a2c1d] hover:to-[#7a4f2c] hover:shadow-[0_8px_24px_rgba(45,26,16,0.4)]"
                    }`}
                >
                  {addingToCart ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
                  ) : justAdded ? (
                    <><Check className="w-4 h-4" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all
                    ${isWishlisted
                      ? "bg-red-50 border-red-200 text-red-500 shadow-sm"
                      : "border-[#e0d5cc] text-[#a78b71] hover:border-red-200 hover:text-red-400 hover:bg-red-50"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
                </motion.button>
              </div>

              {product.stock === 0 && (
                <p className="text-xs text-[#e85d2f] font-semibold text-center">This item is currently out of stock.</p>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {trustItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#7c6a58] bg-white rounded-xl border border-[#ede3d8] px-3 py-2.5">
                    <Icon className="w-3.5 h-3.5 text-[#C59D5F] shrink-0" />
                    {item.text}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={id} />

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
                        src={rp.image}
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
