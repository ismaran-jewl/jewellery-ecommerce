"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, MapPin, Phone, User, Mail,
  ShieldCheck, Truck, Loader2, CheckCircle2, Tag, X,
  BadgeCheck, ChevronRight, Gift,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/lib/fetcher";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── Floating label input ─────────────────────────────────────
const Field = ({ label, icon: Icon, type = "text", name, required, placeholder, pattern, minLength, className = "", defaultValue = "" }) => (
  <div className={`relative ${className}`}>
    {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-[#b5a090] pointer-events-none" />}
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder ?? label}
      pattern={pattern}
      minLength={minLength}
      defaultValue={defaultValue}
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

// ── Load Razorpay SDK ─────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) { resolve(true); return; }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // Promo state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discount, freeShipping, description }

  // ── Load cart from DB ─────────────────────────────────────
  useEffect(() => {
    fetch(apiUrl("/api/cart"))
      .then((r) => r.json())
      .then((d) => { setCartItems(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = appliedPromo?.discount ?? 0;
  const shippingPrice = (subtotal > 10000 || appliedPromo?.freeShipping) ? 0 : 500;
  const taxPrice = Math.round(subtotal * 0.03);
  const total = Math.max(0, subtotal + shippingPrice + taxPrice - discount);

  // ── Apply Promo Code ──────────────────────────────────────
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      setAppliedPromo(data);
      toast.success(`Promo applied! You saved ${fmt(data.discount)}`);
    } catch {
      toast.error("Could not apply promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    toast.info("Promo code removed");
  };

  // ── Place order (COD path) ────────────────────────────────
  const createOrder = async (shippingAddress, paymentMethod, razorpayOrderId = null) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress,
        paymentMethod,
        promoCode: appliedPromo?.code || null,
        discountAmount: discount,
        razorpayOrderId,
      }),
    });
    return res;
  };

  // ── Handle Razorpay payment flow ──────────────────────────
  const handleRazorpay = async (shippingAddress) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { toast.error("Payment gateway failed to load"); return; }

    // 1. Initialize Razorpay order on server
    setIsProcessing(true);
    const initRes = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountAmount: discount }),
    });
    const initData = await initRes.json();
    if (!initRes.ok) { toast.error(initData.error ?? "Payment init failed"); setIsProcessing(false); return; }

    // 2. Open Razorpay modal
    const options = {
      key: initData.keyId,
      amount: initData.amount,
      currency: initData.currency,
      name: "Jewellery Store",
      description: "Luxury Jewellery Purchase",
      order_id: initData.orderId,
      prefill: {
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
      },
      theme: { color: "#C59D5F" },
      handler: async (response) => {
        try {
          // 3. Create order in DB with razorpayOrderId
          const orderRes = await createOrder(shippingAddress, "razorpay", initData.orderId);
          const orderData = await orderRes.json();
          if (!orderRes.ok) { toast.error(orderData.error ?? "Order creation failed"); setIsProcessing(false); return; }

          // 4. Verify payment signature server-side
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) { toast.error(verifyData.error ?? "Payment verification failed"); setIsProcessing(false); return; }

          clearCart?.();
          toast.success("Payment successful! Order confirmed.");
          router.push(`/order-confirmation?orderId=${verifyData.orderId ?? orderData.orderId}`);
        } catch {
          toast.error("Error confirming payment. Contact support.");
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => { setIsProcessing(false); },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => {
      toast.error(`Payment failed: ${resp.error.description}`);
      setIsProcessing(false);
    });
    rzp.open();
  };

  // ── Form submit ───────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const form = e.target;
    const shippingAddress = {
      address: form.address.value,
      city: form.city.value,
      postalCode: form.pincode.value,
      country: "India",
    };

    if (paymentMethod === "cod") {
      setIsProcessing(true);
      try {
        const res = await createOrder(shippingAddress, "cod");
        const data = await res.json();
        if (!res.ok) { toast.error(data.error ?? "Something went wrong"); setIsProcessing(false); return; }
        clearCart?.();
        toast.success("Order placed successfully!");
        router.push(`/order-confirmation?orderId=${data.orderId}`);
      } catch {
        toast.error("Network error — please try again");
        setIsProcessing(false);
      }
    } else {
      await handleRazorpay(shippingAddress);
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
          Secure Checkout
        </motion.h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left: Shipping + Payment ─────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Section title="Shipping Details" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name" icon={User} name="fullname" required placeholder="John Doe" className="md:col-span-2" defaultValue={session?.user?.name ?? ""} />
                  <Field label="Email" icon={Mail} name="email" type="email" required placeholder="john@example.com" className="md:col-span-2" defaultValue={session?.user?.email ?? ""} />
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
                    { id: "razorpay", label: "Pay Online", sub: "Cards, UPI, Net Banking — powered by Razorpay", badge: "Recommended" },
                    { id: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
                        ${paymentMethod === opt.id
                          ? "border-[#C59D5F] bg-[#fffaf5] shadow-sm"
                          : "border-[#e0d5cc] hover:border-[#d4c4b5]"
                        }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${paymentMethod === opt.id ? "border-[#C59D5F]" : "border-[#c4b4a7]"}`}
                      >
                        {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-[#C59D5F]" />}
                      </div>
                      <input type="radio" name="payment" className="sr-only" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#2d1a10] text-sm">{opt.label}</span>
                          {opt.badge && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C59D5F] text-white px-1.5 py-0.5 rounded-full">{opt.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-[#a78b71] mt-0.5">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === "razorpay" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-xs text-[#9c8272] bg-[#f9f5f1] rounded-xl px-4 py-3">
                    <ShieldCheck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                    Your payment is 256-bit SSL encrypted & secured by Razorpay PCI DSS compliance
                  </motion.p>
                )}
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
              <ul className="divide-y divide-[#f5ede5] max-h-52 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 px-6 py-3">
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

              {/* Promo code */}
              <div className="px-6 py-4 border-t border-[#f0e8e0]">
                <AnimatePresence mode="wait">
                  {appliedPromo ? (
                    <motion.div
                      key="applied"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between bg-[#f0faf5] border border-[#6dba9e] rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-[#2d9e6b]" />
                        <div>
                          <p className="text-xs font-bold text-[#2d9e6b]">{appliedPromo.code}</p>
                          <p className="text-[10px] text-[#5c7a6a]">{appliedPromo.description || `${fmt(appliedPromo.discount)} off`}</p>
                        </div>
                      </div>
                      <button type="button" onClick={removePromo} className="text-[#9c8272] hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#b5a090]" />
                        <input
                          placeholder="Promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyPromo())}
                          className="w-full pl-9 pr-3 py-2.5 border border-[#e0d5cc] rounded-xl text-xs text-[#2d1a10] placeholder:text-[#c4b4a7] focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] bg-white transition-all tracking-widest font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-3 py-2.5 bg-[#2d1a10] text-white text-xs font-semibold rounded-xl hover:bg-[#4a2c1d] transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                      >
                        {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div className="px-6 py-4 border-t border-[#f0e8e0] space-y-2.5 text-sm">
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2d9e6b] font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2d1a10] to-[#5c3a1e] text-white font-semibold text-sm hover:from-[#4a2c1d] hover:to-[#7a4f2c] transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_8px_24px_rgba(45,26,16,0.4)]"
                >
                  {isProcessing
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
                    : paymentMethod === "razorpay"
                      ? <><CreditCard className="w-4 h-4" />Pay {fmt(total)} Securely</>
                      : `Place Order · ${fmt(total)}`
                  }
                </button>
                <div className="flex items-center justify-center gap-5 text-[10px] text-[#a78b71]">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured</span>
                  <span className="flex items-center gap-1">
                    <motion.span animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Truck className="w-3 h-3" />
                    </motion.span>
                    Fast Delivery
                  </span>
                  <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Luxury Packing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </main>
  );
}