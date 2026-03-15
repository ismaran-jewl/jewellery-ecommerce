"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export default function AdBanner() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative col-span-2 lg:col-span-full h-[250px] sm:h-[300px] rounded-[2rem] overflow-hidden bg-[#121212] flex items-center shadow-2xl shadow-black/10"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-[#B8860B]/20 blur-[100px] rounded-full rotate-45" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[120%] bg-[#4A3728]/30 blur-[80px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            </div>

            <div className="relative z-10 w-full px-8 sm:px-16 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="max-w-md text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <Sparkles size={12} className="text-[#B8860B]" />
                        <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-widest">Limited Edition</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                        The Royal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#E6BE8A]">Solitaire</span> Collection
                    </h2>
                    
                    <p className="text-gray-400 text-sm font-light mb-6">
                        Exquisite craftsmanship meeting timeless beauty. Get 15% off on your first bridal purchase.
                    </p>

                    <button className="px-6 py-3 bg-[#B8860B] text-white rounded-full font-bold text-xs hover:bg-[#9a7009] transition-all flex items-center gap-2 group mx-auto sm:mx-0">
                        Shop Collection
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="relative hidden md:block w-[200px] h-[200px] lg:w-[250px] lg:h-[250px]">
                    <div className="absolute inset-0 rounded-full border border-[#B8860B]/30 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="absolute inset-2 rounded-full overflow-hidden shadow-2xl border-4 border-[#121212]">
                        <img 
                            src={getImageUrl("https://drive.google.com/file/d/1cnliPXRXGTdt458rDrgOvL-yftZJ3U-C/view?usp=drivesdk")} 
                            alt="Promotion"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
