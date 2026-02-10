"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Quote } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function ShareYourStory() {
  return (
    <section className="relative py-32 bg-[#1A1A1A] text-white overflow-hidden">
      {/* 1. LAYERED BACKGROUND EFFECTS */}
      {/* Animated Gold Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      {/* Dynamic Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C59D5F] opacity-[0.15] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#C59D5F] opacity-[0.05] blur-[100px] rounded-full" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="relative max-w-5xl mx-auto px-6 text-center"
      >
        {/* 2. ICON DESIGN */}
        <div className="relative inline-block mb-10">
          <Heart className="w-12 h-12 text-[#C59D5F] relative z-10" strokeWidth={1.2} />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[#C59D5F] rounded-full blur-xl"
          />
        </div>

        {/* 3. TYPOGRAPHY */}
        <h3 className="text-4xl md:text-6xl font-serif mb-8 tracking-tight italic">
          Every Piece <span className="text-[#C59D5F]">Tells a Story</span>
        </h3>

        <div className="relative max-w-2xl mx-auto">
          <Quote className="absolute -top-6 -left-8 w-12 h-12 text-[#C59D5F]/10 rotate-180" />
          <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed mb-12 italic">
            "From the nervous whisper of a proposal to the radiant glow of a wedding day, 
            Ismaran is honored to be part of your most cherished milestones."
          </p>
          <Quote className="absolute -bottom-10 -right-8 w-12 h-12 text-[#C59D5F]/10" />
        </div>

        {/* 4. PREMIUM BUTTON */}
        <div className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className="relative overflow-hidden bg-transparent border border-[#C59D5F] text-[#C59D5F] hover:text-black px-12 py-8 rounded-none tracking-[0.2em] text-[10px] md:text-xs group transition-all duration-500"
          >
            {/* Hover Slide Effect */}
            <span className="absolute inset-0 bg-[#C59D5F] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            
            <span className="relative z-10 flex items-center">
              SHARE YOUR MOMENT
              <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
            </span>
          </Button>
          
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
            Join our community of memories
          </p>
        </div>

        {/* 5. LUXURY DIVIDER */}
        <div className="mt-20 flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C59D5F]/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#C59D5F]/40 rotate-45" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C59D5F]/40" />
        </div>
      </motion.div>
    </section>
  );
}