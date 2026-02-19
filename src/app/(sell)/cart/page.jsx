"use client";

import { useState, useEffect, useCallback } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PersonalizedMessageButton from "@/components/cart/PersonalizedMessageButton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/fetcher"
// ── Helpers ──────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Skeleton loader for a cart row ──────────────────────────
const RowSkeleton = () => (
  <div className="flex gap-5 p-5 bg-white/60 rounded-2xl border border-white/50 animate-pulse">
    <div className="w-24 h-24 rounded-xl bg-[#e8ddd4]" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-4 bg-[#e8ddd4] rounded w-2/3" />
      <div className="h-3 bg-[#e8ddd4] rounded w-1/3" />
      <div className="h-8 bg-[#e8ddd4] rounded w-1/2 mt-4" />
    </div>
    <div className="h-5 w-16 bg-[#e8ddd4] rounded self-start" />
  </div>
);

export default function CartPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // { [productId]: true }
  const [recommended, setRecommended] = useState([]);

  // ── Fetch cart from DB ──────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/cart"));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Recommended — products NOT in cart ────────────────────
  useEffect(() => {
    fetch(apiUrl("/api/products"))
      .then((r) => r.json())
      .then((all) => {
        const inCart = new Set(items.map((i) => i.id));
        setRecommended(all.filter((p) => !inCart.has(p._id)).slice(0, 4));
      })
      .catch(() => {});
  }, [items]);

  // ── Update quantity ────────────────────────────────────────
  const updateQty = async (productId, delta) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty < 1) return;
    if (newQty > item.stock) { toast.error("Not enough stock"); return; }

    setItems((prev) => prev.map((i) => i.id === productId ? { ...i, qty: newQty } : i));
    setUpdating((u) => ({ ...u, [productId]: true }));

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });
    } catch {
      toast.error("Failed to update quantity");
      fetchCart(); // revert
    } finally {
      setUpdating((u) => ({ ...u, [productId]: false }));
    }
  };

  // ── Remove item ────────────────────────────────────────────
  const removeItem = async (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
      fetchCart();
    }
  };

  // ── Save personalized message ──────────────────────────────
  const saveMessage = async (productId, blob, type) => {
    try {
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("type", type);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { id } = await uploadRes.json();
      const message = { id, type, url: `/api/message/${id}` };

      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, message }),
      });
      setItems((prev) => prev.map((i) => i.id === productId ? { ...i, message } : i));
      toast.success("Message saved!");
    } catch {
      toast.error("Failed to save message");
    }
  };

  // ── Add recommended to cart ────────────────────────────────
  const addToCart = async (product) => {
    if (!session) { toast.error("Please log in first"); return; }
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      toast.success(`${product.name} added to cart`);
      fetchCart();
    } catch {
      toast.error("Failed to add item");
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 10000 ? 0 : subtotal === 0 ? 0 : 500;
  const total = subtotal + shipping;

  // ── Empty state ────────────────────────────────────────────
  if (!loading && items.length === 0) return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] flex flex-col items-center justify-center px-4 py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-sm w-full"
      >
        <div className="w-20 h-20 bg-[#fff0e5] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-9 h-9 text-[#C59D5F]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#2d1a10] mb-2">Your cart is empty</h2>
        <p className="text-[#9c8272] mb-8 text-sm">No pieces in your collection yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#2d1a10] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#4a2c1d] transition-colors group"
        >
          Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] py-10 px-4">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#FFDAB9]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4ede5]/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif font-bold text-[#2d1a10] mb-8"
        >
          Your Cart {!loading && <span className="text-lg font-sans font-normal text-[#9c8272]">({items.length} {items.length === 1 ? "item" : "items"})</span>}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart items ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {loading
              ? [1, 2, 3].map((k) => <RowSkeleton key={k} />)
              : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0 }}
                      className="flex flex-col sm:flex-row gap-5 p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Product image */}
                      <div className="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden border border-[#e8ddd4] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-semibold text-[#2d1a10] truncate">{item.name}</h3>
                        <p className="text-xs text-[#a78b71] capitalize mt-0.5">{item.material} · {item.type}</p>

                        {/* Controls */}
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <div className="flex items-center gap-1 border border-[#e0d5cc] rounded-full px-1 py-0.5 bg-white">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              disabled={updating[item.id] || item.qty <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5ede5] transition-colors disabled:opacity-40"
                            >
                              <Minus className="w-3 h-3 text-[#5c4632]" />
                            </button>
                            <span className="w-7 text-center text-sm font-medium text-[#2d1a10]">
                              {updating[item.id] ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              disabled={updating[item.id] || item.qty >= item.stock}
                              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5ede5] transition-colors disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3 text-[#5c4632]" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <PersonalizedMessageButton
                            initialMessage={item.message}
                            onMessageSaved={(blob, type) => saveMessage(item.id, blob, type)}
                          />

                          {item.message && (
                            <span className="text-[10px] bg-[#fff0e5] text-[#C59D5F] font-bold px-2 py-0.5 rounded-full border border-[#f5dfc5]">
                              ✦ Message added
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-[#2d1a10]">{fmt(item.price * item.qty)}</p>
                        {item.qty > 1 && (
                          <p className="text-xs text-[#a78b71] mt-0.5">{fmt(item.price)} each</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )
            }
          </div>

          {/* ── Order summary ───────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="text-xl font-serif font-bold text-[#2d1a10] mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Subtotal</span>
                  <span>{loading ? "—" : fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Shipping</span>
                  {loading
                    ? <span>—</span>
                    : shipping === 0
                      ? <span className="text-emerald-600 font-medium">Free</span>
                      : <span>{fmt(shipping)}</span>
                  }
                </div>
                {subtotal > 0 && subtotal < 10000 && (
                  <p className="text-[10px] text-[#a78b71] bg-[#fff8f2] rounded-lg px-3 py-2">
                    Add {fmt(10000 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="h-px bg-[#ede5dd] my-1" />
                <div className="flex justify-between text-[#2d1a10] font-bold text-base">
                  <span>Total</span>
                  <span>{loading ? "—" : fmt(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className={`mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all
                  ${loading || items.length === 0
                    ? "bg-[#c4b4a7] cursor-not-allowed pointer-events-none"
                    : "bg-[#2d1a10] hover:bg-[#4a2c1d] hover:shadow-lg group"
                  }`}
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-xs text-[#a78b71] mt-4">Free shipping on orders over ₹10,000</p>
            </div>
          </div>
        </div>

        {/* ── Recommended ──────────────────────────────────── */}
        {recommended.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-serif font-bold text-[#2d1a10] mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-white/60"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#f5ede5]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-sm text-[#2d1a10] truncate">{product.name}</p>
                    <p className="text-[#C59D5F] font-bold text-sm mt-0.5">{fmt(product.price)}</p>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/product/${product._id}`}
                        className="flex-1 text-center text-xs py-2 border border-[#e0d5cc] rounded-lg hover:bg-[#f5ede5] transition-colors font-medium text-[#5c4632]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-9 h-9 flex items-center justify-center bg-[#2d1a10] rounded-lg hover:bg-[#4a2c1d] transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}