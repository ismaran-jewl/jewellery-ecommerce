"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Package, ArrowRight, Home, Loader2,
  MapPin, CreditCard, AlertTriangle, RefreshCw,
} from "lucide-react";
import Link from "next/link";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Confetti ──────────────────────────────────────────────────
const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-sm"
        style={{
          left: `${Math.random() * 100}%`,
          background: ["#C59D5F","#2d1a10","#FFDAB9","#a3d4c5","#f9c784"][i % 5],
        }}
        initial={{ top: "-5%", rotate: 0, opacity: 1 }}
        animate={{ top: "110%", rotate: Math.random() * 720 - 360, opacity: [1,1,0], x: (Math.random()-0.5)*200 }}
        transition={{ duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.6, ease: "easeIn" }}
      />
    ))}
  </div>
);

// ── Timeline step ─────────────────────────────────────────────
const Step = ({ label, sublabel, active, done, last }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
        ${done ? "bg-emerald-500 text-white" : active ? "bg-[#C59D5F] text-white shadow-md shadow-[#C59D5F]/30" : "bg-[#f0e8e0] text-[#a78b71]"}`}>
        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : "·"}
      </div>
      {!last && <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${done ? "bg-emerald-300" : "bg-[#e8ddd4]"}`} />}
    </div>
    <div className="pb-5">
      <p className={`text-sm font-semibold ${active || done ? "text-[#2d1a10]" : "text-[#a78b71]"}`}>{label}</p>
      {sublabel && <p className="text-xs text-[#a78b71] mt-0.5">{sublabel}</p>}
    </div>
  </div>
);

// ── Skeleton ──────────────────────────────────────────────────
const Sk = ({ className }) => <div className={`animate-pulse bg-[#f0e8e0] rounded-lg ${className}`} />;

// ── Error state ───────────────────────────────────────────────
const ErrorState = ({ message, onRetry }) => (
  <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] flex items-center justify-center px-4 py-16">
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center"
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="font-serif font-bold text-[#2d1a10] text-xl mb-2">Order Not Found</h2>
      <p className="text-sm text-[#9c8272] mb-6">{message}</p>
      <div className="flex flex-col gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2d1a10] text-white text-sm font-semibold hover:bg-[#4a2c1d] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
        <Link
          href="/orders"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#e0d5cc] text-sm font-semibold text-[#5c4632] hover:bg-[#fdf8f4] transition-colors"
        >
          View All Orders
        </Link>
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#e0d5cc] text-sm font-semibold text-[#5c4632] hover:bg-[#fdf8f4] transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    </motion.div>
  </main>
);

// ── No orderId in URL ─────────────────────────────────────────
const NoOrderState = () => (
  <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] flex items-center justify-center px-4">
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center"
    >
      <div className="w-16 h-16 bg-[#fff0e5] rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-[#C59D5F]" />
      </div>
      <h2 className="font-serif font-bold text-[#2d1a10] text-xl mb-2">No Order Selected</h2>
      <p className="text-sm text-[#9c8272] mb-6">This page requires a valid order link. Check your email or view your orders.</p>
      <Link
        href="/orders"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#2d1a10] text-white text-sm font-semibold hover:bg-[#4a2c1d] transition-colors group"
      >
        My Orders <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  </main>
);

// ── Main content ──────────────────────────────────────────────
function OrderConfirmationContent() {
  const params     = useSearchParams();
  const orderId    = params.get("orderId");
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);   // string | null
  const [show, setShow]       = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    fetch(`/api/orders/${orderId}`)
      .then(async (r) => {
        if (r.status === 401) throw new Error("Please log in to view this order.");
        if (r.status === 404) throw new Error("This order doesn't exist or doesn't belong to your account.");
        if (r.status === 400) throw new Error("The order link is invalid or malformed.");
        if (!r.ok)            throw new Error("Something went wrong. Please try again.");
        return r.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOrder(data);
        setLoading(false);
        setTimeout(() => setShow(true), 150);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, retries]);

  // No orderId param at all
  if (!orderId && !loading) return <NoOrderState />;

  // Fetch error
  if (error) return <ErrorState message={error} onRetry={() => setRetries((r) => r + 1)} />;

  const statusIndex = { Processing: 0, Shipped: 1, Delivered: 2 };
  const currentStep = statusIndex[order?.status] ?? 0;

  return (
    <>
      {show && <Confetti />}

      <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] px-4 py-10 md:py-16">
        {/* Ambient blob */}
        <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#FFDAB9]/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto space-y-4">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* ── Green header ── */}
            <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d7a62] px-6 pt-8 pb-7 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 260, damping: 20 }}
                className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                {loading
                  ? <Loader2 className="w-7 h-7 animate-spin" />
                  : <CheckCircle2 className="w-8 h-8 text-white" />
                }
              </motion.div>
              <h1 className="text-xl md:text-2xl font-serif font-bold">
                {loading ? "Loading Order…" : "Order Confirmed!"}
              </h1>
              {!loading && <p className="text-white/70 text-sm mt-1">Thank you for your purchase ✦</p>}
            </div>

            <div className="px-5 md:px-8 py-6 space-y-4">

              {/* ── Order ref ── */}
              <div className="flex items-center justify-between bg-[#fdf8f4] rounded-xl px-4 py-3 border border-[#f0e8e0]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#a78b71]">Order Reference</p>
                  {loading
                    ? <Sk className="h-6 w-32 mt-1" />
                    : <p className="font-mono font-bold text-[#2d1a10] text-lg mt-0.5">#{order?.orderRef ?? "—"}</p>
                  }
                </div>
                <Package className="w-5 h-5 text-[#C59D5F]" />
              </div>

              {/* ── Price breakdown ── */}
              <div className="space-y-2 text-sm">
                {loading ? (
                  <><Sk className="h-4 w-full" /><Sk className="h-4 w-4/5" /><Sk className="h-4 w-3/5" /><Sk className="h-5 w-2/5 mt-1" /></>
                ) : order && (
                  <>
                    <div className="flex justify-between text-[#7c6a58]"><span>Subtotal</span><span>{fmt(order.itemsPrice)}</span></div>
                    <div className="flex justify-between text-[#7c6a58]">
                      <span>Shipping</span>
                      {order.shippingPrice === 0
                        ? <span className="text-emerald-600 font-semibold">Free</span>
                        : <span>{fmt(order.shippingPrice)}</span>}
                    </div>
                    <div className="flex justify-between text-[#7c6a58]"><span>GST (3%)</span><span>{fmt(order.taxPrice)}</span></div>
                    <div className="h-px bg-[#f0e8e0]" />
                    <div className="flex justify-between font-bold text-[#2d1a10] text-base">
                      <span>Total Paid</span><span>{fmt(order.totalPrice)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* ── Items ── */}
              {!loading && order?.orderItems?.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#a78b71] mb-2">Items Ordered</p>
                  <ul className="divide-y divide-[#f5ede5] max-h-52 overflow-y-auto rounded-xl border border-[#f0e8e0]">
                    {order.orderItems.map((item, i) => (
                      <li key={i} className="flex gap-3 px-3 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#e8ddd4] shrink-0 bg-[#fdf8f4]">
                          {item.image
                            ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-[#c4b4a7]" /></div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2d1a10] truncate">{item.name}</p>
                          <p className="text-xs text-[#a78b71]">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#5c4632] shrink-0">{fmt(item.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Shipping address ── */}
              {!loading && order?.shippingAddress && (
                <div className="flex gap-3 bg-[#fdf8f4] rounded-xl px-4 py-3 border border-[#f0e8e0]">
                  <MapPin className="w-4 h-4 text-[#C59D5F] shrink-0 mt-0.5" />
                  <div className="text-sm text-[#7c6a58]">
                    <p className="font-semibold text-[#2d1a10] text-[10px] uppercase tracking-wider mb-1">Delivering to</p>
                    <p className="leading-snug">{order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.postalCode}</p>
                  </div>
                </div>
              )}

              {/* ── Payment ── */}
              {!loading && order?.paymentMethod && (
                <div className="flex items-center gap-3 bg-[#fdf8f4] rounded-xl px-4 py-3 border border-[#f0e8e0]">
                  <CreditCard className="w-4 h-4 text-[#C59D5F] shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#a78b71]">Payment</p>
                    <p className="text-sm font-medium text-[#2d1a10] capitalize">{order.paymentMethod}</p>
                  </div>
                  {order.isPaid && (
                    <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">Paid ✓</span>
                  )}
                </div>
              )}

              <p className="text-xs text-[#9c8272] bg-[#fdf8f4] rounded-xl p-3 border border-[#f0e8e0] leading-relaxed">
                A confirmation has been sent to your email. Track your order anytime from your dashboard.
              </p>

              {/* ── Timeline ── */}
              <div className="pt-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#a78b71] mb-3">Order Progress</p>
                {loading ? (
                  <div className="space-y-3">
                    <Sk className="h-4 w-full" />
                    <Sk className="h-4 w-3/4" />
                    <Sk className="h-4 w-1/2" />
                  </div>
                ) : (
                  <>
                    <Step label="Order Placed" sublabel="Confirmed"           done />
                    <Step label="Processing"   sublabel="1–2 business days"   done={currentStep >= 1} active={currentStep === 0} />
                    <Step label="Shipped"      sublabel="Est. 3–5 days"       done={currentStep >= 2} active={currentStep === 1} />
                    <Step label="Delivered"    sublabel="Sit back and relax"  done={currentStep >= 3} active={currentStep === 2} last />
                  </>
                )}
              </div>

              {/* ── CTAs ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link
                  href="/orders"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2d1a10] text-white text-sm font-semibold hover:bg-[#4a2c1d] transition-colors group"
                >
                  Track Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/shop"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e0d5cc] text-sm font-semibold text-[#5c4632] hover:bg-[#fdf8f4] transition-colors"
                >
                  <Home className="w-4 h-4" /> Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-[#a78b71] pb-4"
          >
            Questions? Email us at{" "}
            <a href="mailto:support@yourbrand.com" className="underline hover:text-[#5c4632] transition-colors">
              support@yourbrand.com
            </a>
          </motion.p>
        </div>
      </main>
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C59D5F]" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}