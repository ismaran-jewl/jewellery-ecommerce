
"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { Sparkles, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SeasonalEditClient({ initialProducts }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, addToCart: addToCartHook, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist: toggleWishlistHook } = useWishlist();

  const handleToggleWishlist = async (product) => {
      if (!session) {
          toast.error("Please login to save items to your wishlist", {
              action: { label: "Login", onClick: () => router.push("/login") }
          });
          return;
      }
      try {
          await toggleWishlistHook(product);
      } catch (error) {
          toast.error("Something went wrong. Please try again.");
      }
  };

  const handleToggleCart = (product) => {
      // cart items from hook usually have .id or ._id depending on structure
      const isCartItem = cart?.some(item => item.id === product._id || item._id === product._id);
      if (isCartItem) {
          removeFromCart(product._id);
          toast.success("Removed from bag");
      } else {
          addToCartHook(product, 1);
          toast.success("Added to bag", {
              action: { label: "View Bag", onClick: () => router.push("/cart") }
          });
      }
  };

  return (
    <div className="relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#B8860B]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[50%] bg-pink-50 rounded-full blur-[100px]" />
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
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to All Collections</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 mb-8"
          >
            <Sparkles size={14} className="text-[#B8860B]" />
            <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-[0.3em]">Curated Selection</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The Seasonal <span className="italic text-[#B8860B]">Edit</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 font-light leading-relaxed"
          >
            A bespoke selection of our most coveted pieces. From the timeless brilliance of our Solitaire collection 
            to the warm glow of artisanal gold, discover the highlights of our current season.
          </motion.p>
        </div>

        {/* Product Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {initialProducts.map((product, idx) => {
            const isCartItem = cart?.some(item => item.id === product._id || item._id === product._id);
            const isWishlisted = isInWishlist(product._id);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (idx * 0.05) }}
              >
                <ProductCard 
                  product={product} 
                  isCartItem={isCartItem} 
                  isWishlisted={isWishlisted}
                  onToggleWishlist={() => handleToggleWishlist(product)}
                  onToggleCart={() => handleToggleCart(product)}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Featured Quote / Section Break */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-24 bg-stone-900 rounded-[3rem] text-center relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8860B] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <Calendar className="mx-auto mb-8 text-[#B8860B]" size={48} />
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
                    "Every piece tells a story of <span className="italic text-[#E6BE8A]">timeless elegance</span> and seasonal grace."
                </h2>
                <div className="w-20 h-1 bg-[#B8860B]/50 mx-auto rounded-full" />
                <p className="mt-8 text-stone-400 text-xs uppercase tracking-[0.4em] font-bold">The Ismarn Studio</p>
            </div>
        </motion.div>

        {/* Newsletter / CTA */}
        <div className="mt-32 text-center">
            <h3 className="text-xl font-bold text-stone-900 mb-4">Want early access to the next edit?</h3>
            <p className="text-stone-500 mb-8">Join our private list for exclusive seasonal releases.</p>
            <div className="inline-flex p-1 bg-white border border-stone-200 rounded-full shadow-lg group focus-within:border-[#B8860B] transition-all">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-6 pr-4 py-2 bg-transparent outline-none w-64 md:w-80 text-sm"
                />
                <button className="px-8 py-3 bg-[#B8860B] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#9a7009] transition-all shadow-md">
                    Join Waitlist
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
