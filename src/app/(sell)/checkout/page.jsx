"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, MapPin, Phone, User, Mail,
  ShieldCheck, Truck, Loader2, Tag, X,
  BadgeCheck, Gift, QrCode, Copy, CheckCircle2, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { apiUrl } from "@/lib/fetcher";
import { QRCodeSVG } from "qrcode.react";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ── UPI QR Generator ──────────────────────────────────────────
function buildUpiString(amount, upiId = "jewellerystore@upi", name = "Jewellery Store") {
  return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Jewellery Order Payment")}`;
}

// ── Floating label input ──────────────────────────────────────
const Field = ({ label, icon: Icon, type = "text", name, required, placeholder, pattern, minLength, className = "", defaultValue = "" }) => (
  <div className={`relative ${className}`}>
    {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-[#b5a090] pointer-events-none" />}
    <input
      type={type} name={name} required={required}
      placeholder={placeholder ?? label} pattern={pattern}
      minLength={minLength} defaultValue={defaultValue}
      className={`w-full border border-[#e0d5cc] bg-white rounded-xl py-2.5 pr-3 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7]
        focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all ${Icon ? "pl-10" : "pl-3"}`}
    />
    <label className="absolute -top-2 left-3 text-[10px] font-bold uppercase tracking-wider text-[#9c8272] bg-white px-1">{label}</label>
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

// ── QR Payment Panel ──────────────────────────────────────────
function QrPaymentPanel({ total, onConfirm, isProcessing }) {
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || "jewellerystore@upi";
  const upiString = buildUpiString(total, upiId);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copyUpiId = async () => {
    await navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-gradient-to-br from-[#fdf8f4] to-[#f5ede5] border border-[#e0d5cc] rounded-2xl p-5 text-center space-y-4"
    >
      {/* QR Code */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-white p-3 rounded-2xl shadow-md border border-[#ede3d8] inline-block">
          <QRCodeSVG
            value={upiString}
            size={160}
            bgColor="#ffffff"
            fgColor="#2d1a10"
            level="H"
            imageSettings={{
              src: "/favicon.ico",
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#2d1a10]">Scan with any UPI app</p>
          <p className="text-[10px] text-[#9c8272]">Google Pay · PhonePe · Paytm · BHIM</p>
        </div>
      </div>

      {/* Amount chip */}
      <div className="inline-flex items-center gap-2 bg-[#2d1a10] text-white px-4 py-2 rounded-full text-sm font-bold">
        Pay {fmt(total)}
      </div>

      {/* UPI ID copy */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-[#e0d5cc] px-3 py-2.5 text-xs">
        <span className="flex-1 text-left font-mono text-[#2d1a10] truncate">{upiId}</span>
        <button
          type="button"
          onClick={copyUpiId}
          className="shrink-0 text-[#C59D5F] hover:text-[#a07840] transition-colors flex items-center gap-1"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="font-semibold">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Steps */}
      <ol className="text-left space-y-1.5 text-[10px] text-[#7c6a58]">
        {["Open any UPI app on your phone", "Scan the QR or enter the UPI ID above", `Pay exactly ${fmt(total)}`, "Tap \"I've Paid\" below to confirm your order"].map((s, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#C59D5F]/15 text-[#C59D5F] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {/* Confirm button */}
      <button
        type="button"
        onClick={() => { setConfirmed(true); onConfirm(); }}
        disabled={isProcessing || confirmed}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Confirming…</>
        ) : confirmed ? (
          <><CheckCircle2 className="w-4 h-4" />Order Placed!</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" />I&apos;ve Paid — Confirm Order</>
        )}
      </button>
      <p className="text-[9px] text-[#b5a090]">Your order will be confirmed after manual UPI verification</p>
    </motion.div>
  );
}

export default function CheckoutPage() {
  const { clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  // Promo state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // ── Seed default promos + load cart ──────────────────────
  useEffect(() => {
    // Seed FREE promo on app start (idempotent)
    fetch("/api/promo/seed", { method: "POST" }).catch(() => {});

    fetch(apiUrl("/api/cart"))
      .then((r) => r.json())
      .then((d) => { setCartItems(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = appliedPromo?.discount ?? 0;
  const shippingPrice = (subtotal > 10000 || appliedPromo?.freeShipping) ? 0 : (subtotal === 0 ? 0 : 500);
  const taxPrice = Math.round(subtotal * 0.03);
  const total = Math.max(0, subtotal + shippingPrice + taxPrice - discount);

  // ── Apply Promo Code ──────────────────────────────────────
  const handleApplyPromo = useCallback(async () => {
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
      toast.success(`🎉 Promo applied! You saved ${fmt(data.discount)}`);
    } catch {
      toast.error("Could not apply promo code");
    } finally {
      setPromoLoading(false);
    }
  }, [promoInput, subtotal]);

  const removePromo = () => { setAppliedPromo(null); setPromoInput(""); toast.info("Promo code removed"); };

  // ── Create order helper ───────────────────────────────────
  const createOrder = async (shippingAddress, method, razorpayOrderId = null) => {
    return fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: method,
        promoCode: appliedPromo?.code || null,
        discountAmount: discount,
        razorpayOrderId,
      }),
    });
  };

  // ── Razorpay flow ─────────────────────────────────────────
  const handleRazorpay = async (shippingAddress) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { toast.error("Payment gateway failed to load"); return; }

    setIsProcessing(true);
    const initRes = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountAmount: discount }),
    });
    const initData = await initRes.json();
    if (!initRes.ok) { toast.error(initData.error ?? "Payment init failed"); setIsProcessing(false); return; }

    const options = {
      key: initData.keyId,
      amount: initData.amount,
      currency: initData.currency,
      name: "Jewellery Store",
      description: "Luxury Jewellery Purchase",
      order_id: initData.orderId,
      prefill: { name: session?.user?.name ?? "", email: session?.user?.email ?? "" },
      theme: { color: "#C59D5F" },
      handler: async (response) => {
        try {
          const orderRes = await createOrder(shippingAddress, "razorpay", initData.orderId);
          const orderData = await orderRes.json();
          if (!orderRes.ok) { toast.error(orderData.error ?? "Order creation failed"); setIsProcessing(false); return; }

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
          if (!verifyRes.ok) { toast.error(verifyData.error ?? "Verification failed"); setIsProcessing(false); return; }

          clearCart?.();
          toast.success("✅ Payment successful! Order confirmed.");
          router.push(`/order-confirmation?orderId=${verifyData.orderId ?? orderData.orderId}`);
        } catch {
          toast.error("Error confirming payment. Please contact support.");
          setIsProcessing(false);
        }
      },
      modal: { ondismiss: () => setIsProcessing(false) },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => { toast.error(`Payment failed: ${resp.error.description}`); setIsProcessing(false); });
    rzp.open();
  };

  // ── QR / UPI flow (COD-style, manual verification) ───────
  const handleQrConfirm = async (shippingAddress) => {
    setIsProcessing(true);
    try {
      const res = await createOrder(shippingAddress, "upi_qr");
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Something went wrong"); setIsProcessing(false); return; }
      clearCart?.();
      toast.success("🎉 Order placed! We'll verify your UPI payment shortly.");
      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch {
      toast.error("Network error — please try again");
      setIsProcessing(false);
    }
  };

  // ── Form submit ───────────────────────────────────────────
  const getShippingAddress = (form) => ({
    address: form.address.value,
    city: form.city.value,
    postalCode: form.pincode.value,
    country: "India",
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    const shippingAddress = getShippingAddress(e.target);

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
    } else if (paymentMethod === "upi_qr") {
      // QR handled by inner button, not the form submit
    } else {
      await handleRazorpay(shippingAddress);
    }
  };

  // ── Store shippingAddress for QR confirm ─────────────────
  const [formRef, setFormRef] = useState(null);
  const handleQrConfirmClick = () => {
    if (!formRef) return;
    const addr = getShippingAddress(formRef);
    handleQrConfirm(addr);
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

        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-serif font-bold text-[#2d1a10] mb-8">
          Secure Checkout
        </motion.h1>

        {/* 🎁 FREE Coupon Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl px-5 py-3.5"
        >
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">🎉 Special Offer — Use code <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">FREE</span> for 99.99% OFF!</p>
            <p className="text-xs text-emerald-600 mt-0.5">Apply in the promo box below — almost free checkout!</p>
          </div>
          {!appliedPromo && (
            <button
              type="button"
              onClick={() => { setPromoInput("FREE"); }}
              className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors"
            >
              Auto-fill
            </button>
          )}
        </motion.div>

        <form ref={setFormRef} onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Left ─────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
              <Section title="Shipping Details" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name" icon={User} name="fullname" required placeholder="John Doe" className="md:col-span-2" defaultValue={session?.user?.name ?? ""} />
                  <Field label="Email" icon={Mail} name="email" type="email" required placeholder="john@example.com" className="md:col-span-2" defaultValue={session?.user?.email ?? ""} />
                  <Field label="Phone" icon={Phone} name="phone" type="tel" required placeholder="+91 98765 43210" pattern="[0-9]{10,}" minLength={10} className="md:col-span-2" />
                  <div className="relative md:col-span-2">
                    <textarea name="address" required placeholder="Street, Area, Landmark" rows={2}
                      className="w-full border border-[#e0d5cc] bg-white rounded-xl pl-3 pr-3 pt-4 pb-2 text-sm text-[#2d1a10] placeholder:text-[#c4b4a7] focus:outline-none focus:ring-2 focus:ring-[#C59D5F]/40 focus:border-[#C59D5F] transition-all resize-none" />
                    <label className="absolute -top-2 left-3 text-[10px] font-bold uppercase tracking-wider text-[#9c8272] bg-white px-1">Address</label>
                  </div>
                  <Field label="City" name="city" required placeholder="Mumbai" />
                  <Field label="Pincode" name="pincode" required placeholder="400001" />
                </div>
              </Section>
            </motion.div>

            {/* Payment */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
              <Section title="Payment Method" icon={CreditCard}>
                <div className="space-y-3">
                  {[
                    {
                      id: "razorpay",
                      label: "Pay Online",
                      sub: "Cards, UPI, Net Banking — powered by Razorpay",
                      badge: "Recommended",
                      icon: "💳",
                    },
                    {
                      id: "upi_qr",
                      label: "Scan QR Code",
                      sub: "Google Pay, PhonePe, Paytm, BHIM UPI",
                      badge: null,
                      icon: "📱",
                    },
                    {
                      id: "cod",
                      label: "Cash on Delivery",
                      sub: "Pay when your order arrives",
                      badge: null,
                      icon: "💵",
                    },
                  ].map((opt) => (
                    <div key={opt.id}>
                      <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
                        ${paymentMethod === opt.id ? "border-[#C59D5F] bg-[#fffaf5] shadow-sm" : "border-[#e0d5cc] hover:border-[#d4c4b5]"}`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                          ${paymentMethod === opt.id ? "border-[#C59D5F]" : "border-[#c4b4a7]"}`}>
                          {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-[#C59D5F]" />}
                        </div>
                        <input type="radio" name="payment" className="sr-only" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{opt.icon}</span>
                            <span className="font-semibold text-[#2d1a10] text-sm">{opt.label}</span>
                            {opt.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C59D5F] text-white px-1.5 py-0.5 rounded-full">{opt.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-[#a78b71] mt-0.5">{opt.sub}</p>
                        </div>
                      </label>

                      {/* QR panel expands inline */}
                      <AnimatePresence>
                        {paymentMethod === "upi_qr" && opt.id === "upi_qr" && (
                          <QrPaymentPanel
                            total={total}
                            onConfirm={handleQrConfirmClick}
                            isProcessing={isProcessing}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {paymentMethod === "razorpay" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-xs text-[#9c8272] bg-[#f9f5f1] rounded-xl px-4 py-3">
                    <ShieldCheck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                    256-bit SSL encrypted · Razorpay PCI DSS compliant
                  </motion.p>
                )}
              </Section>
            </motion.div>
          </div>

          {/* ── Right: Order summary ──────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="lg:col-span-5">
            <div className="sticky top-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0e8e0]">
                <h3 className="font-serif font-bold text-[#2d1a10]">Order Summary</h3>
                <p className="text-xs text-[#9c8272] mt-0.5">{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</p>
              </div>

              {/* Items */}
              <ul className="divide-y divide-[#f5ede5] max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 px-6 py-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#e8ddd4] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#2d1a10] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#a78b71] capitalize">{item.material} · Qty {item.qty}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#5c4632] shrink-0">{fmt(item.price * item.qty)}</p>
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
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                      <div className="flex gap-2">
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
                      </div>
                      {/* Hint */}
                      <button
                        type="button"
                        onClick={() => { setPromoInput("FREE"); setTimeout(handleApplyPromo, 0); }}
                        className="w-full text-[10px] text-emerald-600 font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Try FREE — 99.99% off!
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
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> Discount ({appliedPromo?.code})</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7c6a58]">
                  <span>Shipping</span>
                  {shippingPrice === 0
                    ? <span className="text-emerald-600 font-medium">Free</span>
                    : <span>{fmt(shippingPrice)}</span>}
                </div>
                <div className="flex justify-between text-[#7c6a58]">
                  <span>GST (3%)</span><span>{fmt(taxPrice)}</span>
                </div>
                <div className="h-px bg-[#ede5dd]" />
                <div className="flex justify-between text-[#2d1a10] font-bold text-base">
                  <span>Total</span>
                  <span className={discount > 0 ? "text-emerald-700" : ""}>{fmt(total)}</span>
                </div>
                {discount > 0 && (
                  <p className="text-[10px] text-center text-emerald-600 font-semibold bg-emerald-50 rounded-lg py-1.5">
                    🎉 You're saving {fmt(discount)} on this order!
                  </p>
                )}
              </div>

              {/* CTA — hide if QR is showing */}
              {paymentMethod !== "upi_qr" && (
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
              )}
            </div>
          </motion.div>
        </form>
      </div>
    </main>
  );
}