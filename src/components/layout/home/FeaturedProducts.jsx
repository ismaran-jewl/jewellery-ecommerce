"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; 
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowRight, Check } from "lucide-react";
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
      <section className="py-24 flex items-center justify-center bg-[#fffcf8]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
      </section>
    );
  }

  return (
    <section className="relative py-10 overflow-hidden bg-[#fffcf8]">
      {/* Subtle Texture & Ambience */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-amber-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-rose-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="h-px w-8 bg-amber-800/30" />
            <span className="text-amber-900/80 text-[10px] font-bold uppercase tracking-[0.3em]">The Signature Collection</span>
            <span className="h-px w-8 bg-amber-800/30" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-4"
          >
            The <span className="italic font-light text-amber-700">Royal</span> Edit
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Discover our most coveted pieces, where timeless elegance meets contemporary artistry.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          {products.map((product, idx) => (
            <motion.div 
              key={product._id || product.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.8, ease: "easeOut" }}
              className="group min-w-[65vw] sm:min-w-[40vw] md:min-w-0 snap-center"
            >
              {/* Image Card */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone-100 mb-4 shadow-xl shadow-stone-200/40 group-hover:shadow-2xl group-hover:shadow-stone-200/60 transition-all duration-500">
                <Link href={`/product/${product._id || product.id}`}>
                  <img
                    src={product.image || product.images?.[0] || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                  />
                </Link>
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm text-slate-800 border border-white/50">
                    Best Seller
                  </span>
                </div>

                {/* Desktop Hover Action */}
                <div className="absolute inset-x-4 bottom-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block z-10">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white/95 backdrop-blur-md text-slate-900 hover:bg-amber-50 hover:text-amber-900 rounded-xl h-12 shadow-lg border border-white/50 transition-all font-medium tracking-wide"
                    disabled={addingProductId === (product._id || product.id)}
                  >
                    {addingProductId === (product._id || product.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : addedProductId === (product._id || product.id) ? (
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    {addingProductId === (product._id || product.id) ? "Adding..." : addedProductId === (product._id || product.id) ? "Added" : "Add to Cart"}
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center space-y-2">
                <Link href={`/product/${product._id || product.id}`}>
                  <h3 className="text-2xl font-serif text-slate-900 group-hover:text-amber-800 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-amber-700 font-medium tracking-wide text-lg">₹{product.price}</p>
                
                {/* Mobile Action Button */}
                <div className="md:hidden mt-3">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    variant="outline"
                    className="w-full rounded-xl border-amber-200 text-amber-900 hover:bg-amber-50 h-10 text-xs uppercase tracking-widest"
                    disabled={addingProductId === (product._id || product.id)}
                  >
                    {addingProductId === (product._id || product.id) ? "Adding..." : addedProductId === (product._id || product.id) ? "Added" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link href="/shop" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-amber-900 transition-colors">
            View All Collections <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}