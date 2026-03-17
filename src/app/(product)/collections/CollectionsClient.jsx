"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Diamond, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const COLLECTIONS = ["Modern Minimalist", "The Bridal Suite", "Royal Heritage"];

export default function CollectionsClient({ initialProducts, initialFilter }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter || null);
  
  const displayedProducts = activeFilter 
    ? initialProducts.filter(p => p.homepageSections?.includes(activeFilter))
    : initialProducts;

  return (
    <div className="relative pb-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[70%] bg-[#52B788]/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl relative z-10">
        {/* Navigation / Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-[#52B788] transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#52B788]/10 border border-[#52B788]/20 mb-6"
          >
            <Diamond size={14} className="text-[#52B788]" />
            <span className="text-[10px] text-[#52B788] font-bold uppercase tracking-[0.3em]">Curation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Exquisite <span className="italic" style={{ color: "#52B788" }}>Collections</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 font-light leading-relaxed"
          >
            Handpicked treasures designed to resonate with your unique story.
          </motion.p>
        </div>
        
        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button 
                variant={activeFilter === null ? "default" : "outline"}
                className={`rounded-full px-6 transition-all ${activeFilter === null ? 'bg-stone-900 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-900'}`}
                onClick={() => setActiveFilter(null)}
            >
                View All
            </Button>
            {COLLECTIONS.map(col => (
               <Button 
                    key={col}
                    variant={activeFilter === col ? "default" : "outline"}
                    className={`rounded-full px-6 transition-all ${activeFilter === col ? 'bg-[#52B788] text-white hover:bg-[#40916b] border-0' : 'border-stone-200 text-stone-600 hover:border-[#52B788] hover:text-[#52B788]'}`}
                    onClick={() => setActiveFilter(col)}
                >
                    {col}
                </Button> 
            ))}
        </div>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {displayedProducts.length > 0 ? displayedProducts.map((product, idx) => (
            <motion.div
              layout
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
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
                No products found in this collection.
             </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
