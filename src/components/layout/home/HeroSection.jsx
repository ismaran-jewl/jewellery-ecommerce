"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Standard shadcn component
import { cn } from "@/lib/utils";
import Link from "next/link";
const slides = [
  { type: "video", src: "/videos/hero.mp4" },
  { type: "video", src: "/videos/pero.mp4" },
  { type: "video", src: "/videos/3.mp4" },
  { type: "image", src: "/images/hero.jpg" },
];

const transitionSettings = {
  duration: 1.2,
  ease: [0.76, 0, 0.24, 1],
};

export default function HeroSection() {
  // Array state: [currentIndex, direction]
  const [[current, direction], setCurrent] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 6000);
    return () => clearInterval(interval);
  }, [current]);

  const paginate = (newDirection) => {
    let nextIndex = current + newDirection;
    if (nextIndex < 0) nextIndex = slides.length - 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    setCurrent([nextIndex, newDirection]);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "30%" : "-30%",
      opacity: 0,
      transition: { ...transitionSettings, opacity: { duration: 0.4 } },
    }),
  };

  return (
    <section className="relative h-[80svh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-black">

      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionSettings}
            className="absolute inset-0 w-full h-full"
          >
            {/* Dark Overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {slides[current].type === "video" ? (
              <video
                className="w-full h-full object-cover"
                src={slides[current].src}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={slides[current].src}
                alt="Luxury Jewellery"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVIGATION - Hidden on mobile, visible on tablet/desktop */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-6 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(-1)}
          className="hidden md:flex h-12 w-12 rounded-full border-white/20 bg-black/10 text-white backdrop-blur-md hover:bg-white hover:text-black pointer-events-auto transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => paginate(1)}
          className="hidden md:flex h-12 w-12 rounded-full border-white/20 bg-black/10 text-white backdrop-blur-md hover:bg-white hover:text-black pointer-events-auto transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* CENTER CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 text-center px-6 text-white max-w-4xl"
      >
        <span className="block mb-4 uppercase tracking-[0.4em] text-[10px] md:text-xs text-white/70 font-light">
          Exquisite Craftsmanship
        </span>

        <h1 className="text-4xl md:text-7xl font-serif font-medium leading-[1.1] mb-6">
          Memories Moulded <br />
          <span className="italic text-[#E6C27A]">In Jewel</span>
        </h1>

        <p className="text-sm md:text-lg max-w-xl mx-auto text-white/80 mb-10 font-light leading-relaxed">
          Fine jewellery crafted for weddings, milestones,
          and moments that deserve to shine forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link href="/shop">
            <Button
              className="w-full sm:w-auto px-12 py-7 rounded-full bg-[#C59D5F] text-black hover:bg-[#b88c4d] text-[11px] tracking-[0.2em] uppercase font-bold shadow-xl shadow-black/20 transition-transform active:scale-95"
            >
              Shop Now
            </Button>
          </Link>

          <Button
            variant="link"
            className="text-white hover:text-[#E6C27A] uppercase tracking-[0.25em] text-[10px] md:text-[11px] decoration-white/30"
          >
            Our Story
          </Button>
        </div>
      </motion.div>

      {/* MOBILE-SPECIFIC PAGINATION DOTS */}
      <div className="absolute bottom-10 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent([index, index > current ? 1 : -1])}
            className={cn(
              "h-1.5 transition-all duration-500 rounded-full",
              current === index ? "w-10 bg-[#E6C27A]" : "w-3 bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}