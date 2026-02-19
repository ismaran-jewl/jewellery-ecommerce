"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, MapPin, Phone, User, Mail,
  ShieldCheck, Truck, Loader2, ChevronDown, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/lib/fetcher";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Floating label input ─────────────────────────────────────
const Field = ({ label, icon: Icon, type = "text", name, required, placeholder, pattern, minLength, className = "" }) => (
  <div className={`relative ${className}`}>
    {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-[#b5a090] pointer-events-none" />}
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder ?? label}
      pattern={pattern}
      minLength={minLength}
      className={`w-full border border-[#e0d5cc] bg-white rounded-xl py-2.5 pr-3 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7]
        focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all
        ${Icon ? "pl-10" : "pl-3"}`}
    />
    <label className="absolute -top-2 left-3 text-[10px] font-bold uppercase tracking-wider text-[#9c8272] bg-white px-1">
      {label}
    </label>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f0e8e0]">
      <div className="w-8 h-8 bg-[#fff0e5] rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#C59D5F]" />
      </div>
      <h2 className="font-serif font-bold text-[#2d1a10]">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // ── Load cart from DB (same as cart page) ─────────────────
  useEffect(() => {
    fetch(apiUrl("/api/cart"))
      .then((r) => r.json())
      .then((d) => { setCartItems(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingPrice = subtotal > 10000 ? 0 : 500;
  const taxPrice = Math.round(subtotal * 0.03);
  const total = subtotal + shippingPrice + taxPrice;

  // ── Place order ────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const form = e.target;
    const shippingAddress = {
      address: form.address.value,
      city: form.city.value,
      postalCode: form.pincode.value,
      country: "India",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        setIsProcessing(false);
        return;
      }

      // Also clear local cart state
      clearCart?.();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${data.orderId}`)
    } catch {
      toast.error("Network error — please try again");
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4]">
      <Loader2 className="w-8 h-8 animate-spin text-[#C59D5F]" />
    </div>
  );

  if (cartItems.length === 0) return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-[#fff0e5] rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-7 h-7 text-[#C59D5F]" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#2d1a10] mb-2">Nothing to checkout</h1>
        <p className="text-[#9c8272] mb-6 text-sm">Your cart is empty.</p>
        <Link href="/shop" className="bg-[#2d1a10] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#4a2c1d] transition-colors">
          Start Shopping
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf8f4] to-[#f0ebe4] py-10 px-4">
      {/* ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#FFDAB9]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d4ede5]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[#9c8272] hover:text-[#2d1a10] transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif font-bold text-[#2d1a10] mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left: Shipping + Payment ─────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Section title="Shipping Details" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name" icon={User} name="fullname" required placeholder="John Doe" className="md:col-span-2" />
                  <Field label="Email" icon={Mail} name="email" type="email" required placeholder="john@example.com" className="md:col-span-2" />
                  <Field label="Phone" icon={Phone} name="phone" type="tel" required placeholder="+91 98765 43210" pattern="[0-9]{10,}" minLength={10} className="md:col-span-2" />

                  <div className="relative md:col-span-2">
                    <textarea
                      name="address"
                      required
                      placeholder="Street, Area, Landmark"
                      rows={2}
                      className="w-full border border-[#e0d5cc] bg-white rounded-xl pl-3 pr-3 pt-4 pb-2 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7]
                        focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all resize-none"
                    />
                    <label className="absolute -top-2 left-3 text-[10px] font-bold uppercase tracking-wider text-[#9c8272] bg-white px-1">Address</label>
                  </div>

                  <Field label="City" name="city" required placeholder="Mumbai" />
                  <Field label="Pincode" name="pincode" required placeholder="400001" />
                </div>
              </Section>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Section title="Payment Method" icon={CreditCard}>
                <div className="space-y-3">
                  {[
                    { id: "card", label: "Credit / Debit Card" },
                    { id: "upi",  label: "UPI / Net Banking" },
                    { id: "cod",  label: "Cash on Delivery" },
                  ].map((opt) => (
                    <div key={opt.id}>
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                          ${paymentMethod === opt.id
                            ? "border-[#C59D5F] bg-[#fffaf5] shadow-sm"
                            : "border-[#e0d5cc] hover:border-[#d4c4b5]"
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                          ${paymentMethod === opt.id ? "border-[#C59D5F]" : "border-[#c4b4a7]"}`}
                        >
                          {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-[#C59D5F]" />}
                        </div>
                        <input type="radio" name="payment" className="sr-only" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                        <span className="font-medium text-[#2d1a10] text-sm">{opt.label}</span>
                      </label>

                      {/* Expanded fields */}
                      {paymentMethod === "card" && opt.id === "card" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-2 px-4 pb-4 space-y-3 overflow-hidden"
                        >
                          <input placeholder="Card Number" className="w-full border border-[#e0d5cc] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all" required />
                          <div className="grid grid-cols-2 gap-3">
                            <input placeholder="MM / YY" className="w-full border border-[#e0d5cc] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all" required />
                            <input placeholder="CVV" className="w-full border border-[#e0d5cc] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all" required />
                          </div>
                        </motion.div>
                      )}
                      {paymentMethod === "upi" && opt.id === "upi" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          className="mt-2 px-4 pb-4 overflow-hidden"
                        >
                          <input placeholder="UPI ID (e.g. name@upi)" className="w-full border border-[#e0d5cc] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all" required />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>
          </div>

          {/* ── Right: Order summary ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e8e0]">
                <h3 className="font-serif font-bold text-[#2d1a10]">Order Summary</h3>
                <p className="text-xs text-[#9c8272] mt-0.5">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</p>
              </div>

              {/* Items list */}
              <ul className="divide-y divide-[#f5ede5] max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#e8ddd4] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d1a10] truncate">{item.name}</p>
                      <p className="text-xs text-[#a78b71] capitalize">{item.material} · Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#5c4632] shrink-0">{fmt(item.price * item.qty)}</p>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="px-6 py-4 border-t border-[#f0e8e0] space-y-2.5 text-sm">
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Shipping</span>
                  {shippingPrice === 0
                    ? <span className="text-emerald-600 font-medium">Free</span>
                    : <span>{fmt(shippingPrice)}</span>
                  }
                </div>
                <div className="flex justify-between text-[#7c6a58]">
                  <span>GST (3%)</span><span>{fmt(taxPrice)}</span>
                </div>
                <div className="h-px bg-[#ede5dd]" />
                <div className="flex justify-between text-[#2d1a10] font-bold text-base">
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-[#2d1a10] text-white font-semibold text-sm hover:bg-[#4a2c1d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                    : `Pay ${fmt(total)}`
                  }
                </button>
                <div className="flex items-center justify-center gap-5 text-[10px] text-[#a78b71]">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure</span>
                  <span className="flex items-center gap-1">
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Truck className="w-3 h-3" />
                    </motion.span>
                    Fast Delivery
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </main>
  );
}