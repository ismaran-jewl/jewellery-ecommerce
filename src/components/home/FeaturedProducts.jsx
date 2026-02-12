"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";

const featuredProducts = [
  { 
    name: "Solitaire Diamond", 
    price: "₹1,20,000", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    offset: "0px"
  },
  { 
    name: "Temple Necklace", 
    price: "₹85,000", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    offset: "40px"
  },
  { 
    name: "Emerald Drops", 
    price: "₹60,000", 
    image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4?auto=format&fit=crop&q=80&w=800",
    offset: "-20px"
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-32 bg-[#FFF1EB] relative overflow-hidden">
      {/* Decorative Mint Blurs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#E9F2EE] rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-[#E9F2EE] rounded-full blur-[100px] opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* TOP NAV-STYLE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-24 border-b border-[#2C3E36]/10 pb-10">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles size={14} className="text-[#2C3E36]" />
               <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#2C3E36]/60">Exclusive Edit</span>
            </div>
            <h3 className="text-5xl font-light text-[#2C3E36] leading-[1.1]">
              Radiance <br />
              <span className="italic serif text-[#5A8D78]">Defined by You</span>
            </h3>
          </div>
          <p className="mt-6 md:mt-0 text-[11px] uppercase tracking-widest text-[#2C3E36]/70 max-w-[200px] text-right leading-loose font-medium">
            A celebration of hand-crafted elegance in every facet.
          </p>
        </div>

        {/* ORGANIC FLOATING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {featuredProducts.map((product, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              style={{ marginTop: product.offset }}
              className="group relative"
            >
              {/* Image with Mint Frame */}
              <div className="relative p-3 bg-[#E9F2EE] rounded-[40px] overflow-hidden shadow-xl shadow-[#2C3E36]/5 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[30px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  
                  {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Action */}
                  <button className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#2C3E36] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#2C3E36] hover:text-white">
                    <Plus size={24} strokeWidth={1} />
                  </button>
                </div>
              </div>

              {/* Product Labels */}
              <div className="mt-8 text-center space-y-2">
                <h4 className="text-xl font-light text-[#2C3E36]">{product.name}</h4>
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-4 bg-[#5A8D78]/30"></span>
                  <p className="text-[#5A8D78] font-bold text-xs uppercase tracking-[0.2em]">{product.price}</p>
                  <span className="h-px w-4 bg-[#5A8D78]/30"></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EXPLORE BUTTON WITH CIRCLE DECOR */}
        <div className="mt-32 flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-dashed border-[#5A8D78]/30 rounded-full group-hover:border-[#5A8D78]/60 transition-colors"
            />
            <button className="relative w-24 h-24 bg-[#5A8D78] rounded-full flex flex-col items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 shadow-lg">
              <ArrowUpRight size={28} />
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-1">All</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}