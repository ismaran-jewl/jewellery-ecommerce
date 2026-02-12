"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ChevronLeft, Smartphone, Radio, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConnectionPage() {
  const [status, setStatus] = useState("searching"); // searching, connecting, success

  useEffect(() => {
    if (status === "searching") {
      const timer = setTimeout(() => setStatus("connecting"), 3000);
      return () => clearTimeout(timer);
    }
    if (status === "connecting") {
      const timer = setTimeout(() => setStatus("success"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <main className="min-h-screen bg-[#FFDAB9] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Motion Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [-50, 50, -50] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-[#F5FFFA] rounded-full blur-[120px] opacity-40"
        />
      </div>

      <Link href="/" className="absolute top-10 left-6 flex items-center gap-2 text-[#2D5A40] font-bold z-50">
        <ChevronLeft size={20} />
        <span>Cancel Pairing</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-[#F5FFFA]/90 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white text-center"
      >
        {/* --- DYNAMIC VISUALIZER --- */}
        <div className="relative h-64 flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div 
                key="searching"
                exit={{ scale: 0, opacity: 0 }}
                className="relative"
              >
                {/* Radar Waves */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                    className="absolute inset-0 border-2 border-[#2D5A40] rounded-full"
                  />
                ))}
                <div className="relative z-10 w-32 h-32 bg-[#2D5A40] rounded-full flex items-center justify-center text-white shadow-xl">
                  <Smartphone size={48} className={status === "connecting" ? "animate-bounce" : ""} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-32 h-32 bg-[#4A8565] rounded-full flex items-center justify-center text-[#F5FFFA] shadow-2xl"
              >
                <CheckCircle2 size={64} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- TEXT CONTENT --- */}
        <div className="space-y-4 mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#2D5A40]">
            {status === "searching" && "Scanning for Jewelry..."}
            {status === "connecting" && "Establishing Secure Link..."}
            {status === "success" && "Connection Verified"}
          </h2>
          <p className="text-[#4A6355] leading-relaxed">
            {status === "searching" && "Bring your phone within 2cm of the jewelry box icon."}
            {status === "connecting" && "Syncing your unique digital signature..."}
            {status === "success" && "Your jewelry is now synced with your digital vault."}
          </p>
        </div>

        {/* --- FOOTER ICON STATUS --- */}
        <div className="flex justify-center gap-8 border-t border-[#2D5A40]/10 pt-8">
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-xl ${status === 'success' ? 'bg-[#2D5A40] text-white' : 'bg-[#2D5A40]/10 text-[#2D5A40]'}`}>
              <Radio size={20} className={status === "searching" ? "animate-pulse" : ""} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D5A40]">NFC Sync</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-xl ${status === 'success' ? 'bg-[#2D5A40] text-white' : 'bg-[#2D5A40]/10 text-[#2D5A40]'}`}>
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D5A40]">Encrypted</span>
          </div>
        </div>

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <Link href="/experience/record">
              <Button className="w-full bg-[#2D5A40] text-white py-8 rounded-2xl text-lg font-bold hover:bg-[#1A3626] transition-all">
                Proceed to Studio
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Manual Option */}
      <motion.button 
        whileHover={{ opacity: 1 }}
        className="mt-8 text-[#2D5A40]/60 text-sm font-medium underline underline-offset-4 opacity-70"
      >
        Can't find the tag? Use QR Code instead
      </motion.button>
    </main>
  );
}