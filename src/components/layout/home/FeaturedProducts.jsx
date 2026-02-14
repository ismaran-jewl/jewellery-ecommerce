"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.slice(0, 3));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.warn("API fetch failed, using fallback data");
      }

      // Fallback Mock Data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts([
        { 
          // Ensure these IDs match your database or local data source
          id: 1,
          name: "Peach Sapphire Solitaire", 
          price: "₹1,20,000", 
          image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
          category: "Rings"
        },
        { 
          id: 2,
          name: "Rose Gold Temple Set", 
          price: "₹85,000", 
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
          category: "Necklaces"
        },
        { 
          id: 3,
          name: "Blush Emerald Drops", 
          price: "₹60,000", 
          image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4?auto=format&fit=crop&q=80&w=800",
          category: "Earrings"
        },
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-[#FFDAB9] flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#8B4513]" />
          <p className="text-[#8B4513] font-serif tracking-widest">LOADING COLLECTION...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#FFDAB9] via-[#FFC0CB] to-[#FFDAB9] overflow-hidden">
      
      {/* --- BACKGROUND MOTION FIGURES --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-white/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            y: [0, 60, 0],
            rotate: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FFB7C5]/40 rounded-full blur-[80px]"
        />
        <motion.div
            animate={{
                x: [-20, 20, -20],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFDAB9]/50 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4 text-[#8B4513]"
          >
            <Sparkles size={16} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">Curated Elegance</span>
            <Sparkles size={16} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-[#5D3A3A]"
          >
            Sun-Kissed <span className="italic text-[#D2691E] font-light">Treasures</span>
          </motion.h2>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product, i) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-sm shadow-xl shadow-[#8B4513]/5 border border-white/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#8B4513]/10 group-hover:-translate-y-2">
                  
                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Quick View Overlay */}
                  <AnimatePresence>
                    {hoveredId === product.id && (
                      <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-[#5D3A3A]/20 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0.8, y: 20, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full text-[#5D3A3A] font-medium tracking-wider flex items-center gap-3 shadow-lg"
                        >
                          <Eye size={18} />
                          QUICK VIEW
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-serif text-[#5D3A3A] group-hover:text-[#D2691E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#8B4513]/80 font-medium mt-2 tracking-wide">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}