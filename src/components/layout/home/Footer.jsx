"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, ArrowRight, Mail, Phone, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSiteContent } from "@/hooks/useSiteContent";
import { FOOTER_SOCIAL_LINKS as SOCIAL_LINKS } from "@/config/layout";

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const peach = "#E8835A";
const peachLight = "#F2A882";
const mint = "#5ABFA0";
const mintLight = "#82D4BC";

// ─── Big glowing drifting orb ─────────────────────────────────────────────────
function GlowOrb({ x, y, size, colorFrom, colorTo, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        background: `radial-gradient(circle at 40% 40%, ${colorFrom}, ${colorTo} 60%, transparent)`,
        filter: "blur(48px)",
      }}
      animate={{
        x: [0, 40, -25, 10, 0],
        y: [0, -30, 20, -10, 0],
        scale: [1, 1.25, 0.9, 1.1, 1],
        opacity: [0.7, 1, 0.75, 0.9, 0.7],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Spinning conic ring ─────────────────────────────────────────────────────
function SpinRing({ x, y, size, color, duration, delay, cw = true }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        background: `conic-gradient(from 0deg, ${color}CC, transparent 50%, ${color}99 100%)`,
        opacity: 0.45,
      }}
      animate={{ rotate: cw ? [0, 360] : [360, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Morphing blob shape ─────────────────────────────────────────────────────
function MorphBlob({ x, y, size, color, duration, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        translateX: "-50%",
        translateY: "-50%",
        background: color,
        opacity: 0.28,
        filter: "blur(3px)",
      }}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 50% 60% 40% 50%",
          "30% 70% 60% 40% / 40% 50% 60% 60%",
          "70% 30% 40% 60% / 60% 40% 50% 40%",
          "60% 40% 30% 70% / 50% 60% 40% 50%",
        ],
        x: [0, 20, -15, 0],
        y: [0, -18, 12, 0],
        rotate: [0, 15, -10, 0],
        scale: [1, 1.18, 0.92, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── 4-pointed star sparkle ───────────────────────────────────────────────────
function Sparkle({ x, y, delay, color, size = 12 }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ opacity: [0, 1, 0], scale: [0.3, 1.5, 0.3], y: [0, -20, 0] }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width={size} height={size} viewBox="0 0 12 12" fill={color}>
        <path d="M6 0 L6.7 5.3 L12 6 L6.7 6.7 L6 12 L5.3 6.7 L0 6 L5.3 5.3 Z" />
      </svg>
    </motion.div>
  );
}

// ─── Shimmer sweep line ───────────────────────────────────────────────────────
function Shimmer({ y, delay, colors }) {
  return (
    <motion.div
      className="absolute pointer-events-none h-[2px]"
      style={{
        top: `${y}%`,
        width: "45%",
        background: `linear-gradient(90deg, transparent, ${colors[0]}, ${colors[1]}, transparent)`,
      }}
      animate={{ x: ["-100%", "280%"], opacity: [0, 0.8, 0] }}
      transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────
const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function EnhancedFooter() {
  const { content: cms } = useSiteContent("footer_info");

  const displayStory = cms?.description || "Crafting stories in gems and jewels. Join 50,000+ style enthusiasts receiving our weekly curation of elegance.";
  const displayEmail = cms?.metadata?.email || "ismarn.jewls@gmail.com";
  const displayPhone = cms?.metadata?.phone || "+9648135763";

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #FFF5EF 0%, #FDF0E6 55%, #EEF8F4 100%)",
        borderTop: `1px solid ${peach}33`,
      }}
    >
      {/* ══ MOTION BACKGROUND ══════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        {/* Big colour orbs */}
        <GlowOrb x={0}   y={0}   size={450} colorFrom={`${peach}CC`}      colorTo={`${peachLight}77`} duration={10} delay={0} />
        <GlowOrb x={100} y={0}   size={400} colorFrom={`${mint}CC`}       colorTo={`${mintLight}77`}  duration={13} delay={2} />
        <GlowOrb x={50}  y={110} size={380} colorFrom={`${peachLight}BB`} colorTo={`${mint}66`}       duration={15} delay={1} />
        <GlowOrb x={25}  y={55}  size={240} colorFrom={`${mint}99`}       colorTo="transparent"       duration={9}  delay={4} />
        <GlowOrb x={78}  y={45}  size={220} colorFrom={`${peach}99`}      colorTo="transparent"       duration={11} delay={1.8} />

        {/* Conic spinning rings */}
        <SpinRing x={3}   y={5}   size={260} color={peach}      duration={16} delay={0}   cw={true}  />
        <SpinRing x={97}  y={8}   size={210} color={mint}       duration={20} delay={2.5} cw={false} />
        <SpinRing x={60}  y={95}  size={180} color={peachLight} duration={18} delay={1}   cw={true}  />
        <SpinRing x={40}  y={50}  size={130} color={mintLight}  duration={14} delay={3}   cw={false} />

        {/* Morphing blobs */}
        <MorphBlob x={12}  y={25}  size={100} color={peach}      duration={9}  delay={0}   />
        <MorphBlob x={88}  y={15}  size={80}  color={mint}       duration={11} delay={1.5} />
        <MorphBlob x={72}  y={72}  size={90}  color={peachLight} duration={13} delay={0.8} />
        <MorphBlob x={28}  y={80}  size={70}  color={mintLight}  duration={10} delay={3}   />
        <MorphBlob x={93}  y={60}  size={60}  color={peach}      duration={8}  delay={2.2} />

        {/* Star sparkles */}
        {[
          { x: 7,  y: 30, d: 0,   c: peach,      s: 14 },
          { x: 20, y: 68, d: 0.6, c: mint,       s: 10 },
          { x: 38, y: 12, d: 1.3, c: peachLight, s: 12 },
          { x: 58, y: 82, d: 2.0, c: mintLight,  s: 10 },
          { x: 74, y: 28, d: 0.4, c: peach,      s: 14 },
          { x: 87, y: 72, d: 1.7, c: mint,       s: 11 },
          { x: 50, y: 48, d: 2.5, c: peachLight, s: 9  },
          { x: 15, y: 88, d: 3.1, c: mintLight,  s: 13 },
          { x: 63, y: 55, d: 0.9, c: peach,      s: 8  },
        ].map((s, i) => (
          <Sparkle key={i} x={s.x} y={s.y} delay={s.d} color={s.c} size={s.s} />
        ))}

        {/* Shimmer sweeps */}
        <Shimmer y={18} delay={0}   colors={[peach, mintLight]} />
        <Shimmer y={50} delay={2}   colors={[mint, peachLight]} />
        <Shimmer y={78} delay={4.5} colors={[peachLight, mint]} />

        {/* Subtle mesh */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mesh" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="36" stroke={peach} strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>

      {/* ══ CONTENT ════════════════════════════════════════════════════════════ */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
        className="relative container mx-auto px-6 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-6 mb-8">

          {/* Brand — 4 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-3">
            <div className="group cursor-default">
              <h2 className="text-2xl font-serif font-bold tracking-tight" style={{ color: peach }}>
                ISMARN
              </h2>
              <div
                className="h-0.5 w-0 group-hover:w-16 transition-all duration-500 ease-out"
                style={{ background: `linear-gradient(90deg, ${peach}, ${mint})` }}
              />
            </div>

            <p className="text-sm text-balance leading-relaxed max-w-sm" style={{ color: "#7A5C4E" }}>
              {displayStory}
            </p>

            <div className="flex flex-col space-y-1.5">
              <div className="relative group max-w-sm">
                <Input
                  placeholder="Your email address"
                  className="pl-4 pr-11 py-4 text-sm rounded-full transition-all duration-300"
                  style={{
                    border: `1px solid ${peach}55`,
                    background: "rgba(255,255,255,0.65)",
                    backdropFilter: "blur(10px)",
                    outline: "none",
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-1.5 top-1.5 rounded-full h-7 w-7 border-0 transition-transform hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${peach}, ${mint})` }}
                >
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </Button>
              </div>
              <p className="text-[10px] px-4" style={{ color: "#B08070" }}>
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </motion.div>

          {/* Collections — 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs" style={{ color: mint }}>
              Collections
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Shop All", href: "/shop" },
                { name: "New Arrivals", href: "/shop?sort=newest" },
                { name: "Best Sellers", href: "/shop?sort=price-desc" },
                { name: "About Us", href: "/about" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 flex items-center group"
                    style={{ color: "#7A5C4E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = peach)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A5C4E")}
                  >
                    <span
                      className="h-px w-0 group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"
                      style={{ background: peach }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support — 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs" style={{ color: mint }}>
              Support
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "FAQ", href: "/faq" },
                { name: "Offers", href: "/offers" },
                { name: "Contact Us", href: "/contact" },
                { name: "Size Guide", href: "/size-guide" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm transition-all duration-300 flex items-center group"
                    style={{ color: "#7A5C4E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = peach)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A5C4E")}
                  >
                    <span
                      className="h-px w-0 group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300"
                      style={{ background: peach }}
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact — 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs" style={{ color: mint }}>
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-sm" style={{ color: "#7A5C4E" }}>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="p-1.5 rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${peach}22`, color: peach }}
                  onMouseEnter={e => { e.currentTarget.style.background = peach; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${peach}22`; e.currentTarget.style.color = peach; }}
                >
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs break-all">{displayEmail}</span>
              </div>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="p-1.5 rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${mint}22`, color: mint }}
                  onMouseEnter={e => { e.currentTarget.style.background = mint; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${mint}22`; e.currentTarget.style.color = mint; }}
                >
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs">{displayPhone}</span>
              </div>
            </div>
          </motion.div>

          {/* ── SOCIAL LINKS — 2 cols ─────────────────────────────────────────── */}
          {/* ✏️  Edit SOCIAL_LINKS array at the top of this file to update URLs  */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold mb-4 uppercase tracking-widest text-xs" style={{ color: mint }}>
              Follow Us
            </h4>
            <div className="space-y-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2.5 group cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="p-1.5 rounded-full transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    style={{ background: `${color}22`, color }}
                    onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.color = color; }}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <span
                    className="text-xs transition-colors duration-300"
                    style={{ color: "#7A5C4E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = color)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#7A5C4E")}
                  >
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Gradient separator */}
        <div
          className="w-full h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${peach}66, ${mint}66, transparent)` }}
        />

        {/* Bottom bar */}
        <div className="mt-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: "#A07060" }}>
            © {new Date().getFullYear()} ISMARN Boutique. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs" style={{ color: "#A07060" }}>
            {[
              { name: "Privacy", href: "/privacy-policy" },
              { name: "Terms", href: "/terms" },
              { name: "Cookies", href: "#" }
            ].map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className="transition-colors"
                onMouseEnter={e => (e.currentTarget.style.color = peach)}
                onMouseLeave={e => (e.currentTarget.style.color = "#A07060")}
              >
                {l.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="h-5 w-9 bg-slate-200 rounded animate-pulse" title="Visa" />
            <div className="h-5 w-9 bg-slate-200 rounded animate-pulse" title="Mastercard" />
            <div className="h-5 w-9 bg-slate-200 rounded animate-pulse" title="Amex" />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}