"use client";

import React, { useState, useEffect, useRef } from "react";
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
/* 1. HORIZONTAL SCROLL COMPONENT */
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
      const progress = scrollWidth > 0 ? scrollLeft / scrollWidth : 0;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="horizontal-scroll-container flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-proximity hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y pan-x',
          scrollBehavior: 'smooth',
        }}
      >
        {items.map((item, index) => {
          const offset = items.length > 1 ? index / (items.length - 1) : 0;
          const distance = Math.abs(scrollProgress - offset);
          const scale = 1 - Math.min(distance * 0.3, 0.1);
          const rotate = (scrollProgress - offset) * 5;
          const opacity = 1 - Math.min(distance * 1.2, 0.4);
          
          return (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-[220px] snap-center"
              onClick={() => onItemClick(item)}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale,
                  rotateY: rotate,
                  opacity,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 20,
                  mass: 0.8,
                }}
                className="relative rounded-2xl overflow-hidden shadow-xl border border-white/40 cursor-pointer bg-gray-100"
                style={{ 
                  height: '280px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    className="w-full h-full object-cover"
                    alt="Product"
                  />
                ) : (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Morphing Gradient Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  style={{
                    opacity: 0.7 + distance * 0.3,
                  }}
                />
                
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute top-3 left-3"
                >
                  <Badge className="bg-white/95 text-[#B76E79] border-none px-2.5 py-0.5 text-[10px] shadow-md backdrop-blur-sm">
                    {item.label}
                  </Badge>
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-semibold mb-0.5 line-clamp-1">
                    Signature No. {item.id + 1}
                  </p>
                  <p className="text-[10px] text-white/70">
                    Tap to explore →
                  </p>
                </div>

                {/* Shimmer effect on scroll */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  animate={{
                    x: `${(1 - distance * 2) * 100}%`,
                    opacity: Math.max(0, 1 - distance * 4),
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />

                {/* Glow effect on center */}
                <motion.div
                  className="absolute inset-0 bg-[#B76E79]/20 pointer-events-none"
                  animate={{
                    opacity: Math.max(0, 1 - distance * 3),
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 mx-4 h-1 bg-gray-200/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#B76E79] to-pink-400 rounded-full"
          style={{
            width: `${(scrollProgress * 100 || 0)}%`,
          }}
        />
      </div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs"
      >
        <span>Swipe to explore</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          →
        </motion.span>
      </motion.div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

/* ============================= */
/* 2. QUICK VIEW MODAL COMPONENT */
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
        {/* Media Side */}
        <div className="md:w-1/2 h-[300px] md:h-auto bg-gray-100 flex-shrink-0">
          {product.type === "image" ? (
            <img
              src={product.src}
              className="w-full h-full object-cover"
              alt="Product"
            />
          ) : (
            <video
              src={product.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content Side */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          </button>

          <div>
            <Badge className="w-fit mb-3 md:mb-4 bg-pink-100 text-[#B76E79] hover:bg-pink-100 border-none px-3">
              {product.label}
            </Badge>

            <h3 className="text-2xl md:text-4xl font-serif text-gray-800 mb-2">
              Signature Piece No. {product.id + 1}
            </h3>

            <div className="flex items-center gap-2 mb-4 md:mb-6 text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              ))}
              <span className="text-gray-400 text-xs md:text-sm ml-2">
                (48 Reviews)
              </span>
            </div>

            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
              Experience the pinnacle of our {product.label.toLowerCase()}{" "}
              collection. Crafted with sustainable materials and designed for the
              modern silhouette.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
              <span className="text-2xl md:text-3xl font-light text-gray-900">
                $189.00
              </span>
              <div className="flex gap-2">
                {["S", "M", "L"].map((size) => (
                  <div
                    key={size}
                    className="w-10 h-10 border rounded-full flex items-center justify-center text-sm cursor-pointer hover:border-black transition-all"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button className="w-full py-6 md:py-7 rounded-full bg-[#B76E79] hover:bg-[#a65d68] text-base md:text-lg shadow-lg shadow-pink-100">
            <ShoppingBag className="mr-2 w-4 h-4 md:w-5 md:h-5" />
            Add to Bag
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================= */
/* 3. MAIN COMPONENT             */
/* ============================= */

export default function SeasonalOffers() {
  const [activeProduct, setActiveProduct] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Countdown timer
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

  // Initialize media items
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

    setMediaItems(
      items.map((item, i) => ({
        ...item,
        id: i,
        top: i < 4 ? 10 + Math.random() * 15 : 70 + Math.random() * 15,
        left: (i % 4) * 25 + Math.random() * 5,
        size: 220 + Math.random() * 60,
        rotate: -8 + Math.random() * 16,
      }))
    );
  }, []);

  return (
    <section className="relative py-12 md:py-20 px-0 md:px-6 bg-[#FFF9F6] min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Desktop: Floating Products Background */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {mediaItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
              whileHover={{ scale: 1.05, zIndex: 50 }}
              transition={{
                y: {
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
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
                <img
                  src={item.src}
                  className="w-full aspect-[4/5] object-cover"
                  alt="Product"
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full aspect-[4/5] object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  <Sparkles className="w-6 h-6 text-[#B76E79]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center">
        <div className="flex flex-col items-center">
          {/* Hero Content - Compact on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-white/30 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/50 text-center shadow-2xl mb-6 md:mb-8 mx-4 md:mx-0"
          >
            <h2 className="text-2xl md:text-4xl font-serif text-[#4A4A4A] mb-2 md:mb-3 leading-tight">
              The <span className="text-[#B76E79] italic">Seasonal</span>
              <br className="hidden md:block" /> Edit
            </h2>
            <p className="text-gray-500 text-xs md:text-base mb-4 md:mb-6">
              {isMobile
                ? "Scroll to explore our collection"
                : "Click any piece to explore the details"}
            </p>

            <Button
              size="lg"
              className="rounded-full bg-[#4A4A4A] hover:bg-[#3a3a3a] px-6 md:px-8 py-4 md:py-5 text-sm md:text-base w-full sm:w-auto"
            >
              Explore All
              <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>

          {/* Mobile: Horizontal Scroll */}
          {isMobile && (
            <div className="w-full overflow-x-hidden">
              <HorizontalScroll
                items={mediaItems}
                onItemClick={setActiveProduct}
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Floating Countdown Timer */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 bg-white/40 backdrop-blur-xl px-6 lg:px-8 py-4 lg:py-6 rounded-[2rem] border border-white/60 shadow-2xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 text-[#B76E79]">
            <Clock className="w-5 h-5" />
            <span className="text-sm tracking-widest uppercase">
              Limited Time
            </span>
          </div>

          <div className="flex gap-3 lg:gap-4 text-[#4A4A4A]">
            {[
              { label: "H", value: timeLeft.hours },
              { label: "M", value: timeLeft.minutes },
              { label: "S", value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl lg:text-3xl font-light tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-xs tracking-widest text-gray-500 mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
