"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCcw } from "lucide-react";

export default function EmptyState({ onClearAll }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm"
        >
            <div className="w-20 h-20 bg-[#F9F6F3] rounded-full flex items-center justify-center mb-8 relative">
                <Sparkles className="text-[#B8860B]" size={32} />
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-[#B8860B]/10 rounded-full"
                />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                No Match Found
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mb-10 leading-relaxed">
                We couldn't find any pieces matching your current filters. Try broadening your search or resetting the filters.
            </p>
            
            <button 
                onClick={onClearAll}
                className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-xl shadow-black/10 group"
            >
                <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                Reset All Filters
            </button>
        </motion.div>
    );
}
