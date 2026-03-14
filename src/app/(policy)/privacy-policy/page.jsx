"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, RefreshCcw, Mail, FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "Information Collection",
    icon: <Eye className="w-5 h-5" />,
    color: "#E07040",
    content: "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email, shipping address, and voice recordings used for personalized gifts."
  },
  {
    title: "Data Security",
    icon: <Lock className="w-5 h-5" />,
    color: "#52B788",
    content: "Your security is our priority. We implement industry-standard encryption (SSL) to protect your personal data and audio recordings. Voice messages are encrypted and stored in secure, private servers accessible only via the generated QR link."
  },
  {
    title: "Usage of Voice Gifting",
    icon: <Shield className="w-5 h-5" />,
    color: "#B5622A",
    content: "Voice recordings provided for the 'Voice Gifting' feature are used exclusively for creating your personalized product. These files are never shared with third parties for marketing purposes."
  },
  {
    title: "Updates to Policy",
    icon: <RefreshCcw className="w-5 h-5" />,
    color: "#4A90E2",
    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the 'Last Modified' date at the bottom."
  }
];

function PolicySection({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="mb-10 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
          style={{ background: `${section.color}15`, color: section.color }}
        >
          {section.icon}
        </div>
        <h3 className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          {section.title}
        </h3>
      </div>
      <div className="pl-14">
        <p className="text-stone-600 leading-relaxed text-sm lg:text-base border-l-2 border-stone-100 pl-6">
          {section.content}
        </p>
      </div>
    </motion.div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Editorial Header */}
        <div className="mb-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex p-4 rounded-full bg-white shadow-xl shadow-orange-500/5 border border-orange-100/50"
          >
            <Shield className="w-8 h-8" style={{ color: "#E07040" }} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Privacy <em className="italic font-light" style={{ color: "#E07040" }}>Protocols</em>
          </motion.h1>
          
          <div className="flex items-center justify-center gap-4 opacity-30">
            <div className="h-px w-12 bg-stone-900" />
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Trust & Transparency</span>
            <div className="h-px w-12 bg-stone-900" />
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-stone-200/50 border border-white/40">
          <div className="mb-12 pb-12 border-b border-stone-100">
             <p className="text-lg text-stone-700 italic font-serif leading-relaxed">
               "At Ismarn, we believe your data is as precious as the jewels we craft. Our commitment to your privacy is absolute, ensuring every scannable memory remains a private treasure."
             </p>
          </div>

          <div className="space-y-4">
            {SECTIONS.map((section, idx) => (
              <PolicySection key={idx} section={section} index={idx} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 pt-8 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-stone-400" />
              <span className="text-sm text-stone-500 font-medium">privacy@ismarn.boutique</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
              Last Modified: March 2026
            </div>
          </motion.div>
        </div>

        {/* Decorative elements to fill space */}
        <div className="absolute top-[30%] left-4 hidden lg:block opacity-5 pointer-events-none">
          <span className="text-[120px] font-black [writing-mode:vertical-lr] rotate-180 uppercase tracking-tighter leading-none select-none">
            Integrity
          </span>
        </div>
      </div>
    </main>
  );
}
