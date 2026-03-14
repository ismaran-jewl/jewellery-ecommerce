"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Zap, Award, BookOpen, Gem } from "lucide-react";

const VALUES = [
  {
    title: "Uncompromising Quality",
    icon: <Award className="w-6 h-6" />,
    color: "#B5622A",
    desc: "Every piece of Ismarn jewelry is a masterpiece of precision, crafted by artisans who have dedicated their lives to the perfection of precious metals and stones."
  },
  {
    title: "The Emotional Connection",
    icon: <Heart className="w-6 h-6" />,
    color: "#E07040",
    desc: "We don't just sell jewelry; we sell placeholders for memories. Our mission is to deepen the bonds between people through the power of voice and beauty."
  },
  {
    title: "Digital Soul",
    icon: <Zap className="w-6 h-6" />,
    color: "#52B788",
    desc: "We are pioneers in 'Smart Luxury'—bridging the gap between the physical and the digital with our signature scannable voice messages."
  }
];

export default function AboutPage() {
  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Editorial Story Header */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="h-px w-10" style={{ background: "#E07040" }} />
            <span className="text-[11px] font-bold uppercase tracking-[6px]" style={{ color: "#E07040" }}>The Ismarn Story</span>
            <div className="h-px w-10" style={{ background: "#E07040" }} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold text-stone-900 mb-10 leading-[0.9]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Heritage in <br />
            <em className="italic font-light" style={{ color: "#E07040" }}>Every Whisper</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-stone-600 font-serif italic max-w-2xl mx-auto leading-relaxed"
          >
            "Ismarn was born from a simple question: What if jewelry could speak the words we struggle to find?"
          </motion.p>
        </div>

        {/* Brand Mission Section */}
        <div className="grid md:grid-cols-2 gap-16 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-orange-100/50 rounded-[3rem] blur-2xl -z-10" />
            <div className="bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-white/60 shadow-2xl">
              <h2 className="text-3xl font-bold text-stone-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our <span style={{ color: "#E07040" }}>Manifesto</span>
              </h2>
              <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
                <p>
                  Since 2024, our boutique has redifined luxury by blending 24k gold craftsmanship with cutting-edge voice technology.
                </p>
                <p>
                  We believe that a gift should be more than an object—it should be an experience. That's why every Ismarn piece comes with a lifetime-guaranteed digital memory bank.
                </p>
              </div>
            </div>
            
            {/* Floating Decorative Icon */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center rotate-12 border border-stone-100">
               <Gem className="w-8 h-8" style={{ color: "#52B788" }} />
            </div>
          </motion.div>

          <div className="space-y-8">
            {VALUES.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center" style={{ color: value.color }}>
                  {value.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-900 mb-2 uppercase tracking-wide text-sm">{value.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/30 backdrop-blur-xl rounded-[4rem] border border-white/40"
        >
          <Sparkles className="w-10 h-10 mx-auto mb-6" style={{ color: "#E07040" }} />
          <h3 className="text-3xl md:text-5xl font-bold text-stone-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to start <em className="font-light" style={{ color: "#E07040" }}>your</em> story?
          </h3>
          <button className="px-12 py-5 bg-stone-900 text-white rounded-full font-bold uppercase tracking-[3px] text-[10px] hover:scale-105 transition-transform shadow-2xl">
             Explore the Vault
          </button>
        </motion.div>
      </div>
    </main>
  );
}
