"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, ShoppingBag, X, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import { SEASONAL_OFFERS_FALLBACK } from "@/config/home";

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
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex-shrink-0 w-[220px] snap-center"
            onClick={() => onItemClick(item)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gray-100 hover:shadow-2xl transition-shadow duration-300"
              style={{ height: "280px" }}
            >
              {item.type === "image" ? (
                <img src={item.src} className="w-full h-full object-cover" alt="Product" />
              ) : (
                <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/95 text-[#E07040] border-none px-2.5 py-0.5 text-[10px] shadow-md backdrop-blur-sm">
                  {item.label}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="text-sm font-semibold mb-0.5 line-clamp-1">Signature No. {item.id + 1}</p>
                <p className="text-[10px] text-white/70">Tap to explore →</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Progress indicator */}
      <div className="mt-4 mx-4 h-1 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(scrollProgress * 100, 5)}%`,
            background: "linear-gradient(90deg, #B5622A, #E07040)",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
        className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-400"
      >
        <span>Swipe to explore</span>
        <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
      </motion.div>
      <style jsx global>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

/* ============================= */
/* MAIN COMPONENT                */
/* ============================= */
export default function SeasonalOffers() {
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  const { content: cms } = useSiteContent("seasonal_banner");

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
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?homepageSection=Seasonal&limit=8");
        const data = await res.json();
        if (data.products && data.products.length > 0) {
          const items = data.products.map((p) => {
            const isVideo = p.image?.endsWith(".mp4");
            return {
              ...p,
              type: isVideo ? "video" : "image",
              src: p.image,
              label: p.category, 
            };
          });
          setMediaItems(items.map((item, i) => ({
            ...item,
            top: i < 4 ? 10 + Math.random() * 15 : 70 + Math.random() * 15,
            left: (i % 4) * 25 + Math.random() * 5,
            size: 220 + Math.random() * 60,
            rotate: -8 + Math.random() * 16,
          })));
        } else {
          // Fallback if no db products
          const backupItems = SEASONAL_OFFERS_FALLBACK;
          setMediaItems(backupItems.map((item, i) => ({
            ...item,
            top: i < 4 ? 10 + Math.random() * 15 : 70 + Math.random() * 15,
            left: (i % 4) * 25 + Math.random() * 5,
            size: 220 + Math.random() * 60,
            rotate: -8 + Math.random() * 16,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch seasonal products", err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="relative md:pt-14 pb-10 md:pb-10 px-0 md:px-6 bg-transparent min-h-[95vh] md:min-h-[100vh] flex justify-center overflow-visible">      {/* Desktop: Floating Products — entrance animation only, NO constant bob */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              whileInView={{ opacity: 0.9, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.08, zIndex: 50, opacity: 1 }}
              style={{ top: `${item.top}%`, left: `${item.left}%`, width: item.size, rotate: `${item.rotate}deg` }}
              className="absolute pointer-events-auto cursor-pointer rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500"
              onClick={() => router.push(`/product/${item._id || item.id}`)}
            >
              {item.type === "image" ? (
                <img src={item.src} className="w-full aspect-[4/5] object-cover" alt="Product" />
              ) : (
                <video src={item.src} autoPlay loop muted playsInline className="w-full aspect-[4/5] object-cover" />
              )}
              <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                  <Sparkles className="w-5 h-5" style={{ color: "#E07040" }} />
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl bg-white/50 backdrop-blur-xl p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-black/5 mb-6 md:mb-8 mx-4 md:mx-0 text-center"
          >
            <h2 className="text-2xl md:text-4xl font-serif mb-2 md:mb-3 leading-tight" style={{ color: "#2D2D2D" }}>
              {cms?.title ? (
                <span dangerouslySetInnerHTML={{ __html: cms.title.replace("Seasonal", `<span class="italic" style="background: linear-gradient(135deg, #FF9E80, #E8603C); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Seasonal</span>`) }} />
              ) : (
                <>
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
                </>
              )}
            </h2>
            <p className="text-xs md:text-base mb-4 md:mb-6" style={{ color: "#8A8A8A" }}>
              {cms?.subtitle || (isMobile ? "Scroll to explore our collection" : "Click any piece to explore the details")}
            </p>
            <Link href={cms?.buttonLink || "/seasonal-edit"} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-full px-6 md:px-8 py-4 md:py-5 text-sm md:text-base w-full sm:w-auto border-0"
                style={{ background: "#2D2D2D", color: "white" }}
              >
                {cms?.buttonText || "Explore All"}
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </motion.div>

          {isMobile && (
            <div className="w-full overflow-x-hidden">
              <HorizontalScroll items={mediaItems} onItemClick={(item) => router.push(`/product/${item._id || item.id}`)} />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Countdown — entrance animation only */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 bg-white/50 backdrop-blur-xl px-6 lg:px-8 py-4 lg:py-6 rounded-[2rem] shadow-2xl text-center"
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
      </AnimatePresence>
    </section>
  );
}