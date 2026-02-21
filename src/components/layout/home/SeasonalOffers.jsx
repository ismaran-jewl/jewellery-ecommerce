"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, ShoppingBag, X, Star } from "lucide-react";

/* ============================= */
/* HORIZONTAL SCROLL COMPONENT  */
/* ============================= */
const HorizontalScroll = ({ items, onItemClick }) => {
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      setScrollProgress(scrollWidth > 0 ? scrollLeft / scrollWidth : 0);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        className="horizontal-scroll-container flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-proximity hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => {
          const offset = items.length > 1 ? index / (items.length - 1) : 0;
          const distance = Math.abs(scrollProgress - offset);
          const scale = 1 - Math.min(distance * 0.3, 0.1);
          const rotate = (scrollProgress - offset) * 5;
          const opacity = 1 - Math.min(distance * 1.2, 0.4);

          return (
            <motion.div key={item.id} className="flex-shrink-0 w-[220px] snap-center" onClick={() => onItemClick(item)}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                animate={{ scale, rotateY: rotate, opacity }}
                transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
                className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gray-100"
                style={{ height: "280px", transformStyle: "preserve-3d" }}
              >
                {item.type === "image" ? (
                  <img src={item.src} className="w-full h-full object-cover" alt="Product" />
                ) : (
                  <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  style={{ opacity: 0.7 + distance * 0.3 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute top-3 left-3"
                >
                  <Badge className="bg-white/95 text-[#E07040] border-none px-2.5 py-0.5 text-[10px] shadow-md backdrop-blur-sm">
                    {item.label}
                  </Badge>
                </motion.div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-semibold mb-0.5 line-clamp-1">Signature No. {item.id + 1}</p>
                  <p className="text-[10px] text-white/70">Tap to explore →</p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 mx-4 h-1 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${scrollProgress * 100 || 0}%`,
            background: "linear-gradient(90deg, #FF9E80, #52B788)",
          }}
        />
      </div>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
        className="flex items-center justify-center gap-2 mt-3 text-xs"
        style={{ color: "rgba(100,100,100,0.6)" }}
      >
        <span>Swipe to explore</span>
        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
      </motion.div>
      <style jsx global>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

/* ============================= */
/* QUICK VIEW MODAL              */
/* ============================= */
const QuickView = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
      >
        <div className="md:w-1/2 h-[300px] md:h-auto bg-gray-100 flex-shrink-0">
          {product.type === "image" ? (
            <img src={product.src} className="w-full h-full object-cover" alt="Product" />
          ) : (
            <video src={product.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          )}
        </div>
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <Badge className="w-fit mb-4 border-none px-3" style={{ background: "#FFE8D6", color: "#E07040" }}>
              {product.label}
            </Badge>
            <h3 className="text-2xl md:text-4xl font-serif mb-2" style={{ color: "#2D2D2D" }}>
              Signature Piece No. {product.id + 1}
            </h3>
            <div className="flex items-center gap-2 mb-6 text-orange-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-gray-400 text-sm ml-2">(48 Reviews)</span>
            </div>
            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              Experience the pinnacle of our {product.label.toLowerCase()} collection. Crafted with sustainable materials and designed for the modern silhouette.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <span className="text-3xl font-light" style={{ color: "#2D2D2D" }}>$189.00</span>
              <div className="flex gap-2">
                {["S", "M", "L"].map((size) => (
                  <div key={size} className="w-10 h-10 border rounded-full flex items-center justify-center text-sm cursor-pointer hover:border-black transition-all">
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            className="w-full py-6 rounded-full text-lg border-0"
            style={{ background: "linear-gradient(135deg, #FF9E80, #E8603C)", color: "white" }}
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Add to Bag
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================= */
/* MAIN COMPONENT                */
/* ============================= */
export default function SeasonalOffers() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
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
      ...item, id: i,
      top: i < 4 ? 10 + Math.random() * 15 : 70 + Math.random() * 15,
      left: (i % 4) * 25 + Math.random() * 5,
      size: 220 + Math.random() * 60,
      rotate: -8 + Math.random() * 16,
    })));
  }, []);

  return (
    <section className="relative py-12 md:py-20 px-0 md:px-6 bg-transparent min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">

      {/* Desktop: Floating Products */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {mediaItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
              whileHover={{ scale: 1.05, zIndex: 50 }}
              transition={{ y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" } }}
              style={{ top: `${item.top}%`, left: `${item.left}%`, width: item.size, rotate: `${item.rotate}deg` }}
              className="absolute pointer-events-auto cursor-pointer rounded-[2rem] overflow-hidden shadow-xl"
              onClick={() => setActiveProduct(item)}
            >
              {item.type === "image" ? (
                <img src={item.src} className="w-full aspect-[4/5] object-cover" alt="Product" />
              ) : (
                <video src={item.src} autoPlay loop muted playsInline className="w-full aspect-[4/5] object-cover" />
              )}
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  <Sparkles className="w-6 h-6" style={{ color: "#E07040" }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-[#FFD4C2]/20 mb-6 md:mb-8 mx-4 md:mx-0 text-center"
          >
            <h2 className="text-2xl md:text-4xl font-serif mb-2 md:mb-3 leading-tight" style={{ color: "#2D2D2D" }}>
              The{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #FF9E80, #E8603C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Seasonal
              </span>
              <br className="hidden md:block" /> Edit
            </h2>
            <p className="text-xs md:text-base mb-4 md:mb-6" style={{ color: "#8A8A8A" }}>
              {isMobile ? "Scroll to explore our collection" : "Click any piece to explore the details"}
            </p>
            <Button
              size="lg"
              className="rounded-full px-6 md:px-8 py-4 md:py-5 text-sm md:text-base w-full sm:w-auto border-0"
              style={{ background: "#2D2D2D", color: "white" }}
            >
              Explore All
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>

          {isMobile && (
            <div className="w-full overflow-x-hidden">
              <HorizontalScroll items={mediaItems} onItemClick={setActiveProduct} />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Countdown */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 bg-white/40 backdrop-blur-xl px-6 lg:px-8 py-4 lg:py-6 rounded-[2rem] shadow-2xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4" style={{ color: "#E07040" }}>
            <Clock className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">Limited Time</span>
          </div>
          <div className="flex gap-3 lg:gap-4" style={{ color: "#2D2D2D" }}>
            {[
              { label: "H", value: timeLeft.hours },
              { label: "M", value: timeLeft.minutes },
              { label: "S", value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl lg:text-3xl font-light tabular-nums">{String(item.value).padStart(2, "0")}</span>
                <span className="text-xs tracking-widest mt-1" style={{ color: "#AAAAAA" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {activeProduct && <QuickView product={activeProduct} onClose={() => setActiveProduct(null)} />}
      </AnimatePresence>
    </section>
  );
}