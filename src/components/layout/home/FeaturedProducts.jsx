"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; 
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowRight, Star, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";


export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const { addToCart } = useCart();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.slice(0, 3));
            setLoading(false);
            return;
          }
        }
      } catch (err) {}

      setProducts([
        { id: 1, name: "Peach Sapphire Solitaire", price: "1,20,000", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e" },
        { id: 2, name: "Rose Gold Temple Set", price: "85,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" },
        { id: 3, name: "Blush Emerald Drops", price: "60,000", image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4" },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;
    setAddingProductId(productId);
    await addToCart(product, 1);
    setAddingProductId(null);
    setAddedProductId(productId);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (loading) {
    return (
      <section className="h-[60vh] flex items-center justify-center bg-[#FCFBFA]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </section>
    );
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-[#FCFBFA]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-amber-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-rose-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-[1px] bg-amber-300"></span>
              <span className="text-amber-800 text-[10px] font-black uppercase tracking-[0.4em]">The Signature Collection</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1]">
              The <span className="italic font-light text-slate-400">Ojas</span> Edit
            </h2>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-900 transition-colors">
            View All Pieces <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid/Scroll Wrapper */}
        <div className="relative">
          <div 
            className="flex md:grid md:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-8 md:pb-0"
          >
            {products.map((product, idx) => (
              <motion.div 
                key={product._id || product.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="min-w-[85vw] md:min-w-0 snap-center"
              >
                <Card className="h-full border-none shadow-none bg-transparent group">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-sm">
                    <img
                      src={product.image || product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <CardContent className="px-1 pt-8">
                    <div className="flex flex-col gap-6">
                      <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-serif text-slate-950 group-hover:text-amber-800 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xl font-medium text-amber-900">₹{product.price}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/product/${product._id || product.id}`} className="flex-[3]">
                          {/* FIXED: High contrast background and white text */}
                          <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold tracking-wide transition-all active:scale-95 shadow-lg">
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="h-14 flex-1 rounded-2xl border-slate-200 hover:border-amber-600 hover:bg-amber-50 transition-colors"
                          onClick={() => handleAddToCart(product)}
                          disabled={addingProductId === (product._id || product.id)}
                        >
                          {addingProductId === (product._id || product.id) ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : addedProductId === (product._id || product.id) ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <ShoppingCart className="h-5 w-5 text-slate-700" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
}