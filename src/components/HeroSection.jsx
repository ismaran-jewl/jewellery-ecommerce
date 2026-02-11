"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { type: "video", src: "/videos/hero.mp4" },
  { type: "video", src: "/videos/pero.mp4" },
  { type: "video", src: "/videos/3.mp4" },
  { type: "image", src: "/images/hero.jpg" },
];

// Premium Bezier Curve for Luxury feel
const transitionSettings = {
  duration: 1.5,
  ease: [0.76, 0, 0.24, 1], 
};

export default function HeroSection() {
  const [[current, direction], setCurrent] = useState([0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 6000); // Slightly longer for a luxury feel
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
      scale: 1.1, // Slight zoom-in effect on entry
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "50%" : "-50%", // Parallax effect: moves slower than the incoming slide
      opacity: 0,
      transition: { ...transitionSettings, opacity: { duration: 0.6 } }
    }),
  };

  return (
    <section className="relative h-[0.1vh] md:h-[55vh] flex items-center justify-center overflow-hidden bg-black">
      
      {/* SLIDER BACKGROUND */}
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

      {/* NAVIGATION CONTROLS */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-6 z-30 p-3 rounded-full border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-500"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-6 z-30 p-3 rounded-full border border-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-500"
      >
        <ChevronRight size={20} />
      </button>

      {/* CONTENT (Wrapped in motion for a subtle fade-in) */}
      <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.8 }}
  className="relative z-20 text-center px-6 text-white"
>
        <span className="inline-block mb-4 uppercase tracking-[0.4em] text-[10px] md:text-xs text-white/70">
          Exquisite Craftsmanship
        </span>

        <h1 className="text-4xl md:text-6xl font-serif italic mb-6 drop-shadow-2xl">
          Memories Moulded In Jewel
        </h1>

        <p className="text-sm md:text-base max-w-xl mx-auto text-white/80 italic mb-8 font-light">
          Discover fine jewellery crafted for weddings, milestones, and everyday elegance.
        </p>

        <div className="flex gap-8 justify-center items-center">
          <button className="px-10 py-3.5 rounded-full border border-[#C59D5F] text-[10px] tracking-[0.3em] uppercase hover:bg-[#C59D5F] hover:text-white transition-all duration-500">
            Shop Now
          </button>

          <button className="text-[10px] tracking-[0.4em] uppercase relative group">
            Our Story
            <span className="absolute left-0 -bottom-1 h-px w-0 bg-[#C59D5F] transition-all duration-500 group-hover:w-full" />
          </button>
        </div>
      </motion.div>

      {/* Bottom fade */}
      
    </section>
  );
}