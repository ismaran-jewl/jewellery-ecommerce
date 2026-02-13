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
    }, 6000);
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
      scale: 1.1,
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
      x: direction < 0 ? "50%" : "-50%",
      opacity: 0,
      transition: { ...transitionSettings, opacity: { duration: 0.6 } },
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

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative z-20 text-center px-6 text-white max-w-3xl mx-auto"
      >
        {/* Tagline */}
        <span className="block mb-6 uppercase tracking-[0.5em] text-[11px] md:text-xs text-white/60 font-light">
          Exquisite Craftsmanship
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-serif font-medium leading-tight mb-6">
          Memories Moulded <br className="hidden md:block" />
          <span className="italic text-[#E6C27A]">In Jewel</span>
        </h1>

        {/* Description */}
        <p className="text-sm md:text-base max-w-2xl mx-auto text-white/75 mb-10 font-light leading-relaxed">
          Discover fine jewellery crafted for weddings, milestones,
          and moments that deserve to shine forever.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center items-center">
          {/* Primary Button */}
          <button className="px-10 py-3 rounded-full bg-[#C59D5F] text-black text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#b88c4d] transition-all duration-500 shadow-lg shadow-[#C59D5F]/30">
            Shop Now
          </button>

          {/* Secondary Button */}
          <button className="text-[11px] tracking-[0.35em] uppercase text-white/80 hover:text-[#E6C27A] transition-all duration-500 relative group">
            Our Story
            <span className="absolute left-0 -bottom-1 h-px w-full bg-white/30 group-hover:bg-[#E6C27A] transition-all duration-500" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
