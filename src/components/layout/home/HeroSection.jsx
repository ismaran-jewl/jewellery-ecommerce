"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Mic, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/seo";
import { useSiteContent } from "@/hooks/useSiteContent";

const QR_LINK = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${siteConfig.url}`;
const WAVE_BARS = [8, 18, 24, 14, 20, 10, 22, 16];

const HERO_SLIDES = [
  { id: 1, title: "The Diamond Solitaire", sub: "A promise that lasts forever.", img: "https://images.unsplash.com/photo-1598560912005-59a09551e474?auto=format&fit=crop&w=1920&q=80" },
  { id: 2, title: "Golden Hour Charms", sub: "24k Craftsmanship in every link.", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1920&q=80" },
  { id: 3, title: "Midnight Gold Edition", sub: "Where luxury meets the dark.", img: "https://images.unsplash.com/photo-1573408302354-010549b15295?auto=format&fit=crop&w=1920&q=80" },
  { id: 4, title: "Heritage Pearls", sub: "Timeless elegance for her.", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=80" },
  { id: 5, title: "The Vault: Rare Gems", sub: "Exclusively curated for the 1%.", img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1920&q=80" },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [current, setCurrent] = useState(0);

  const { content: cms } = useSiteContent("home_hero");

  const next = () => setCurrent((p) => (p + 1) % HERO_SLIDES.length);
  const prev = () => setCurrent((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return null;

  const GOLD = "#B5622A";

  const displayTitle = cms?.title || "Gifts That Speak Your Heart.";
  const displaySub = cms?.subtitle || "Personalize your jewellery with a hidden voice message — accessible via our signature QR tech.";
  const displayBtnText = cms?.buttonText || "Shop Collection";
  const displayBtnLink = cms?.buttonLink || "/shop";

  return (
    <>
      <style>{`
        @keyframes waveAnim { 0%,100%{transform:scaleY(1);opacity:.85}50%{transform:scaleY(.35);opacity:.4} }
        @keyframes tickerScroll { 0%{transform:translateX(0)}100%{transform:translateX(-50%)} }
        @keyframes progressFill { from{width:0%}to{width:100%} }
        @keyframes subtleFloat { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
      `}</style>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO — Full-bleed jewellery imagery with brand overlay */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: isMobile ? "60vh" : "60vh" }}
      >
        {/* ── Background: Crossfading jewellery images ── */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: current === idx ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out"
              style={{
                backgroundImage: `url(${cms?.imageUrl && idx === 0 ? cms.imageUrl : slide.img})`,
                transform: current === idx ? "scale(1.06)" : "scale(1)",
              }}
            />
          </div>
        ))}

        {/* ── Gradient overlays for readability ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF5F2]/95 via-[#FAF5F2]/70 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-[1]" />

        {/* ── Progress bar ── */}
        <div
          className="absolute bottom-0 left-0 h-[3px] z-50"
          style={{ animation: "progressFill 5s linear infinite", background: GOLD }}
        />

        {/* ═══════════════════════════════════ */}
        {/* CONTENT LAYER                      */}
        {/* ═══════════════════════════════════ */}
        <div className="relative z-10 h-full flex flex-col justify-between" style={{ minHeight: isMobile ? "50vh" : "50vh" }}>

          {/* ── Main Grid: Text + Accents ── */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 lg:px-24 pt-12 md:pt-16">

            {/* LEFT — Brand Statement */}
            <div className="max-w-xl">
              {/* Accent */}
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-px" style={{ background: GOLD }} />
                <span className="text-[11px] tracking-[3px] uppercase font-medium" style={{ color: GOLD }}>
                   {cms?.metadata?.accent || "Luxury Voice Gifting"}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="leading-[1.05] mb-5 md:mb-6"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 5.5vw, 76px)", color: "#3D1F0D" }}
                dangerouslySetInnerHTML={{ __html: displayTitle.replace(/\n/g, '<br />') }}
              />

              {/* Sub */}
              <p
                className="mb-8 md:mb-10 max-w-sm text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#7A4528" }}
              >
                {displaySub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-0">
                <Link
                  href={displayBtnLink}
                  className="px-8 md:px-10 py-3.5 md:py-4 font-semibold tracking-widest uppercase text-[11px] md:text-[12px] transition-all hover:-translate-y-0.5 hover:shadow-xl inline-block rounded-sm"
                  style={{ background: GOLD, color: "#fff", boxShadow: "0 8px 30px rgba(181,98,42,0.3)" }}
                >
                  {displayBtnText}
                </Link>
                <Link
                  href="/seasonal-edit"
                  className="group flex items-center gap-2 text-[11px] md:text-[12px] tracking-widest uppercase font-semibold transition-colors hover:text-[#B5622A]"
                  style={{ color: "#7A4528" }}
                >
                  Seasonal Edit
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RIGHT — Floating accent cards (desktop) */}
            {!isMobile && (
              <div className="relative h-full flex items-center justify-center">
                {/* Current slide info overlay */}
                <div className="absolute bottom-16 right-0 lg:right-8 text-right z-20">
                  <p className="text-white/60 text-[10px] tracking-[3px] uppercase font-bold mb-2">Now Showing</p>
                  <h2 className="text-white text-3xl lg:text-4xl font-serif mb-1 drop-shadow-lg">{HERO_SLIDES[current].title}</h2>
                  <p className="text-white/80 font-serif italic text-base lg:text-lg drop-shadow-md">{HERO_SLIDES[current].sub}</p>
                </div>

                {/* QR Card */}
                <div
                  className="absolute top-[15%] right-[5%] lg:right-[10%] w-[140px] z-30"
                  style={{
                    animation: "subtleFloat 8s ease-in-out infinite",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 16px 48px -8px rgba(0,0,0,0.15)",
                    padding: "14px",
                  }}
                >
                  <div className="text-[8px] uppercase tracking-[2px] font-bold text-center mb-2" style={{ color: GOLD }}>
                    Scan to hear
                  </div>
                  <div className="w-full aspect-square bg-stone-50/80 p-2 border border-orange-50 mx-auto rounded-lg" style={{ maxWidth: "80px" }}>
                    <img src={QR_LINK} alt="Scannable QR" className="w-full h-full" />
                  </div>
                  <div className="text-[7px] text-stone-400 text-center mt-2">Open camera</div>
                </div>

                {/* Voice Wave Card */}
                <div
                  className="absolute top-[50%] left-[5%] lg:left-[10%] z-30"
                  style={{
                    animation: "subtleFloat 9s ease-in-out 1s infinite",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 12px 36px -8px rgba(0,0,0,0.12)",
                    padding: "12px 16px",
                    minWidth: "130px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Mic size={10} style={{ color: GOLD }} />
                    <span style={{ fontSize: 8, letterSpacing: "2px", color: GOLD, textTransform: "uppercase", fontWeight: 700 }}>
                      Audio ID: 882
                    </span>
                  </div>
                  <div className="flex items-center gap-[3px]" style={{ height: 18 }}>
                    {WAVE_BARS.map((h, i) => (
                      <div
                        key={i}
                        className="w-[3px] rounded-sm flex-shrink-0"
                        style={{ height: h * 0.8, background: GOLD, animation: `waveAnim 1.2s ease-in-out ${i * 0.1}s infinite` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Card */}
                <div
                  className="absolute bottom-[35%] right-[2%] lg:right-[5%] z-30"
                  style={{
                    animation: "subtleFloat 10s ease-in-out 2s infinite",
                    borderRadius: "14px",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    boxShadow: "0 12px 36px -8px rgba(0,0,0,0.12)",
                    padding: "12px 16px",
                  }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={GOLD} stroke="none" />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#3D1F0D" }}>9k+ Happy Voices</div>
                  <div style={{ fontSize: 8, color: "#B5622A99" }}>100% Artisan Crafted</div>
                </div>
              </div>
            )}
          </div>

          {/* ── Mobile: Current slide info + feature strip ── */}
          {isMobile && (
            <div className="px-6 pb-4 z-20">
              <div className="mb-4">
                <p className="text-white/70 text-[9px] tracking-[3px] uppercase font-bold mb-1">Now Showing</p>
                <h2 className="text-white text-2xl font-serif mb-0.5 drop-shadow-lg">{HERO_SLIDES[current].title}</h2>
                <p className="text-white/80 font-serif italic text-sm drop-shadow-md">{HERO_SLIDES[current].sub}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-xl border border-white/60 flex flex-col items-center gap-1">
                  <Mic size={12} style={{ color: GOLD }} />
                  <span style={{ fontSize: 7, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>Voice Note</span>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-xl border border-white/60 flex flex-col items-center gap-1">
                  <Star size={12} style={{ color: GOLD }} />
                  <span style={{ fontSize: 7, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>9k+ Reviews</span>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-2.5 rounded-xl border border-white/60 flex flex-col items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                  <span style={{ fontSize: 7, color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>24h Ship</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Bottom Bar: Navigation + Dots ── */}
          <div className="relative z-20 flex items-center justify-between px-6 md:px-16 lg:px-24 pb-6 md:pb-10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className="transition-all duration-500 rounded-full"
                  style={{
                    width: current === idx ? 28 : 8,
                    height: 4,
                    background: current === idx ? GOLD : "rgba(255,255,255,0.4)",
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 active:scale-95 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 active:scale-95 transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ */}
      {/* TICKER                         */}
      {/* ═══════════════════════════════ */}
      <div className="py-5 border-y border-stone-100/80 bg-[#FAF9F6] overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap" style={{ animation: "tickerScroll 45s linear infinite", opacity: 0.4 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 uppercase tracking-[3px] text-[10px] font-bold text-stone-500">
              <span>◆ Free Gift Wrapping</span>
              <span>◆ Voice Notes Included</span>
              <span>◆ QR Code Enabled</span>
              <span>◆ Luxury Box Included</span>
              <span>◆ BIS Hallmarked Gold</span>
              <span>◆ Insured Shipping</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}