"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, Clock, CheckCircle2, Truck, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const STATUS = {
  Processing: { color: "bg-amber-100 text-amber-700",  icon: Clock,         label: "Processing"  },
  Shipped:    { color: "bg-indigo-100 text-indigo-700", icon: Truck,         label: "Shipped"     },
  Delivered:  { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Delivered"  },
  Cancelled:  { color: "bg-red-100 text-red-600",       icon: XCircle,       label: "Cancelled"   },
};

const StatusPill = ({ status }) => {
  const s = STATUS[status] ?? STATUS.Processing;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${s.color}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-[#f0e8e0] rounded-xl ${className}`} />
);

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const ref = order._id.toString().slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div variants={fadeUp} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        {/* Thumbnail of first item */}
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#e8ddd4] shrink-0 bg-[#fdf8f4]">
          {order.orderItems?.[0]?.image
            ? <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-[#c4b4a7]" /></div>
          }
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-mono font-bold text-[#2d1a10] text-sm">#{ref}</p>
              <p className="text-xs text-[#a78b71] mt-0.5">{date} · {order.orderItems?.length} {order.orderItems?.length === 1 ? "item" : "items"}</p>
            </div>
            <StatusPill status={order.status} />
          </div>

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <p className="font-bold text-[#2d1a10]">{fmt(order.totalPrice)}</p>
            <div className="flex items-center gap-2">
              <Link
                href={`/order-confirmation?orderId=${order._id}`}
                className="text-xs font-semibold text-[#C59D5F] hover:underline flex items-center gap-1"
              >
                View Details <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="text-xs font-semibold text-[#9c8272] hover:text-[#2d1a10] flex items-center gap-1 transition-colors"
              >
                Items {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#f5ede5] px-5 py-4 space-y-3 bg-[#fdf8f4]/60">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#e8ddd4] shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2d1a10] truncate">{item.name}</p>
                    <p className="text-xs text-[#a78b71]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-[#5c4632] shrink-0">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}

              {/* Price summary */}
              <div className="pt-2 border-t border-[#f0e8e0] space-y-1 text-xs text-[#a78b71]">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmt(order.itemsPrice)}</span></div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {order.shippingPrice === 0 ? <span className="text-emerald-600">Free</span> : <span>{fmt(order.shippingPrice)}</span>}
                </div>
                <div className="flex justify-between"><span>GST</span><span>{fmt(order.taxPrice)}</span></div>
                <div className="flex justify-between font-bold text-[#2d1a10] text-sm pt-1">
                  <span>Total</span><span>{fmt(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] py-10 px-4">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#FFDAB9]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4ede5]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#a78b71] mb-1">Account</p>
          <h1 className="text-3xl font-serif font-bold text-[#2d1a10] mb-6">My Orders</h1>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {tabs.map((tab) => {
            const count = tab === "All" ? orders.length : orders.filter((o) => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all
                  ${filter === tab
                    ? "bg-[#2d1a10] text-white border-[#2d1a10]"
                    : "bg-white/70 text-[#7c6a58] border-[#e0d5cc] hover:border-[#C59D5F]"
                  }`}
              >
                {tab} {!loading && count > 0 && <span className="opacity-60 ml-1">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((k) => (
              <div key={k} className="bg-white/70 rounded-2xl p-5 space-y-3">
                <div className="flex gap-4">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders list */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 rounded-2xl border border-white/60 shadow-sm p-12 text-center"
          >
            <div className="w-16 h-16 bg-[#fff0e5] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 text-[#C59D5F]" />
            </div>
            <h2 className="font-serif font-bold text-[#2d1a10] text-lg mb-1">
              {filter === "All" ? "No orders yet" : `No ${filter} orders`}
            </h2>
            <p className="text-sm text-[#a78b71] mb-6">
              {filter === "All" ? "Start shopping to see your orders here." : "Try a different filter."}
            </p>
            {filter === "All" && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#2d1a10] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#4a2c1d] transition-colors group"
              >
                Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        )}

        {!loading && filtered.length > 0 && (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}