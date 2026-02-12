"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, Heart, Share2, Volume2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RevealPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="min-h-screen bg-[#FFDAB9] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Motion Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F5FFFA] rounded-full blur-[120px] opacity-60"
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#B2D3C2] rounded-full blur-[100px] opacity-40"
        />
      </div>

      <Link href="/" className="absolute top-10 left-6 flex items-center gap-2 text-[#2D5A40] font-bold z-50">
        <ChevronLeft size={20} />
        <span>Exit Reveal</span>
      </Link>

      <AnimatePresence mode="wait">
        {!hasOpened ? (
          /* --- STEP 1: THE UNBOXING --- */
          <motion.div
            key="unbox"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-12"
            >
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-white rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-[#2D5A40] rounded-3xl shadow-2xl flex items-center justify-center">
                   <Sparkles className="text-[#FFDAB9] w-20 h-20 animate-pulse" />
                </div>
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D5A40] mb-6">
              A Message is Waiting
            </h1>
            <p className="text-[#4A6355] mb-10 max-w-sm mx-auto text-lg leading-relaxed">
              Someone has left a piece of their soul in this gift for you.
            </p>
            
            <Button 
              onClick={() => setHasOpened(true)}
              className="bg-[#2D5A40] text-white px-12 py-8 text-xl rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              Open Your Gift
            </Button>
          </motion.div>
        ) : (
          /* --- STEP 2: THE REVEAL & PLAYER --- */
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-lg bg-[#F5FFFA]/90 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white text-center"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="w-20 h-20 bg-[#FFDAB9] rounded-full flex items-center justify-center mx-auto mb-8 text-[#2D5A40]"
            >
              <Heart fill="currentColor" size={32} />
            </motion.div>

            <h2 className="text-3xl font-serif font-bold text-[#2D5A40] mb-2">From Alex, with love</h2>
            <p className="text-[#4A6355] text-sm uppercase tracking-[0.2em] mb-10">Recorded Feb 12, 2026</p>

            {/* Interactive Audio Player */}
            <div className="bg-white/50 rounded-3xl p-8 mb-8 border border-[#2D5A40]/5">
              <div className="flex items-center justify-center gap-1 h-16 mb-8">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { 
                      height: [10, Math.random() * 50 + 10, 10],
                    } : { height: 10 }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                    className="w-2 bg-[#2D5A40] rounded-full"
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-20 h-20 bg-[#2D5A40] rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </motion.button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[#2D5A40]">
              <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Share2 size={18} /> <span className="text-xs font-bold uppercase">Save Memory</span>
              </button>
              <div className="flex items-center gap-1 opacity-40">
                <Volume2 size={18} />
                <span className="text-xs font-bold tracking-tighter">HD AUDIO</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 pt-8 border-t border-[#2D5A40]/10"
            >
              <p className="text-[#4A6355] italic font-serif text-lg">
                "Keep this close to your heart, always."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}