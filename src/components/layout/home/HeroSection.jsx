"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
const QR_LINK = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jewellery-ecommerce-iota.vercel.app";

const WAVE_BARS = [8, 18, 24, 14, 20, 10, 22, 16];

function WaveBar({ height, delay }) {
  return (
    <div className="w-[3px] rounded-sm flex-shrink-0" style={{ height, background: "#B5622A", animation: `waveAnim 1.2s ease-in-out ${delay}s infinite` }} />
  );
}

function FloatingCard({ className, style, children }) {
  return (
    <div className={`absolute backdrop-blur-xl p-3.5 z-30 ${className}`} style={{ background: "rgba(255,245,235,0.7)", border: "1px solid rgba(181,98,42,0.2)", boxShadow: "0 12px 40px rgba(181,98,42,0.15)", borderRadius: "12px", ...style }}>{children}</div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const [currentTile, setCurrentTile] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const ADS_TILES = [
    { id: 1, content: "The Diamond Solitaire", sub: "A promise that lasts forever.", img: "https://images.unsplash.com/photo-1598560912005-59a09551e474?auto=format&fit=crop&w=1200&q=80" },
    { id: 2, content: "Golden Hour Charms", sub: "24k Craftsmanship in every link.", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80" },
    { id: 3, content: "Midnight Gold Edition", sub: "Where luxury meets the dark.", img: "https://images.unsplash.com/photo-1573408302354-010549b15295?auto=format&fit=crop&w=1200&q=80" },
    { id: 4, content: "Heritage Pearls", sub: "Timeless elegance for her.", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80" },
    { id: 5, content: "The Vault: Rare Gems", sub: "Exclusively curated for the 1%.", img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80" },
  ];

  const nextTile = () => setCurrentTile((prev) => (prev + 1) % ADS_TILES.length);
  const prevTile = () => setCurrentTile((prev) => (prev - 1 + ADS_TILES.length) % ADS_TILES.length);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextTile, 8000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = e.clientX + "px";
        cursorDotRef.current.style.top = e.clientY + "px";
      }
    };

    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = ringPos.current.x + "px";
        cursorRingRef.current.style.top = ringPos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", handleMove);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", checkMobile);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!mounted) return null;

  const GOLD = "#B5622A";
  const TEXT_DARK = "#3D1F0D";
  const TEXT_MID = "#7A4528";

  return (
    <>
      <style>{`
        @keyframes waveAnim { 0%,100%{transform:scaleY(1);opacity:.85;}50%{transform:scaleY(.35);opacity:.4;} }
        @keyframes heroFloat { 0%,100%{transform:translate(-50%,-50%) rotate(-1deg);}50%{transform:translate(-50%,-54%) rotate(1deg);} }
        @keyframes qrFloat { 0%,100%{transform:translateY(0px) rotate(2deg);}50%{transform:translateY(-20px) rotate(-2deg);} }
        @keyframes floatUp { 0%,100%{transform:translateY(0px);}50%{transform:translateY(-15px);} }
        @keyframes floatDown { 0%,100%{transform:translateY(0px);}50%{transform:translateY(15px);} }
        @keyframes tickerScroll { 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }
        @keyframes progressFill { from{width:0%;}to{width:100%;} }
        .hero-cursor{cursor:none;}
        .hero-cursor *{cursor:none;}
      `}</style>

      <section className="hero-cursor py-10 relative overflow-hidden flex flex-col md:grid md:grid-cols-2" style={{ background: "linear-gradient(160deg, #FDFBF7 0%, #FAF5F2 100%)" }}>

        <div className="relative z-10 flex flex-col justify-center px-8 pt-3 md:px-16 lg:px-24">
          <div className="flex items-center gap-3 mb-8"><div className="w-10 h-px" style={{ background: GOLD }} /><span className="text-[11px] tracking-[3px] uppercase font-medium" style={{ color: GOLD }}>Luxury Voice Gifting</span></div>
          <h1 className="leading-[1.1] mb-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px,6vw,80px)", color: TEXT_DARK }}>Gifts That <br /> <em style={{ fontStyle: "italic", color: GOLD }}>Speak Your</em> <br /><span style={{ WebkitTextStroke: `1.5px ${GOLD}`, color: "transparent" }}>Heart.</span></h1>
          <p className="mb-10 max-w-sm text-lg italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_MID }}>Personalize your jewelry with a hidden voice message accessible via our signature QR tech.</p>
          <div className="flex flex-wrap gap-6"><button className="px-10 py-4 font-semibold tracking-widest uppercase text-[12px] shadow-2xl transition-all hover:-translate-y-1" style={{ background: GOLD, color: "#fff" }}>Shop Collection</button></div>
        </div>

        <div className="relative flex items-center justify-center py-20 md:py-0">
          <div className="relative w-[clamp(320px,45vw,560px)] aspect-[14/15]">
            {/* 1. SCANNABLE QR CARD (NOW FRONT & CLEAR) */}
            <div className="absolute top-[20px] right-[10px] md:top-[-20px] md:right-[20px] w-[160px] md:w-[200px] bg-white border border-orange-100 shadow-2xl p-4 flex flex-col items-center z-40"
              style={{ animation: "qrFloat 6s ease-in-out infinite", borderRadius: "24px" }}>
              <div className="mb-3 text-[9px] uppercase tracking-widest text-orange-800 font-bold">Scan the Surprise</div>
              <div className="w-full aspect-square bg-stone-50 p-2 border border-orange-50 mb-3">
                <img src={QR_LINK} alt="Scannable QR" className="w-full h-full transition-all" />
              </div>
              <div className="text-[8px] text-stone-400 italic text-center">Open camera to hear the note</div>
            </div>

            {/* 2. MAIN ANNIVERSARY CARD */}
            <div className="absolute top-1/2 left-1/2  w-[220px] h-[320px] md:w-[280px] md:h-[400px] bg-[#FFF0E6] border border-orange-100 shadow-2xl p-8 flex flex-col items-center justify-center text-center z-20"
              style={{ animation: "heroFloat 5s ease-in-out infinite", borderRadius: "16px" }}>
              <div className="text-5xl mb-6">💍</div>
              <div className="mb-2 font-serif italic text-sm text-orange-800">The Keepsake</div>
              <p className="font-serif italic text-stone-700 leading-relaxed text-lg">"Happy Anniversary. This reminded me of your sparkle."</p>
              <div className="mt-8 pt-4 border-t border-orange-200/50 w-full">
                <span className="text-[9px] tracking-[3px] uppercase text-stone-500 font-bold">Encrypted Audio</span>
              </div>
            </div>

            {/* 3. VOICE NOTE WAVE CARD */}
            <FloatingCard className="top-[100px] left-[-30px] md:top-[120px] md:left-[-70px] min-w-[140px]" style={{ animation: "floatUp 7s ease-in-out infinite" }}>
              <div style={{ fontSize: 9, letterSpacing: "2px", color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>🎙️ Audio ID: 882</div>
              <div className="flex items-center gap-[3px]" style={{ height: 20 }}>{WAVE_BARS.map((h, i) => <WaveBar key={i} height={h} delay={i * 0.1} />)}</div>
            </FloatingCard>

            {/* 4. VALENTINE'S CARD */}
            <FloatingCard className="top-[-60px] left-[60px] md:top-[-40px] md:left-[100px]" style={{ animation: "floatDown 6.5s ease-in-out infinite" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14 }}>❤️</span>
                <span style={{ fontSize: 9, color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Valentine's Edit</span>
              </div>
            </FloatingCard>

            {/* 5. DAUGHTER QUOTE CARD */}
            <FloatingCard className="bottom-[40px] left-[-20px] md:bottom-[60px] md:left-[-50px] max-w-[160px]" style={{ animation: "floatUp 5.8s ease-in-out infinite" }}>
              <div style={{ fontSize: 9, color: TEXT_DARK, fontStyle: "italic", lineHeight: "1.4" }}>"To my daughter, my pride..."</div>
            </FloatingCard>

            {/* 6. HAND-CRAFTED BADGE */}
            <FloatingCard className="bottom-[-30px] right-[40px] md:bottom-[-10px] md:right-[100px] flex items-center gap-2" style={{ animation: "floatDown 5.2s ease-in-out infinite" }}>
              <div className="w-5 h-5 rounded-full bg-orange-200 flex items-center justify-center text-[10px]">✨</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: GOLD }}>100% Artisan Made</div>
            </FloatingCard>

            {/* 7. DELIVERY CARD */}
            {!isMobile && (
              <FloatingCard className="bottom-[180px] right-[-60px] min-w-[140px]" style={{ animation: "floatUp 6.2s ease-in-out infinite" }}>
                <div style={{ fontSize: 8, color: "rgba(61,31,13,0.5)", textTransform: "uppercase" }}>📦 Shipping</div>
                <div style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>Arriving in 24h</div>
              </FloatingCard>
            )}

            {/* 8. RATING CARD */}
            {!isMobile && (
              <FloatingCard className="top-[180px] right-[-90px] min-w-[120px]" style={{ animation: "floatDown 7.2s ease-in-out infinite" }}>
                <div style={{ color: GOLD, fontSize: 10 }}>★★★★★</div>
                <div style={{ fontSize: 9, fontWeight: 600 }}>9k+ Happy Voices</div>
              </FloatingCard>
            )}
          </div>
        </div>
        {/* CROSS-FADE CAROUSEL */}
        <div className="py-2 relative mt-16 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full max-w-6xl px-6 md:px-16 z-10" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="max-w-4xl mx-auto h-[250px] md:h-[400px] rounded-[30px] overflow-hidden relative bg-white/30 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.25),0_0_80px_rgba(255,215,180,0.15)]">
            {!isPaused && (
              <div
                className="absolute top-0 left-0 h-1 z-50"
                style={{ animation: `progressFill 8s linear infinite`, background: GOLD }}
              />
            )}

            {ADS_TILES.map((tile, idx) => (
              <div
                key={tile.id}
                className="absolute inset-0 transition-opacity duration-1000 flex items-center"
                style={{ opacity: currentTile === idx ? 1 : 0 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms]"
                  style={{
                    backgroundImage: `url(${tile.img})`,
                    transform: currentTile === idx ? "scale(1.1)" : "scale(1)",
                  }}
                />

                {/* darker gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

                <div className="relative z-10 px-12 md:px-24 text-white max-w-2xl">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[9px] tracking-[3px] uppercase mb-6">
                    Exquisite Selection
                  </span>

                  <h3 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
                    {tile.content}
                  </h3>

                  <p className="text-white/80 font-serif italic text-lg md:text-2xl">
                    {tile.sub}
                  </p>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 right-4 md:bottom-12 md:right-12 flex gap-3 md:gap-4 z-40">

              <button
                onClick={prevTile}
                className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 active:scale-95 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={nextTile}
                className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 active:scale-95 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="py-6 border-y border-stone-100 bg-[#FAF9F6] overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap opacity-50" style={{ animation: "tickerScroll 30s linear infinite" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 uppercase tracking-[3px] text-[10px] font-bold text-stone-600">
              <span>◆ Free Gift Wrapping</span>
              <span>◆ Voice Notes Included</span>
              <span>◆ QR Code Enabled</span>
              <span>◆ Luxury Box Included</span>
            </div>
          ))}
        </div>
      </div>
      <div
        ref={cursorDotRef}
        className="fixed w-2 h-2 bg-[#B5622A] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />

      <div
        ref={cursorRingRef}
        className="fixed w-10 h-10 border border-[#B5622A]/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}