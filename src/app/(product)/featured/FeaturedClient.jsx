"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Sparkles, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FeaturedClient({ initialProducts }) {
  return (
    <div className="relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#E07040]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[50%] bg-[#FFD4C2]/30 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl relative z-10">
        {/* Navigation / Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-[#E07040] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Signature Catalog</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E07040]/10 border border-[#E07040]/20 mb-8"
          >
            <Sparkles size={14} className="text-[#E07040]" />
            <span className="text-[10px] text-[#E07040] font-bold uppercase tracking-[0.3em]">Editor's Choice</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Signature <span className="italic text-[#E07040]">Collection</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 font-light leading-relaxed"
          >
            A curation of our most exquisite pieces, designed to define moments and transcend trends. 
            Discover the pinnacle of Ismaran craftsmanship.
          </motion.p>
        </div>

        {/* Product Grid */}
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
                No featured products found. Please assign them in the admin dashboard.
             </div>
          )}
        </motion.div>

        {/* Featured Quote / Section Break */}
        {initialProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-12 md:p-24 bg-[#FAF5F2] border border-[#FFE8D6] rounded-[3rem] text-center relative overflow-hidden shadow-inner"
          >
              <div className="relative z-10 max-w-2xl mx-auto">
                  <Star className="mx-auto mb-8 text-[#E07040] fill-[#E07040]/20" size={48} />
                  <h2 className="text-3xl md:text-5xl font-bold text-stone-800 mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                      "Redefining modern luxury, <span className="italic text-[#E07040]">one masterpiece</span> at a time."
                  </h2>
                  <div className="w-20 h-1 bg-[#E07040]/50 mx-auto rounded-full" />
              </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
