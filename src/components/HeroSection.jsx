"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Video background (unchanged) */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=1600"
        />
        {/* Layered luxury overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Decorative accents */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[70%] h-px bg-gradient-to-r from-transparent via-[#C59D5F]/70 to-transparent" />
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative z-10 text-center px-6"
      >
        <span className="inline-block mb-6 text-white/80 uppercase tracking-[0.45em] text-[11px] md:text-sm font-medium relative">
          Exquisite Craftsmanship
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-px bg-[#C59D5F]" />
        </span>

        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 italic leading-tight drop-shadow-lg">
          Memory Moulded In Jewel
        </h1>

        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light italic leading-relaxed">
          “Discover fine jewellery crafted for weddings, milestones, and everyday elegance.”
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-4">
          {/* Primary CTA – Luxury capsule button */}
          <button
            className="group relative px-14 py-6 rounded-full border border-[#C59D5F]/60 text-white text-[11px] tracking-[0.35em] uppercase overflow-hidden transition-all duration-500 hover:border-[#C59D5F]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Shop Now
              <span className="inline-block w-6 h-px bg-[#C59D5F] transition-all duration-500 group-hover:w-10" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#C59D5F]/10 via-[#C59D5F]/30 to-[#C59D5F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>

          {/* Secondary CTA – Minimal underline link */}
          <button
            className="group relative text-white/90 text-[11px] tracking-[0.4em] uppercase pb-2"
          >
            Our Story
            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-500 group-hover:w-full" />
          </button>
        </div>
      </motion.div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10" />
    </section>
  );
}
