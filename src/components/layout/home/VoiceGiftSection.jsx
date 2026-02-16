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
    <section ref={containerRef} className="relative py-32 px-6 bg-[#FAFAFA] overflow-hidden">
      
      {/* MOTION GRAPHIC: Dynamic Fluid Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <motion.div 
          style={{ y: y1 }}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ x: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-[#FFF3E0] to-[#FFE0B2] rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-neutral-200 shadow-sm text-[#2D5A40] text-[11px] font-bold tracking-[0.3em] uppercase mb-8"
          >
            <Sparkles size={14} className="text-[#C59D5F]" />
            THE FUTURE OF EMOTION
          </motion.div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#1A1A1A] mb-8 leading-[0.95] tracking-tight">
            Experience <span className="text-[#2D5A40] italic relative inline-block">Soul
              <motion.svg className="absolute -bottom-3 left-0 w-full h-6" viewBox="0 0 200 20" fill="none">
                <motion.path 
                  initial={{ pathLength: 0, opacity: 0 }} 
                  whileInView={{ pathLength: 1, opacity: 1 }} 
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                  d="M5 15 Q 100 5 195 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-600 text-lg md:text-xl font-light leading-relaxed">
             Jewellery that speaks. A fusion of timeless craftsmanship and digital memory, creating a bond that lasts forever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ExperienceCard 
            step="01"
            icon={<QrCode />}
            title="The Connection"
            description="Tap your phone to the jewelry box. A secure NFC link instantly bridges the physical and digital."
            action="Test Connection"
            href="/experience/connect"
            delay={0}
          />
          <ExperienceCard 
            step="02"
            icon={<Mic />}
            title="The Message"
            description="Whisper a memory or a promise. Our studio encrypts your voice directly into the piece."
            action="Open Studio"
            href="/experience/record"
            isAudio
            delay={0.1}
          />
          <ExperienceCard 
            step="03"
            icon={<Smartphone />}
            title="The Reveal"
            description="The moment of magic. Your voice greets them as they unveil their new treasure."
            action="Play Demo"
            href="/experience/reveal"
            delay={0.2}
          />
        </div>

        {/* CTA Button with Page Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/voice-gift/create">
            <Button className="group bg-[#2D5A40] text-white hover:bg-[#1e3d2b] px-10 py-8 text-lg rounded-full shadow-xl shadow-[#2D5A40]/20 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#2D5A40]/30">
              Start Your Story
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceCard({ step, icon, title, description, action, href, isAudio = false, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct * 10);
    y.set(yPct * -10);
  };

  return (
    <Link href={href} className="block group h-full">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); x.set(0); y.set(0); }}
        style={{ rotateX: mouseYSpring, rotateY: mouseXSpring, transformStyle: "preserve-3d" }}
        className="relative h-full min-h-[420px] cursor-pointer"
      >
        <div className="h-full w-full bg-white rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_60px_-15px_rgba(45,90,64,0.15)] group-hover:-translate-y-2 border border-transparent group-hover:border-[#2D5A40]/10">
          
          <div>
            <div className="flex justify-between items-start mb-8">
               <div className="w-14 h-14 bg-[#F5F5F5] text-[#2D5A40] rounded-2xl flex items-center justify-center group-hover:bg-[#2D5A40] group-hover:text-white transition-colors duration-500">
                  {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 })}
               </div>
               <span className="text-neutral-200 font-serif text-5xl font-bold group-hover:text-[#2D5A40]/10 transition-colors duration-500">
                 {step}
               </span>
            </div>
            
            <h3 className="text-2xl font-serif text-[#1a1a1a] mb-3 group-hover:text-[#2D5A40] transition-colors">{title}</h3>
            <p className="text-neutral-500 leading-relaxed text-sm md:text-base">{description}</p>
          </div>

          <div className="pt-8 border-t border-neutral-100 mt-8 flex items-center justify-between group-hover:border-[#2D5A40]/10 transition-colors">
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
            <div className="ml-auto flex items-center gap-2 text-[#2D5A40] font-bold uppercase text-xs tracking-[0.2em]">
              {action} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}