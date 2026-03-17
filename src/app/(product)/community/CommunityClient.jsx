"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Instagram, Camera } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stories = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop",
    name: "Sarah & James",
    text: `"We'll never forget the day he proposed."`
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    name: "The Graduation",
    text: `"A gift from my parents to celebrate a new chapter."`
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
    name: "Anniversary",
    text: `"Ten years of love, captured in one timeless piece."`
  },
];

export default function CommunityClient() {
  return (
    <div className="relative pb-24">
      <div className="container mx-auto px-6 py-12 md:py-20 max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back Home</span>
          </Link>
        </motion.div>

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 mb-8"
          >
            <Instagram size={14} className="text-[#B8860B]" />
            <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-[0.3em]">Ismaran Community</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Story, <span className="italic relative" style={{ color: "#B8860B" }}>Our Legacy</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 font-light leading-relaxed mb-8"
          >
            More than just jewellery, each piece is a silent storyteller.
          </motion.p>
          
          <Button
              className="group h-14 px-10 rounded-full text-sm tracking-[0.15em] uppercase font-bold transition-all border-0 mx-auto block"
              style={{
                background: "linear-gradient(135deg, #FFD4C2, #FF9E80)",
                color: "#2D2D2D",
              }}
            >
              <Camera className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform inline-block" />
              Submit Your Memory
            </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stories.map((story, idx) => (
             <motion.div
               key={story.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1 + (idx * 0.1) }}
               className="w-full aspect-[3/4] p-2 shadow-xl rounded-lg z-10 hover:z-30 transition-all duration-500 group"
               style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.95)" }}
             >
               <div className="relative w-full h-full overflow-hidden bg-neutral-100 rounded-md">
                 <img src={story.img} alt={story.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end text-left p-4">
                   <p className="font-serif text-lg mb-1 italic text-white">{story.name}</p>
                   <p className="text-white/90 text-xs font-light leading-snug">{story.text}</p>
                 </div>
               </div>
             </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
