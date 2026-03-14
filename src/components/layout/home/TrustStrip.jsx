"use client";

import { Gem, ShieldCheck, Truck, Heart } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  { icon: Gem, title: "BIS Hallmarked", sub: "100% Certified Gold" },
  { icon: ShieldCheck, title: "Lifetime Exchange", sub: "Easy upgrades" },
  { icon: Truck, title: "Insured Shipping", sub: "Safe to your doorstep" },
  { icon: Heart, title: "Heritage Craft", sub: "Handmade with love" },
];

export default function TrustStrip() {
  return (
    /* bg-transparent — background comes from the seamless canvas in page.jsx */
    <section className="relative bg-transparent py-2">
      {/* Glassmorphism card floats above the canvas */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 px-8 py-10 shadow-xl shadow-[#FFD4C2]/15"
        >
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: i % 2 === 0
                    ? "linear-gradient(135deg, #FAF5F2, #FDFBF7)"
                    : "linear-gradient(135deg, #F5F5F0, #FAF9F6)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                }}
              >
                <item.icon
                  className="w-6 h-6"
                  style={{ color: i % 2 === 0 ? "#E07040" : "#52B788" }}
                />
              </div>
              <h5 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#3D3D3D" }}>
                {item.title}
              </h5>
              <p className="text-xs mt-1" style={{ color: "#8A8A8A" }}>
                {item.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}