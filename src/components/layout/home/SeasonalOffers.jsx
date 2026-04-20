"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/hooks/useSiteContent";
import { SEASONAL_OFFERS_FALLBACK } from "@/config/home";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const pad = (n) => String(n).padStart(2, "0");

const FALLBACK_GRADS = [
  "linear-gradient(145deg,#C9A88E,#A87450)",
  "linear-gradient(145deg,#8B6B50,#6B4830)",
  "linear-gradient(145deg,#D4B090,#B07848)",
  "linear-gradient(145deg,#7A5540,#5A3520)",
  "linear-gradient(145deg,#C0956A,#906040)",
  "linear-gradient(145deg,#985830,#6A3010)",
  "linear-gradient(145deg,#D0A878,#A07848)",
  "linear-gradient(145deg,#B8806A,#885040)",
  "linear-gradient(145deg,#B09070,#806040)",
  "linear-gradient(145deg,#906050,#603020)",
];

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
const ProductCard = ({ item, index, height, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.07, duration: 0.55, ease: "easeOut" }}
    whileHover={{ scale: 1.018 }}
    onClick={onClick}
    style={{
      height,
      borderRadius: 18,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      background: FALLBACK_GRADS[index % FALLBACK_GRADS.length],
      flexShrink: 0,
    }}
  >
    {/* Media */}
    {item?.type === "video" ? (
      <video
        src={item.src}
        autoPlay loop muted playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    ) : (item?.src || item?.image) ? (
      <img
        src={item.src || item.image}
        alt={item?.name || ""}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    ) : null}

    {/* Gradient overlay */}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,6,0,0.68) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)" }} />

    {/* Badge */}
    {(item?.label || item?.category) && (
      <span style={{
        position: "absolute", top: 10, left: 10,
        background: "rgba(255,255,255,0.92)", color: "#B5622A",
        fontSize: 9, fontFamily: "'Jost',sans-serif", fontWeight: 500,
        letterSpacing: "0.12em", textTransform: "uppercase",
        padding: "4px 10px", borderRadius: 20,
      }}>
        {item.label || item.category}
      </span>
    )}

    {/* Info */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 12px" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", color: "#fff", fontSize: 13, fontWeight: 400, margin: "0 0 2px" }}>
        {item?.name || `Signature No. ${index + 1}`}
      </p>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
        Tap to explore →
      </p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────
   BOTTOM PANO CARD
───────────────────────────────────────── */
const PanoCard = ({ item, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.07, duration: 0.5 }}
    whileHover={{ scale: 1.025 }}
    onClick={onClick}
    style={{
      height: 130,
      borderRadius: 16,
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      background: FALLBACK_GRADS[(index + 7) % FALLBACK_GRADS.length],
    }}
  >
    {item?.type === "video" ? (
      <video src={item.src} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (item?.src || item?.image) ? (
      <img src={item.src || item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : null}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(18,6,0,0.35) 0%, transparent 65%)" }} />
    {(item?.label || item?.category) && (
      <span style={{
        position: "absolute", top: 9, right: 9,
        background: "rgba(255,255,255,0.9)", color: "#B5622A",
        fontSize: 8, fontFamily: "'Jost',sans-serif", fontWeight: 500,
        letterSpacing: "0.1em", textTransform: "uppercase",
        padding: "3px 8px", borderRadius: 20,
      }}>
        {item.label || item.category}
      </span>
    )}
    <span style={{
      position: "absolute", bottom: 9, left: 11,
      fontFamily: "'Cormorant Garamond',serif",
      fontStyle: "italic", color: "rgba(255,255,255,0.88)", fontSize: 11,
    }}>
      {item?.name || `No. ${8 + index}`}
    </span>
  </motion.div>
);

/* ─────────────────────────────────────────
   COUNTDOWN
───────────────────────────────────────── */
const Countdown = () => {
  const [time, setTime] = useState({ h: 12, m: 43, s: 30 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(({ h, m, s }) => {
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.35 }}
      style={{
        background: "rgba(255,255,255,0.50)",
        backdropFilter: "blur(14px)",
        borderRadius: 16,
        padding: "14px 18px",
        border: "1px solid rgba(255,255,255,0.65)",
        textAlign: "center",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#B5622A", display: "inline-block", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B5622A", fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
          Limited Time
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
        {[{ v: time.h, l: "hrs" }, { v: time.m, l: "min" }, { v: time.s, l: "sec" }].map((u, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#C8865A", opacity: 0.65, lineHeight: 1, paddingBottom: 10 }}>:</span>
            )}
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, color: "#1E1008", display: "block", lineHeight: 1 }}>
                {pad(u.v)}
              </span>
              <span style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", color: "#A08070", fontFamily: "'Jost',sans-serif" }}>
                {u.l}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   CONTENT CARD (center panel)
───────────────────────────────────────── */
const ContentCard = ({ cms, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    style={{
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(16px)",
      borderRadius: 22,
      padding: isMobile ? "22px 20px" : "24px 22px",
      textAlign: "center",
      border: "1px solid rgba(255,255,255,0.7)",
      flexShrink: 0,
    }}
  >
    {/* Eyebrow */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ height: 1, width: 28, background: "#C8865A", opacity: 0.5, display: "inline-block" }} />
      <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B5622A", fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
        {cms?.eyebrow || "Spring Edit"}
      </span>
      <span style={{ height: 1, width: 28, background: "#C8865A", opacity: 0.5, display: "inline-block" }} />
    </div>

    {/* Title */}
    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 32 : 36, fontWeight: 300, color: "#1E1008", lineHeight: 1.15, margin: "0 0 8px" }}>
      {cms?.title ? (
        <span dangerouslySetInnerHTML={{ __html: cms.title }} />
      ) : (
        <>
          The{" "}
          <em style={{ fontStyle: "italic", color: "#C8603A" }}>Seasonal</em>
          <br />Edit
        </>
      )}
    </h2>

    {/* Subtitle */}
    <p style={{ fontSize: 11, color: "#8A7060", letterSpacing: "0.04em", marginBottom: 18, lineHeight: 1.7 }}>
      {cms?.subtitle || (isMobile ? "Curated pieces for the season." : <>Curated pieces for the season.<br />Each one crafted to last.</>)}
    </p>

    {/* CTA */}
    <Link href={cms?.buttonLink || "/seasonal-edit"}>
      <button
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#1E1008", color: "#F5EDE4",
          border: "none", borderRadius: 30, padding: "11px 24px",
          fontFamily: "'Jost',sans-serif", fontSize: 11,
          letterSpacing: "0.15em", textTransform: "uppercase",
          cursor: "pointer", fontWeight: 400,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#3A2010"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#1E1008"}
      >
        {cms?.buttonText || "Explore All"} →
      </button>
    </Link>
  </motion.div>
);

/* ─────────────────────────────────────────
   MOBILE HORIZONTAL SCROLL
───────────────────────────────────────── */
const MobileScroll = ({ items, onItemClick }) => {
  const [prog, setProg] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProg(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={ref}
        style={{
          display: "flex", gap: 12, overflowX: "auto",
          paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
          scrollSnapType: "x proximity",
          scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item._id || item.id || i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ flexShrink: 0, width: 180, scrollSnapAlign: "center", cursor: "pointer" }}
            onClick={() => onItemClick(item)}
          >
            <div style={{ height: 230, borderRadius: 18, overflow: "hidden", position: "relative", background: FALLBACK_GRADS[i % FALLBACK_GRADS.length] }}>
              {item.type === "video" ? (
                <video src={item.src} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (item.src || item.image) ? (
                <img src={item.src || item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : null}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,6,0,0.65) 0%, transparent 60%)" }} />
              {(item.label || item.category) && (
                <span style={{
                  position: "absolute", top: 9, left: 9,
                  background: "rgba(255,255,255,0.9)", color: "#B5622A",
                  fontSize: 9, fontFamily: "'Jost',sans-serif", fontWeight: 500,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 20,
                }}>
                  {item.label || item.category}
                </span>
              )}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 10px" }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", color: "#fff", fontSize: 13, margin: "0 0 2px" }}>
                  {item.name || `Signature No. ${i + 1}`}
                </p>
                <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                  Tap →
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ margin: "10px 16px 0", height: 2, borderRadius: 4, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <motion.div
          style={{
            height: "100%", borderRadius: 4,
            width: `${Math.max(prog * 100, 6)}%`,
            background: "linear-gradient(90deg,#B5622A,#E07040)",
          }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </div>
      <motion.p
        initial={{ opacity: 1 }}
        animate={{ opacity: prog > 0.06 ? 0 : 1 }}
        style={{
          textAlign: "center", marginTop: 8,
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#A08870", fontFamily: "'Jost',sans-serif",
        }}
      >
        Swipe to explore
      </motion.p>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function SeasonalOffers() {
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const { content: cms } = useSiteContent("seasonal_banner");

  /* Responsive check */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Fetch products */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?homepageSection=Seasonal&limit=11");
        const data = await res.json();
        const raw = data?.products?.length > 0 ? data.products : SEASONAL_OFFERS_FALLBACK;
        setMediaItems(
          raw.map((p) => ({
            ...p,
            type: p.image?.endsWith(".mp4") ? "video" : "image",
            src: p.image,
            label: p.category,
          }))
        );
      } catch {
        setMediaItems(
          SEASONAL_OFFERS_FALLBACK.map((p) => ({
            ...p,
            type: p.image?.endsWith(".mp4") ? "video" : "image",
            src: p.image,
            label: p.category,
          }))
        );
      }
    }
    fetchProducts();
  }, []);

  const goTo = (item) => router.push(`/product/${item._id || item.id}`);

  /* Distribute items across grid positions */
  const L = mediaItems.slice(0, 3);    // left column (3 cards)
  const C = mediaItems[3] || null;     // center hero
  const R = mediaItems.slice(4, 7);    // right column (3 cards)
  const B = mediaItems.slice(7, 11);   // bottom panorama (4 cards)

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <section style={{
        background: "#F5EDE4",
        fontFamily: "'Jost', sans-serif",
        padding: isMobile ? "24px 0 32px" : "28px",
        minHeight: isMobile ? "auto" : "100vh",
        boxSizing: "border-box",
      }}>

        {/* ══════════════════════════
            MOBILE LAYOUT
        ══════════════════════════ */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ margin: "0 16px" }}>
              <ContentCard cms={cms} isMobile />
            </div>
            <MobileScroll items={mediaItems} onItemClick={goTo} />
            <div style={{ margin: "0 16px" }}>
              <Countdown />
            </div>
          </div>

        ) : (
          /* ══════════════════════════
              DESKTOP LAYOUT
          ══════════════════════════ */
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px 1fr",
            gap: 14,
            maxWidth: 1300,
            margin: "0 auto",
          }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ProductCard item={L[0]} index={0} height={265} onClick={() => L[0] && goTo(L[0])} />
              <ProductCard item={L[1]} index={1} height={172} onClick={() => L[1] && goTo(L[1])} />
              <ProductCard item={L[2]} index={2} height={212} onClick={() => L[2] && goTo(L[2])} />
            </div>

            {/* ── CENTER COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              <ContentCard cms={cms} />

              {/* Hero card — flexible */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.015 }}
                onClick={() => C && goTo(C)}
                style={{
                  flex: 1,
                  minHeight: 240,
                  borderRadius: 22,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  background: FALLBACK_GRADS[3],
                }}
              >
                {C?.type === "video" ? (
                  <video src={C.src} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (C?.src || C?.image) ? (
                  <img src={C.src || C.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : null}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,6,0,0.72) 0%, transparent 60%)" }} />
                {(C?.label || C?.category) && (
                  <span style={{
                    position: "absolute", top: 12, left: 12,
                    background: "rgba(255,255,255,0.92)", color: "#B5622A",
                    fontSize: 9, fontFamily: "'Jost',sans-serif", fontWeight: 500,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 20,
                  }}>
                    {C.label || C.category}
                  </span>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 16px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", color: "#fff", fontSize: 16, fontWeight: 400, margin: "0 0 3px" }}>
                    {C?.name || "The Centrepiece"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                    {C?.category || "Handcrafted · Limited Edition"}
                  </p>
                </div>
              </motion.div>

              <Countdown />
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ProductCard item={R[0]} index={4} height={212} onClick={() => R[0] && goTo(R[0])} />
              <ProductCard item={R[1]} index={5} height={265} onClick={() => R[1] && goTo(R[1])} />
              <ProductCard item={R[2]} index={6} height={172} onClick={() => R[2] && goTo(R[2])} />
            </div>

            {/* ── BOTTOM PANORAMA ROW — spans all 3 cols ── */}
            <div style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <PanoCard
                  key={B[i]?._id || B[i]?.id || i}
                  item={B[i] || {}}
                  index={i}
                  onClick={() => B[i] && goTo(B[i])}
                />
              ))}
            </div>

          </div>
        )}
      </section>
    </>
  );
}