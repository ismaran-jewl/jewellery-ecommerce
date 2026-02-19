"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ShoppingBasket,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { apiUrl } from "@/lib/fetcher";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const STATUS = {
  Processing: {
    color: "bg-emerald-50 text-emerald-600",
    icon: Clock,
    label: "Processing",
  },
  Shipped: {
    color: "bg-indigo-100 text-indigo-700",
    icon: Truck,
    label: "Shipped",
  },
  Delivered: {
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    label: "Delivered",
  },
  Cancelled: {
    color: "bg-red-100 text-red-600",
    icon: XCircle,
    label: "Cancelled",
  },
};

const StatusPill = ({ status }) => {
  const s = STATUS[status] ?? STATUS.Processing;
  const Icon = s.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${s.color}`}
    >
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
};

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  const ref = order._id.toString().slice(-8).toUpperCase();
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      className="w-full bg-white/90 rounded-2xl border border-[#f0e8e0] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="w-full p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex gap-4 w-full min-w-0">
          {/* Image */}
          <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border border-[#e8ddd4] bg-[#fdf8f4]">
            {order.orderItems?.[0]?.image ? (
              <img
                src={order.orderItems[0].image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-6 h-6 text-[#c4b4a7]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-mono font-bold text-[#2d1a10] text-sm truncate">
                #{ref}
              </p>
              <p className="text-xs text-[#a78b71] break-words">
                {date} · {order.orderItems?.length}{" "}
                {order.orderItems?.length === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Status Button Style */}
            <div
              className={`w-full sm:w-fit p-2 rounded-xl text-xs font-bold flex sm:justify-start gap-2 transition-all ${STATUS[order.status]?.color || STATUS.Processing.color}`}
            >
              <StatusPill status={order.status} />
            </div>
          </div>
        </div>

        {/* Price + Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="font-bold text-[#2d1a10] text-base break-words">
            {fmt(order.totalPrice)}
          </p>

          <div className="flex sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href={`/order-confirmation?orderId=${order._id}`}
              className="w-full sm:w-auto text-center text-xs font-semibold text-[#C59D5F] hover:underline"
            >
              View Details
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="w-full sm:w-auto text-xs font-semibold text-[#9c8272] hover:text-[#2d1a10]"
            >
              {open ? "Hide Items" : "View Items"}
            </button>
          </div>
        </div>
      </div>

      {/* Expand */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#f0e8e0] px-4 py-4 space-y-3 bg-[#fdf8f4]/60">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex gap-3 items-center w-full min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-[#e8ddd4]">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2d1a10] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#a78b71]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-[#5c4632] break-words">
                    {fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
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

  useEffect(() => {
    fetch(apiUrl("/api/orders"))
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] py-6 px-4">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-serif font-bold text-[#2d1a10] mb-6">
          My Orders
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C59D5F]" />
          </div>
        )}

        {/* When Not Loading */}
        {!loading && (
          <div className="space-y-4 w-full">
            {orders.length === 0 ? (
              <div className="text-center py-10 flex flex-col items-center">
                <ShoppingBasket className="h-14 w-14 text-[#C59D5F] mb-4" />

                <p className="text-[#a78b71] text-lg mb-4">No orders found</p>

                <a
                  href="/shop"
                  className="inline-block bg-[#C59D5F] text-white px-5 py-2 rounded-md font-medium hover:bg-[#b38750] transition"
                >
                  Shop Now
                </a>
              </div>
            ) : (
              orders.map((order) => <OrderCard key={order._id} order={order} />)
            )}
          </div>
        )}
      </div>
    </main>
  );
}
