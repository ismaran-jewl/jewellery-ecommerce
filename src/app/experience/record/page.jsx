"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ChevronLeft, Save, Trash2, StopCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);

  // Simple timer logic for the recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsFinished(true);
    } else {
      setIsFinished(false);
      setTimer(0);
      setIsRecording(true);
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsFinished(false);
    setTimer(0);
  };

  return (
    <main className="min-h-screen bg-[#FFDAB9] p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      {/* Background Decorative Motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-[#F5FFFA] rounded-full blur-[100px] opacity-50"
        />
      </div>

      <Link href="/" className="absolute top-10 left-6 md:left-10 flex items-center gap-2 text-[#2D5A40] font-bold z-20 group">
        <motion.div whileHover={{ x: -5 }}>
          <ChevronLeft />
        </motion.div> 
        <span>Back to Experience</span>
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-[#F5FFFA]/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 text-center shadow-2xl border border-white z-10"
      >
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2D5A40] mb-4">
            Voice <span className="italic">Studio</span>
          </h1>
          <p className="text-[#4A6355] text-lg">
            {isFinished ? "Message captured perfectly." : "Speak from the heart. Your voice is eternal."}
          </p>
        </header>

        {/* Visualizer Section */}
        <div className="h-32 flex items-end justify-center gap-1.5 mb-6">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={isRecording ? { 
                height: [15, Math.random() * 80 + 20, 15],
                backgroundColor: ["#B2D3C2", "#2D5A40", "#B2D3C2"]
              } : { 
                height: 10,
                backgroundColor: "#D1E7DD"
              }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.03 }}
              className="w-2.5 rounded-full"
            />
          ))}
        </div>

        <div className="text-2xl font-mono text-[#2D5A40] mb-10 tabular-nums">
          {formatTime(timer)}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.2 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />
              )}
            </AnimatePresence>
            
            <motion.button 
              onClick={handleToggleRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-colors duration-500 ${
                isRecording ? "bg-red-600" : "bg-[#2D5A40]"
              }`}
            >
              {isRecording ? <StopCircle size={44} /> : isFinished ? <CheckCircle2 size={44} /> : <Mic size={44} />}
            </motion.button>
          </div>
          
          <motion.div 
            initial={false}
            animate={{ opacity: isFinished || isRecording ? 1 : 0.3, y: isFinished || isRecording ? 0 : 10 }}
            className="flex gap-4 w-full max-w-xs"
          >
            <Button 
              onClick={handleReset}
              disabled={!isFinished && !isRecording}
              variant="outline" 
              className="flex-1 rounded-2xl py-7 border-[#2D5A40] text-[#2D5A40] hover:bg-red-50 hover:text-red-600 transition-all font-bold"
            >
              <Trash2 className="mr-2" size={20} /> Reset
            </Button>
            
            <Button 
              disabled={!isFinished}
              className="flex-1 rounded-2xl py-7 bg-[#2D5A40] text-white hover:bg-[#1A3626] shadow-lg shadow-[#2D5A40]/20 font-bold"
            >
              <Save className="mr-2" size={20} /> Save
            </Button>
          </motion.div>
        </div>
        
        <p className="mt-12 text-xs text-[#4A6355]/60 uppercase tracking-[0.2em] font-bold">
          Encrypted Secure Session
        </p>
      </motion.div>
    </main>
  );
}