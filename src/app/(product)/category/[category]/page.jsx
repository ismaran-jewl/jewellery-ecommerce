"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, Sparkles, Ruler, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { apiUrl } from "@/lib/fetcher";

export default function CategoryPage({ params }) {
  const { category } = use(params);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl(`/api/products?category=${category}`));
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const displayTitle = category === 'new' ? 'New Arrivals' : category === 'best' ? 'Best Sellers' : category;

  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-16">
          <Link href="/shop" className="inline-flex items-center gap-2 text-stone-400 hover:text-orange-600 transition-colors mb-8 text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-8 bg-orange-400" />
                <span className="text-[11px] font-bold uppercase tracking-[6px] text-orange-700">Curated Collection</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-bold text-stone-900 leading-none capitalize"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {displayTitle} <br />
                <em className="italic font-light" style={{ color: "#E07040" }}>Selection</em>
              </motion.h1>
            </div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-start md:items-end gap-4"
            >
               <Link href="/size-guide" className="group flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-orange-100 shadow-xl hover:bg-orange-600 hover:text-white transition-all">
                  <Ruler className="w-4 h-4 text-orange-600 group-hover:text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Expert Size Guide</span>
               </Link>
               <p className="text-stone-400 text-xs font-serif italic max-w-xs md:text-right">
                 Every piece is meticulously inspected for quality and proportions before reaching your hands.
               </p>
            </motion.div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
              <span className="text-xs font-bold uppercase tracking-[4px] text-stone-400">Loading Treasures...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              <AnimatePresence>
                {products.length > 0 ? (
                    products.map((product, idx) => (
                      <motion.div
                        key={product.id || product._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group"
                      >
                        <Link href={`/product/${product.id || product._id}`}>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-stone-100 mb-6 shadow-xl transition-shadow group-hover:shadow-2xl">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/20 to-transparent flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="p-3 bg-white rounded-2xl shadow-lg">
                                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                               </div>
                            </div>
                          </div>

                          <div className="px-2 space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-bold text-stone-900 line-clamp-1">{product.name}</h3>
                              <span className="text-emerald-600 font-bold">₹{product.price?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="rounded-full text-[9px] uppercase tracking-widest border-stone-200 text-stone-500 py-1 bg-white">
                                  {product.material}
                               </Badge>
                               <Badge variant="outline" className="rounded-full text-[9px] uppercase tracking-widest border-stone-200 text-stone-500 py-1 bg-white">
                                  {product.type}
                               </Badge>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                ) : (
                  <div className="col-span-full text-center py-40 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/60">
                    <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-stone-400 mb-2">Collection Coming Soon</h3>
                    <p className="text-stone-400 text-sm">We are currently curating more exquisite pieces for this category.</p>
                    <Link href="/shop">
                       <Button variant="link" className="mt-6 text-orange-600 font-bold">Explore All Jewelry</Button>
                    </Link>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
