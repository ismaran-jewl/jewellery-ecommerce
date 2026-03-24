"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { HOME_COLLECTIONS as collections } from "@/config/home";

export default function CollectionsGrid() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    /* bg-transparent — background comes from the seamless canvas in page.jsx */
    <section ref={containerRef} className="relative pt-4 pb-16 md:pt-8 md:pb-32 bg-transparent">

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-20 gap-6">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="font-bold tracking-[0.4em] uppercase text-xs block mb-4"
              style={{ color: "#52B788" }}
            >
              Exquisite Craftsmanship
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif leading-tight"
              style={{ color: "#2D2D2D" }}
            >
              Curated{" "}
              <span
                className="italic font-light"
                style={{
                  background: "linear-gradient(135deg, #FF9E80, #E8603C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Collections
              </span>
            </motion.h3>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-lg max-w-xs border-l pl-6 mb-2"
            style={{ color: "#7A8A82", borderColor: "rgba(82,183,136,0.3)" }}
          >
            Handpicked treasures designed to resonate with your unique story.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {collections.map((collection, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`relative ${collection.size} overflow-hidden group rounded-[2rem] shadow-2xl shadow-black/10`}
            >
              <motion.img
                style={{ y: backgroundY }}
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(to top, rgba(45,45,45,0.9) 0%, rgba(45,45,45,0.2) 50%, transparent 100%)"
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-20"
                >
                  <h4 className="text-lg md:text-4xl font-serif text-white mb-1 md:mb-3 group-hover:translate-x-2 transition-transform duration-500">
                    {collection.name}
                  </h4>
                  <p className="text-white/80 text-xs md:text-lg mb-3 md:mb-8 max-w-sm transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 line-clamp-2 md:line-clamp-none">
                    {collection.desc}
                  </p>
                  <Button
                    asChild
                    className="rounded-full px-4 py-2 md:px-8 md:py-6 text-xs md:text-base flex items-center gap-2 group/btn transition-all w-fit border-0"
                    style={{ background: "rgba(255,255,255,0.92)", color: "#2D2D2D" }}
                  >
                    <Link href={`/collections?name=${encodeURIComponent(collection.name)}`}>
                      <span className="hidden md:inline">Explore Collection</span>
                      <span className="md:hidden">Explore</span>
                      <ArrowUpRight size={16} className="group-hover/btn:rotate-45 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Hover border */}
              <div className="absolute inset-4 border border-white/20 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}