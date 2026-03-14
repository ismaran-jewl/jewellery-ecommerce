"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Heart, Scan, Play, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Heart,
    label: "You Choose & Personalise",
    title: "Record Your Heart",
    body: "At checkout, record a voice note, upload a video, or write a message. This becomes the digital soul of the piece — private, encrypted, yours forever.",
    accent: "#FF9E80",
    bg: "from-[#FFD4C2]/60 to-[#FFE8D6]/30",
    border: "border-[#FFB899]/40",
    iconBg: "bg-[#FFD4C2]",
  },
  {
    number: "02",
    icon: Wifi,
    label: "We Embed the Magic",
    title: "NFC Chip or Laser QR",
    body: "Our craftsmen embed a hidden NFC chip or laser-etch a micro QR code into every piece. Invisible to the eye. Unmissable to the heart.",
    accent: "#52B788",
    bg: "from-[#C8EDDA]/60 to-[#E0F5EA]/30",
    border: "border-[#95D5B2]/40",
    iconBg: "bg-[#B7E4C7]",
  },
  {
    number: "03",
    icon: Scan,
    label: "They Scan. They Feel.",
    title: "A Moment That Lasts Forever",
    body: "They hold the jewellery near their phone. Instantly — your face, your voice, your message plays. No app. No login. Just magic.",
    accent: "#FF9E80",
    bg: "from-[#FFD4C2]/60 to-[#FFE8D6]/30",
    border: "border-[#FFB899]/40",
    iconBg: "bg-[#FFD4C2]",
  },
];

// ─────────────────────────────────────────────
// NFC Pulse Rings
// ─────────────────────────────────────────────
function NFCPulse() {
  return (
    <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-8">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: "1.5px solid #FFAD8E" }}
          initial={{ width: 44, height: 44, opacity: 0.9 }}
          animate={{ width: 112, height: 112, opacity: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.85, ease: "easeOut" }}
        />
      ))}
      <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#FFD4C2] to-[#FFEADC] border border-[#FFB899]/60 flex items-center justify-center shadow-lg shadow-[#FFAD8E]/30">
        <Wifi size={22} className="text-[#E07040]" strokeWidth={1.5} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Interactive Phone Demo
// ─────────────────────────────────────────────
function PhoneDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto w-[200px] sm:w-[230px]">
      <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-b from-[#FAF5F2]/60 via-[#FDFBF7]/40 to-[#FAF9F6]/30 blur-2xl" />

      <div className="relative bg-white/75 backdrop-blur-xl rounded-[2.8rem] border border-white/90 shadow-2xl shadow-[#FFB899]/25 overflow-hidden aspect-[9/19]">
        <div className="absolute top-0 left-0 right-0 h-10 bg-white/40 flex items-center justify-center">
          <div className="w-16 h-4 bg-black/10 rounded-full" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-10 pb-4">
          {!playing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="relative w-24 h-24 rounded-2xl border-2 border-[#95D5B2]/80 bg-[#E0F5EA]/50 flex items-center justify-center mb-2 overflow-hidden">
                <motion.div
                  className="absolute left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#52B788] to-transparent"
                  style={{ boxShadow: "0 0 8px #52B788" }}
                  animate={{ top: ["12%", "88%", "12%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                {["tl", "tr", "bl", "br"].map((c) => (
                  <div
                    key={c}
                    className={`absolute w-4 h-4 border-[#52B788] ${
                      c === "tl" ? "top-1.5 left-1.5 border-t-2 border-l-2 rounded-tl-lg" :
                      c === "tr" ? "top-1.5 right-1.5 border-t-2 border-r-2 rounded-tr-lg" :
                      c === "bl" ? "bottom-1.5 left-1.5 border-b-2 border-l-2 rounded-bl-lg" :
                                   "bottom-1.5 right-1.5 border-b-2 border-r-2 rounded-br-lg"
                    }`}
                  />
                ))}
                <Scan size={28} className="text-[#52B788]/40" strokeWidth={1} />
              </div>
              <p className="text-[#7A7A7A] text-[9px] font-sans tracking-widest uppercase">Hold near jewellery</p>
              <p className="text-[#AAAAAA] text-[8px] font-sans">NFC detected...</p>
              <button
                onClick={() => setPlaying(true)}
                className="mt-3 bg-gradient-to-r from-[#FFD4C2] to-[#FFAD8E] rounded-full px-5 py-2 text-[#8B3A1C] text-[10px] font-semibold font-sans tracking-wide shadow-md shadow-[#FFAD8E]/30 hover:shadow-[#FFAD8E]/50 transition-all"
              >
                Tap to preview ✦
              </button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                key="playing"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 text-center w-full"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFE8D6] to-[#C8EDDA] flex items-center justify-center shadow-inner">
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-[#FAF5F2]/60 to-[#F5F5F0]/60"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="relative z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <Play size={14} className="text-[#E07040] fill-[#E07040] ml-0.5" />
                  </motion.div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-end gap-[2px] h-5">
                    {[...Array(22)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-full bg-[#FF9E80]/60"
                        animate={{ height: [`${15 + Math.random() * 85}%`, `${15 + Math.random() * 85}%`] }}
                        transition={{ duration: 0.35 + Math.random() * 0.4, repeat: Infinity, repeatType: "reverse" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#555] text-[11px] font-serif italic leading-snug">"Happy Anniversary, my love..."</p>
                <p className="text-[#AAAAAA] text-[9px] font-sans tracking-wide">Stored forever · Plays instantly</p>
                <button
                  onClick={() => setPlaying(false)}
                  className="text-[#C8A89A] text-[9px] font-sans underline underline-offset-2"
                >
                  reset demo
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-gradient-to-r from-[#FFD4C2]/0 via-[#FFB899]/40 to-[#FFD4C2]/0 blur-xl rounded-full" />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Section Export
// ─────────────────────────────────────────────
export default function AliveExperienceSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-transparent">

      {/* MAIN CONTENT (z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-2.5 bg-white/70 backdrop-blur-md border border-[#FFD4C2]/80 text-[#C05A2E] text-[10px] font-sans font-bold tracking-[0.3em] uppercase px-6 py-2.5 rounded-full shadow-lg shadow-[#FFD4C2]/30">
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#FF9E80] inline-block"
            />
            World&apos;s First · Memory-Linked Jewellery
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="w-1.5 h-1.5 rounded-full bg-[#52B788] inline-block"
            />
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-6 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-8xl leading-[0.92] tracking-tight"
            style={{ color: "#2D2D2D" }}
          >
            JEWELLERY That
            <br />
            <span
              className="italic font-light"
              style={{
                background: "linear-gradient(135deg, #FF9E80 0%, #E8603C 40%, #FF9E80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Speaks.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-7 font-sans text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            No one in the market does this. Every piece we craft carries a hidden{" "}
            <span className="font-semibold" style={{ color: "#52B788" }}>
              NFC chip or laser-etched QR code
            </span>{" "}
            — scan it and your personal voice, video, or message plays instantly. Forever.
          </motion.p>
        </div>

        {/* Steps + Phone grid */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* LEFT — Steps */}
          <div className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group relative flex gap-5 p-5 md:p-6 rounded-3xl bg-transparent"
                style={{
                  boxShadow: "0 4px 30px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
                  transition: "all 0.4s ease",
                }}
              >
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl ${step.iconBg} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 6px 20px ${step.accent}30` }}
                  >
                    <step.icon size={20} strokeWidth={1.8} style={{ color: step.accent }} />
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-px flex-1 min-h-[1.8rem] rounded-full"
                      style={{ background: `linear-gradient(to bottom, ${step.accent}50, transparent)` }}
                    />
                  )}
                </div>

                <div className="pt-1 flex-1">
                  <span
                    className="font-sans text-[9px] tracking-[0.3em] uppercase mb-1 block font-semibold"
                    style={{ color: step.accent }}
                  >
                    {step.label}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl mb-2" style={{ color: "#2D2D2D" }}>
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: "#7A8A82" }}>
                    {step.body}
                  </p>
                </div>

                {/* Step number watermark */}
                <span
                  className="absolute top-4 right-5 font-serif text-6xl font-bold select-none pointer-events-none"
                  style={{ color: `${step.accent}12` }}
                >
                  {step.number}
                </span>

                {/* Hover glow ring */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ boxShadow: `0 8px 40px ${step.accent}25`, transition: "opacity 0.5s ease" }}
                />
              </motion.div>
            ))}
          </div>

          {/* RIGHT — Phone demo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <NFCPulse />
            <PhoneDemo />
            <p
              className="mt-8 font-sans text-xs tracking-widest uppercase text-center"
              style={{ color: "#BBBBBB" }}
            >
              Tap &quot;preview&quot; to experience the magic
            </p>
          </motion.div>
        </div>

        {/* Proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-20 md:mt-28 grid grid-cols-3 gap-4 rounded-3xl bg-white/60 backdrop-blur-md border border-[#FFD4C2]/50 px-6 py-8 shadow-lg shadow-[#FFD4C2]/20"
        >
          {[
            { stat: "∞",   label: "Memory lives forever",   color: "#FF9E80" },
            { stat: "0",   label: "Apps required",           color: "#52B788" },
            { stat: "1st", label: "In the world to do this", color: "#FF9E80" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                className="font-serif text-4xl md:text-6xl mb-2"
                style={{ color: item.color }}
              >
                {item.stat}
              </motion.div>
              <div
                className="font-sans text-[10px] md:text-xs tracking-widest uppercase"
                style={{ color: "#A0A0A0" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 font-sans font-bold text-sm tracking-wide px-8 py-4 rounded-full"
            style={{
              background: "linear-gradient(135deg, #FF9E80 0%, #E8603C 100%)",
              color: "white",
              boxShadow: "0 8px 30px #FF9E8055, 0 2px 8px #E8603C22",
              transition: "box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 40px #FF9E8070, 0 4px 12px #E8603C33")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px #FF9E8055, 0 2px 8px #E8603C22")}
          >
            Create Your Memory Piece
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-sans text-sm hover:text-[#52B788] transition-colors duration-300"
            style={{ color: "#A0A0A0" }}
          >
            How the tech works <ChevronRight size={14} />
          </Link>
        </motion.div>

        {/* Fine print */}
        <p
          className="mt-6 text-center font-sans text-[10px] tracking-widest uppercase"
          style={{ color: "#C8C8C8" }}
        >
          Encrypted · Secure · No app required · Works on all smartphones
        </p>
      </div>
    </section>
  );
}