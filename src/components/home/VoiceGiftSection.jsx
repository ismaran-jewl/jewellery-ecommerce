"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QrCode, Mic, Smartphone, Play, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AliveExperienceSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 250]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 bg-[#FFDAB9] overflow-hidden">
      
      {/* MOTION GRAPHIC: Dynamic Fluid Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <motion.div 
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-20 -left-10 w-[500px] h-[500px] bg-[#F5FFFA] rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#B2D3C2] rounded-full blur-[150px]" 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-[#2D5A40]/10 text-[#2D5A40] text-xs font-bold tracking-[0.3em] mb-6"
          >
            THE FUTURE OF EMOTION
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-[#2D5A40] mb-8 leading-tight">
            Experience <span className="text-white italic relative">Soul
              <motion.svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none">
                <motion.path 
                  initial={{ pathLength: 0 }} 
                  whileInView={{ pathLength: 1 }} 
                  transition={{ duration: 1, delay: 0.5 }}
                  d="M5 15Q150 5 295 15" stroke="#2D5A40" strokeWidth="4" strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <ExperienceCard 
            step="01"
            icon={<QrCode />}
            title="The Connection"
            description="Tap your phone to the jewelry box. A secure NFC link instantly bridges the physical and digital."
            action="Test Connection"
            href="/experience/connect"
          />
          <ExperienceCard 
            step="02"
            icon={<Mic />}
            title="The Message"
            description="Whisper a memory or a promise. Our studio encrypts your voice directly into the piece."
            action="Open Studio"
            href="/experience/record"
            isAudio
          />
          <ExperienceCard 
            step="03"
            icon={<Smartphone />}
            title="The Reveal"
            description="The moment of magic. Your voice greets them as they unveil their new treasure."
            action="Play Demo"
            href="/experience/reveal"
          />
        </div>

        {/* CTA Button with Page Link */}
        <motion.div className="mt-32 text-center">
          <Link href="/voice-gift/create">
            <Button className="group bg-[#2D5A40] text-[#F5FFFA] hover:bg-[#1A3626] px-16 py-8 text-2xl rounded-2xl shadow-2xl transition-all hover:scale-105">
              Start Your Story
              <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceCard({ step, icon, title, description, action, href, isAudio = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct * 20);
    y.set(yPct * -20);
  };

  return (
    <Link href={href}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
        style={{ rotateX: mouseYSpring, rotateY: mouseXSpring, transformStyle: "preserve-3d" }}
        className="relative h-[480px] cursor-pointer group"
      >
        <div className={`h-full w-full bg-[#F5FFFA]/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 p-10 flex flex-col justify-between transition-all duration-500 group-hover:bg-[#F5FFFA]/80 group-hover:border-[#2D5A40]/30 shadow-xl group-hover:shadow-[#2D5A40]/10`}>
          
          <div className="relative">
            <span className="text-[#2D5A40]/10 font-black text-7xl font-serif absolute -top-4 -left-2 tracking-tighter group-hover:text-[#2D5A40]/20 transition-colors">
              {step}
            </span>
            <div className="relative z-10 w-16 h-16 bg-[#2D5A40] text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
              {React.cloneElement(icon, { size: 32 })}
            </div>
            <h3 className="text-3xl font-bold text-[#2D5A40] mb-4 font-serif">{title}</h3>
            <p className="text-[#4A6355] leading-relaxed text-lg">{description}</p>
          </div>

          <div className="h-16 flex items-center justify-between">
            <AnimatePresence>
              {isHovered && isAudio && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [4, 20, 4] }} 
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} 
                      className="w-1 bg-[#2D5A40] rounded-full" 
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2 text-[#2D5A40] font-black uppercase text-xs tracking-[0.2em]">
              {action} <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}