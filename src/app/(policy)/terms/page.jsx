"use client";

import { motion } from "framer-motion";
import { FileCheck, Scaling, CreditCard, Gift, Truck, RefreshCw, AlertCircle } from "lucide-react";

const SECTIONS = [
  {
    id: "use",
    title: "Terms of Use",
    icon: <Scaling className="w-5 h-5 text-orange-600" />,
    content: "By accessing and using Ismarn, you agree to comply with and be bound by these Terms and Conditions. Our platform is designed for personal, luxury retail use."
  },
  {
    id: "payment",
    title: "Payments & Pricing",
    icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
    content: "All prices are displayed in INR and are subject to change based on current gold market rates. We accept various payment methods including UPI, Credit Cards, and EMI options."
  },
  {
    id: "voice",
    title: "Voice Memory Service",
    icon: <Gift className="w-5 h-5 text-amber-600" />,
    content: "Personalized voice recordings are the property of the customer. Ismarn provides the hosting for these memories; however, customers are advised to keep backups of sensitive content."
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: <Truck className="w-5 h-5 text-blue-600" />,
    content: "Standard delivery takes 3-7 business days. Express shipping is available for certain locations. All shipments are insured and require a signature upon delivery."
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    icon: <RefreshCw className="w-5 h-5 text-rose-600" />,
    content: "Products can be returned within 7 days of delivery if in original condition. Custom-engraved or personalized voice-jewelry may have specific return limitations."
  }
];

export default function TermsPage() {
  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-10" style={{ background: "#E07040" }} />
            <span className="text-[11px] font-bold uppercase tracking-[6px]" style={{ color: "#E07040" }}>Legal Framework</span>
            <div className="h-px w-10" style={{ background: "#E07040" }} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-stone-900 mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Terms of <em className="italic font-light" style={{ color: "#E07040" }}>Service</em>
          </motion.h1>

          <p className="text-stone-500 font-serif italic text-lg max-w-xl mx-auto">
            Our governing agreements designed to ensure a safe, transparent, and luxurious shopping experience for everyone.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white/50 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {section.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-[2.5rem] bg-[#E07040]/5 border border-[#E07040]/10 flex items-start gap-4"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: "#E07040" }} />
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900">Important Disclaimer</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Jewelry images are for representation only. Actual colors and sizes may vary slightly due to artisan craftsmanship. We reserve the right to modify services and prices without prior notice based on market fluctuations.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
