"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export default function AdBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/50 group"
        >
            {/* Video Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out"
                >
                    <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
                
                {/* Advanced Glassmorphism Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/40 to-transparent z-10" />
                <div className="absolute inset-0 backdrop-blur-[3px] z-10" />
                
                {/* Subtle Light Rays */}
                <motion.div 
                    animate={{ 
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] bg-[radial-gradient(circle,rgba(184,134,11,0.15)_0%,transparent_70%)] z-15"
                />
            </div>

            <div className="relative z-20 w-full h-full p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="max-w-2xl text-center sm:text-left"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B8860B]/20 backdrop-blur-md border border-[#B8860B]/30 mb-8"
                    >
                        <Sparkles size={14} className="text-[#B8860B]" />
                        <span className="text-[10px] text-white font-bold uppercase tracking-[0.3em]">Season Premiere</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-[1.1]" 
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Royal <span className="italic text-[#E6BE8A]">Heirloom</span> <br/>
                        <span className="text-3xl sm:text-5xl font-light opacity-90">Collection 2026</span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-stone-300 text-lg font-light mb-10 max-w-md leading-relaxed"
                    >
                        Discover pieces that transcend time. Hand-crafted with ethically sourced diamonds and 24K gold.
                    </motion.p>

                    <Link href="/seasonal-edit">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#D4AF37" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-[#B8860B] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-4 group shadow-xl shadow-black/40"
                        >
                            Explore the Edit
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Featured Product Floating Card */}
                <div className="relative hidden md:block w-[280px] h-[350px]">
                    <motion.div 
                        animate={{ 
                            y: [0, -15, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/20 shadow-[-20px_20px_50px_rgba(0,0,0,0.5)] bg-white/5 backdrop-blur-2xl p-4"
                    >
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-stone-100 relative group/img">
                            <img
                                src="/images/product1.jpg"
                                alt="Promotion"
                                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 group-hover/img:scale-110 group-hover/img:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                    
                    {/* Floating Badge */}
                    <motion.div
                        animate={{ 
                            y: [0, 15, 0],
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#B8860B] text-white flex flex-col items-center justify-center text-center shadow-2xl border-4 border-black/20 z-30"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Save</span>
                        <span className="text-xl font-black">20%</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
