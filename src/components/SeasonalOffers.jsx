"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, ShoppingBag, X, Star } from "lucide-react";

/* ============================= */
/* 1. QUICK VIEW MODAL COMPONENT */
/* ============================= */

const QuickView = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row"
      >
        {/* Media Side */}
        <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-100">
          {product.type === "image" ? (
            <img src={product.src} className="w-full h-full object-cover" alt="Product" />
          ) : (
            <video src={product.src} autoPlay loop muted className="w-full h-full object-cover" />
          )}
        </div>

        {/* Content Side */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
          
          <Badge className="w-fit mb-4 bg-pink-100 text-[#B76E79] hover:bg-pink-100 border-none px-3">
            {product.label}
          </Badge>
          
          <h3 className="text-4xl font-serif text-gray-800 mb-2">Signature Piece No. {product.id + 1}</h3>
          
          <div className="flex items-center gap-2 mb-6 text-orange-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            <span className="text-gray-400 text-sm ml-2">(48 Reviews)</span>
          </div>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Experience the pinnacle of our {product.label.toLowerCase()} collection. 
            Crafted with sustainable materials and designed for the modern silhouette.
          </p>

          <div className="flex items-center justify-between mb-8">
            <span className="text-3xl font-light text-gray-900">$189.00</span>
            <div className="flex gap-2">
              {['S', 'M', 'L'].map(size => (
                <div key={size} className="w-10 h-10 border rounded-full flex items-center justify-center text-sm cursor-pointer hover:border-black transition-all">
                  {size}
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full py-7 rounded-full bg-[#B76E79] hover:bg-[#a65d68] text-lg shadow-lg shadow-pink-100">
            <ShoppingBag className="mr-2 w-5 h-5" />
            Add to Bag
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================= */
/* 2. UPDATED MAIN COMPONENT     */
/* ============================= */

export default function SeasonalOffers() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
const [timeLeft, setTimeLeft] = useState({
  hours: 12,
  minutes: 45,
  seconds: 30,
});

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      let { hours, minutes, seconds } = prev;

      if (seconds > 0) seconds--;
      else {
        if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }
        }
      }

      return { hours, minutes, seconds };
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const items = [
      { type: "image", src: "/images/product1.jpg", label: "New Arrival" },
      { type: "video", src: "/videos/product1.mp4", label: "Live Demo" },
      { type: "image", src: "/images/product2.jpg", label: "Limited Edition" },
      { type: "image", src: "/images/product3.jpg", label: "Organic" },
      { type: "video", src: "/videos/product2.mp4", label: "BTS" },
      { type: "image", src: "/images/product4.jpg", label: "Best Seller" },
      { type: "image", src: "/images/product5.jpg", label: "Trending" },
      { type: "video", src: "/videos/product3.mp4", label: "Collection" },
    ];

    setMediaItems(items.map((item, i) => ({
      ...item,
      id: i,
      top: i < 4 ? 5 + Math.random() * 20 : 65 + Math.random() * 20,
      left: (i % 4) * 25 + Math.random() * 5,
      size: 260 + Math.random() * 80,
      rotate: -8 + Math.random() * 16,
    })));
  }, []);

  return (
    <section className="relative py-32 px-6 bg-[#FFF9F6] overflow-hidden min-h-[1000px] flex items-center justify-center">
      {/* Background & Particles (Same as previous step) */}
      
      <div className="absolute inset-0 pointer-events-none z-0">
        {mediaItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            transition={{ y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              width: item.size,
              rotate: `${item.rotate}deg`,
            }}
            className="absolute pointer-events-auto cursor-pointer rounded-[2rem] overflow-hidden shadow-xl border border-white/40"
            onClick={() => setActiveProduct(item)}
          >
            {item.type === "image" ? (
              <img src={item.src} className="w-full aspect-[4/5] object-cover" />
            ) : (
              <video src={item.src} autoPlay loop muted playsInline className="w-full aspect-[4/5] object-cover" />
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <div className="bg-white/90 p-3 rounded-full shadow-lg">
                 <Sparkles className="w-6 h-6 text-[#B76E79]" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="relative z-10 max-w-2xl bg-white/30 backdrop-blur-xl p-12 rounded-[3rem] border border-white/50 text-center shadow-2xl">
        <h2 className="text-7xl font-serif text-[#4A4A4A] mb-4 leading-tight">
          The <span className="text-[#B76E79] italic">Seasonal</span> <br/>Edit
        </h2>
        <p className="text-gray-500 text-lg mb-8">Click any piece to explore the details.</p>
        <Button size="lg" className="rounded-full bg-[#4A4A4A] px-10 py-7 text-lg">
          Explore All
        </Button>
      </motion.div>
{/* Right Side Countdown Timer */}
<motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="absolute top right-12 top-1/2 -translate-y-1/2 z-20 bg-white/40 backdrop-blur-xl px-10 py-8 rounded-[2.5rem] border border-white/60 shadow-2xl text-center"
>
  <div className="flex items-center justify-center gap-2 mb-4 text-[#B76E79]">
    <Clock className="w-5 h-5" />
    <span className="text-sm tracking-widest uppercase">Limited Time</span>
  </div>

  <div className="flex gap-6 text-[#4A4A4A]">
    {[
      { label: "H", value: timeLeft.hours },
      { label: "M", value: timeLeft.minutes },
      { label: "S", value: timeLeft.seconds },
    ].map((item, i) => (
      <div key={i} className="flex flex-col items-center">
        <span className="text-4xl font-light tabular-nums">
          {String(item.value).padStart(2, "0")}
        </span>
        <span className="text-xs tracking-widest text-gray-500 mt-1">
          {item.label}
        </span>
      </div>
    ))}
  </div>
</motion.div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeProduct && (
          <QuickView 
            product={activeProduct} 
            onClose={() => setActiveProduct(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}