"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full mb-8 sm:mb-12 overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#121212] min-h-[400px] flex items-center">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B8860B]/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4A3728]/30 blur-[100px] rounded-full" />
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            </div>

            <div className="container mx-auto px-8 sm:px-16 py-20 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-8 h-px bg-[#B8860B]" />
                        <span className="text-[#B8860B] text-xs font-bold uppercase tracking-[0.4em]">Established 1995</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]" style={{ fontFamily: "var(--font-playfair)" }}>
                        The Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] via-[#E6BE8A] to-[#B8860B]">Timeless</span> Luxury
                    </h1>
                    
                    <p className="text-gray-400 text-base sm:text-lg max-w-md mb-10 leading-relaxed font-light">
                        Discover our curated collection of handcrafted masterpieces, where tradition meets contemporary elegance.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 bg-[#B8860B] text-white rounded-full font-bold text-sm hover:bg-[#9a7009] transition-all flex items-center gap-2 group shadow-xl shadow-[#B8860B]/20">
                            Explore New Arrivals
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-sm hover:bg-white/10 transition-all backdrop-blur-md">
                            View Lookbook
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="hidden lg:block relative"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 aspect-square max-w-[450px] ml-auto">
                        <img 
                            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
                            alt="Luxury Jewellery"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-[#B8860B]">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <span className="text-white font-bold text-sm tracking-wide">Signature Collection</span>
                            </div>
                            <p className="text-gray-300 text-xs leading-relaxed">
                                Inspired by the brilliance of the morning sun, our Signature Collection represents the pinnacle of craftsmanship.
                            </p>
                        </div>
                    </div>
                    
                    {/* Floating Decorative Card */}
                    <div className="absolute -top-10 -left-10 p-6 bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-20 hidden xl:block">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#121212] bg-gray-800 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-1">Loved by 2k+ Customers</p>
                        <div className="flex text-amber-500 gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Star({ size, fill, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
