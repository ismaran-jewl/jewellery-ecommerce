"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Ticket, ArrowRight, Sparkles, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Assuming sonner is available or standard

const OFFERS = [
  {
    id: 1,
    title: "Valentine's Day Special",
    code: "LOVE20",
    discount: "20% OFF",
    desc: "Celebrate love with a shimmering gift. Valid on all diamond jewellery collections.",
    expiry: "Valid till Feb 14, 2026",
    color: "from-orange-100 to-rose-100",
    accent: "#E07040",
    icon: <Gift className="w-5 h-5" />,
    badge: "Exclusive"
  },
  {
    id: 2,
    title: "The Gold Festival",
    code: "GOLDFEST",
    discount: "B1G1",
    desc: "Buy one gold band and get the second one of equal or lesser value absolutely free.",
    expiry: "Limited Time Offer",
    color: "from-amber-100 to-yellow-100",
    accent: "#B5622A",
    icon: <Sparkles className="w-5 h-5" />,
    badge: "Trending"
  },
  {
    id: 3,
    title: "Premier Shipping",
    code: "SHIP99",
    discount: "FREE",
    desc: "Enjoy complimentary express shipping on all orders exceeding ₹10,000.",
    expiry: "Always Active",
    color: "from-emerald-100 to-teal-100",
    accent: "#52B788",
    icon: <Zap className="w-5 h-5" />,
    badge: "Active"
  },
  {
     id: 4,
     title: "First Purchase Perk",
     code: "HELLO10",
     discount: "₹1000 OFF",
     desc: "New to Ismarn? Welcome to the family with a direct discount on your first order.",
     expiry: "For New Users Only",
     color: "from-blue-100 to-indigo-100",
     accent: "#4A90E2",
     icon: <Ticket className="w-5 h-5" />,
     badge: "Welcome"
  }
];

function OfferCard({ offer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast.success(`${offer.code} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br ${offer.color} p-8 shadow-xl`}
    >
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      
      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm" style={{ color: offer.accent }}>
            {offer.icon}
          </div>
          <Badge variant="outline" className="border-white/40 bg-white/40 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold">
            {offer.badge}
          </Badge>
        </div>

        <h3 className="mb-2 text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          {offer.title}
        </h3>
        
        <p className="mb-6 text-sm leading-relaxed text-stone-700/80">
          {offer.desc}
        </p>

        <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-white/60 p-4 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Promo Code</span>
            <span className="text-xl font-black tracking-tighter text-stone-900">{offer.code}</span>
          </div>
          <Button 
            onClick={handleCopy}
            variant="ghost" 
            className="group h-12 w-12 rounded-xl bg-white shadow-sm transition-all hover:bg-stone-900 hover:text-white"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        <div className="flex items-center justify-between border-t border-black/5 pt-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {offer.expiry}
          </span>
          <div className="flex items-center gap-1 text-sm font-bold" style={{ color: offer.accent }}>
            <span>{offer.discount}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Page() {
  return (
    <main 
      className="min-h-screen pb-24 pt-12 md:pt-20"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8" style={{ background: "#E07040" }} />
            <span className="text-[11px] font-bold uppercase tracking-[4px]" style={{ color: "#E07040" }}>Special Perks</span>
            <div className="h-px w-8" style={{ background: "#E07040" }} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-4xl md:text-6xl font-bold tracking-tight text-[#2D2D2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Exclusive <em className="italic font-light" style={{ color: "#E07040" }}>Collections</em> & Offers
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-xl text-stone-500 font-serif italic text-lg"
          >
            Handpicked rewards designed to make your journey with Ismarn even more vibrant. 
          </motion.p>
        </div>

        {/* Offers Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 flex flex-col items-center justify-center text-center px-8 py-12 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-[#52B788]/20 max-w-3xl mx-auto shadow-2xl shadow-[#52B788]/5"
        >
          <div className="h-16 w-16 rounded-full bg-[#D8F3DC] flex items-center justify-center mb-6 shadow-inner">
             <Ticket className="h-8 w-8 text-[#52B788]" />
          </div>
          <h4 className="text-2xl font-bold text-[#2D2D2D] mb-3">Have a unique promo code?</h4>
          <p className="text-base text-stone-600 mb-8 max-w-sm">
            Apply your special gift card or corporate discount during checkout for instant redemption.
          </p>
          <Button 
            variant="outline" 
            className="rounded-full border-[#52B788] text-[#1B4D3E] hover:bg-[#52B788] hover:text-white px-10 h-14 font-bold transition-all duration-300"
          >
            Start Discovering
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

export default Page;
