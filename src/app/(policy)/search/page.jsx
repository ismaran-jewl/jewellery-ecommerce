"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingBag, ArrowRight, Loader2, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { apiUrl } from "@/lib/fetcher";

const CATEGORIES = ["All", "Gold", "Diamond", "Silver", "Platinum"];

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
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
  }, []);

  const filtered = products.filter((p) => {
    const matchesQuery = 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.material.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || p.material.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesQuery && matchesCategory;
  });

  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-8xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <Search className="w-5 h-5 text-orange-600" />
            <span className="text-[11px] font-bold uppercase tracking-[6px] text-orange-700">The Vault Search</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-stone-900 mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Find Your <em className="italic font-light" style={{ color: "#E07040" }}>Signature</em>
          </motion.h1>

          <div className="relative max-w-2xl mx-auto mb-10 group">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-orange-500 transition-colors">
                <Search className="w-5 h-5" />
             </div>
             <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, material, or gemstone..."
                className="h-20 w-full rounded-[2.5rem] border-stone-200 bg-white/60 pl-16 pr-8 shadow-2xl backdrop-blur-2xl focus:bg-white transition-all text-lg outline-none"
             />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
             {CATEGORIES.map(cat => (
               <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    selectedCategory === cat 
                    ? "bg-stone-900 text-white shadow-xl scale-105" 
                    : "bg-white/50 text-stone-500 hover:bg-stone-100"
                  }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
              <span className="text-xs font-bold uppercase tracking-[4px] text-stone-400">Opening the Vault...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              <AnimatePresence>
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link href={`/product/${product.id}`}>
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
                          <span className="text-emerald-600 font-bold">₹{product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
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
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-40 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/60">
               <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-6" />
               <h3 className="text-2xl font-bold text-stone-400 mb-2">No Treasures Found</h3>
               <p className="text-stone-400 text-sm">Try adjusting your filters or searching for something else.</p>
               <Button 
                  onClick={() => {setQuery(""); setSelectedCategory("All");}}
                  variant="link" 
                  className="mt-6 text-orange-600 font-bold"
               >
                  Reset all filters
               </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
