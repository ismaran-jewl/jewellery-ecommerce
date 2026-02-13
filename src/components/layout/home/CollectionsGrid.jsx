"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const collections = [
  { 
    name: "The Bridal Suite", 
    desc: "Timeless pieces for your big day", 
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-2 h-[600px]" 
  },
  { 
    name: "Modern Minimalist", 
    desc: "Everyday luxury for the office", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-1 h-[600px]" 
  },
  { 
    name: "Royal Heritage", 
    desc: "Inspired by ancient craftsmanship", 
    image: "https://i.pinimg.com/736x/28/26/f3/2826f32d2e67a1baf351356d800fd049.jpg",
    size: "md:col-span-3 h-[500px]" 
  },
];

export default function CollectionsGrid() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="relative py-32 bg-[#FFDAB9] overflow-hidden">
      
      {/* --- MOTION GRAPHIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        {/* Floating Gradient Liquid Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#F5FFFA] rounded-full blur-[120px] opacity-40"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, 100, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#4A8565]/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* --- HEADER WITH STAGGERED TEXT --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[#2D5A40] font-bold tracking-[0.4em] uppercase text-xs block mb-4"
            >
              Exquisite Craftsmanship
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif text-[#2D5A40] leading-tight"
            >
              Curated <span className="italic font-light">Collections</span>
            </motion.h3>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#4A6355] text-lg max-w-xs border-l border-[#2D5A40]/20 pl-6 mb-2"
          >
            Handpicked treasures designed to resonate with your unique story.
          </motion.p>
        </div>

        {/* --- BENTO GRID COLLECTIONS --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`relative ${collection.size} overflow-hidden group rounded-[2rem] shadow-2xl shadow-[#2D5A40]/5`}
            >
              {/* Image with Parallax effect */}
              <motion.img
                style={{ y: backgroundY }}
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D5A40]/90 via-[#2D5A40]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content Reveal */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-20"
                >
                  <h4 className="text-3xl md:text-4xl font-serif text-[#F5FFFA] mb-3 group-hover:translate-x-2 transition-transform duration-500">
                    {collection.name}
                  </h4>
                  <p className="text-[#F5FFFA]/80 text-lg mb-8 max-w-sm transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {collection.desc}
                  </p>
                  
                  <Button className="bg-[#F5FFFA] text-[#2D5A40] hover:bg-[#FFDAB9] rounded-full px-8 py-6 flex items-center gap-2 group/btn transition-all">
                    Explore Gallery
                    <ArrowUpRight size={18} className="group-hover/btn:rotate-45 transition-transform" />
                  </Button>
                </motion.div>
              </div>

              {/* Decorative Border on Hover */}
              <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}