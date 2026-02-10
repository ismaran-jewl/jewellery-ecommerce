"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        className="relative z-10 text-center px-6"
      >
        <span className="text-white/80 uppercase tracking-[0.4em] text-xs md:text-sm mb-4 block font-medium">
          Exquisite Craftsmanship
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 italic leading-tight drop-shadow-md">
          Celebrate Every Moment
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light italic">
          "Discover fine jewellery crafted for weddings, milestones, and everyday elegance."
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-[#C59D5F] hover:bg-[#A6844F] text-white px-10 py-7 rounded-none transition-all duration-300 tracking-widest text-xs"
          >
            SHOP NOW
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-black px-10 py-7 rounded-none transition-all duration-300 tracking-widest text-xs"
          >
            OUR STORY
          </Button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FAF9F6] to-transparent" />
    </section>
  );
}
