"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle, Sparkles, MessageSquare, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";

const FAQ_DATA = [
  {
    category: "Voice Gifting",
    questions: [
      {
        q: "How does the Voice Gifting feature work?",
        a: "Every Ismarn piece comes with a custom QR card. Use our app or website to record a message. Once scanned by the recipient, your voice message plays automatically. It's an encrypted digital heirloom."
      },
      {
        q: "Is my voice message private?",
        a: "Yes. All recordings are encrypted and stored on private, secure servers. Only individuals with the physical QR code (your recipient) can access the audio."
      }
    ]
  },
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard shipping takes 3-7 business days across India. We also offer 48-hour express delivery for major metro cities."
      },
      {
        q: "Can I track my luxury shipment?",
        a: "Absolutely. Once dispatched, you'll receive a private tracking link via SMS and Email. All shipments are fully insured until they reach your doorstep."
      }
    ]
  },
  {
    category: "Quality & Assurance",
    questions: [
      {
        q: "Are the diamonds and gold certified?",
        a: "Every Ismarn creation is BIS Hallmarked and comes with an IGI/GIA certificate for diamonds and a certificate of authenticity for gemstones."
      },
      {
        q: "Do you offer a lifetime warranty?",
        a: "We offer a lifetime buy-back policy and free professional cleaning for life at any of our authorized centers."
      }
    ]
  }
];

function AccordionItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="mb-4 overflow-hidden rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-xl shadow-lg transition-all hover:bg-white/60"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left outline-none"
      >
        <span className="text-sm md:text-base font-bold text-stone-900 pr-8">{faq.q}</span>
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'bg-stone-900 text-white rotate-180' : 'bg-white text-stone-500'}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-8 text-sm md:text-base leading-relaxed text-stone-600 border-t border-white/40 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");

  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Editorial Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-[4px] text-emerald-700">Support Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-stone-900 mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Always Here <br /> To <em className="italic font-light" style={{ color: "#E07040" }}>Guide You</em>
          </motion.h1>

          <div className="relative max-w-lg mx-auto">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                <Search className="w-4 h-4" />
             </div>
             <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your question..."
                className="h-16 w-full rounded-full border-white bg-white/60 pl-14 pr-6 shadow-xl backdrop-blur-xl focus:bg-white transition-all text-sm outline-none border-stone-100"
             />
          </div>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-16">
          {FAQ_DATA.map((group, gIdx) => (
            <div key={gIdx} className="relative">
              <div className="mb-8 flex items-center gap-4">
                 <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-stone-400 whitespace-nowrap">{group.category}</h2>
                 <div className="h-px w-full bg-stone-100" />
              </div>

              <div className="space-y-4">
                {group.questions
                  .filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
                  .map((faq, fIdx) => (
                    <AccordionItem key={fIdx} faq={faq} index={fIdx} />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-24 p-10 rounded-[3rem] bg-stone-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Sparkles className="w-20 h-20 text-orange-400" />
          </div>
          
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Headphones className="w-7 h-7 text-orange-400" />
             </div>
             <div>
                <h4 className="text-xl font-bold">Still have questions?</h4>
                <p className="text-sm text-stone-400">Our concierge team is available 24/7 for you.</p>
             </div>
          </div>
          
          <button className="px-10 py-4 bg-white text-stone-900 rounded-full font-bold uppercase tracking-[3px] text-[10px] hover:scale-105 transition-transform flex items-center gap-2">
             <MessageSquare className="w-4 h-4" /> Live Chat Now
          </button>
        </motion.div>
      </div>
    </main>
  );
}
