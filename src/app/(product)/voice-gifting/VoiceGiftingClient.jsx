"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Mic, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VoiceGiftingClient({ initialProducts }) {
  return (
    <div className="relative">
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#FF9E80]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-[#E07040] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </Link>
        </motion.div>

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF9E80]/10 border border-[#FF9E80]/20 mb-8"
          >
            <Mic size={14} className="text-[#E8603C]" />
            <span className="text-[10px] text-[#E8603C] font-bold uppercase tracking-[0.3em]">Signature Tech</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Gifts That <span className="italic" style={{ color: "#E8603C" }}>Speak</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 font-light leading-relaxed"
          >
            Pieces eligible for our proprietary NFC and QR-coded voice messaging service. 
            Choose a piece, record your heart, and immortalize your memories.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {initialProducts.length > 0 ? initialProducts.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (idx * 0.05) }}
            >
              <ProductCard 
                product={product} 
                isCartItem={false} 
                isWishlisted={false}
                onToggleWishlist={() => {}}
                onToggleCart={() => {}}
              />
            </motion.div>
          )) : (
             <div className="col-span-full py-20 text-center text-stone-400 font-serif text-xl italic">
                No Voice Gift products assigned yet.
             </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
