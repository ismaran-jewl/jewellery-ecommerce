"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function StorySection() {
  return (
    <section className="py-24 max-w-3xl mx-auto px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
        <Gem className="mx-auto mb-6 w-12 h-12 text-[#C59D5F] opacity-50" />
        <h3 className="text-4xl font-serif mb-6 italic">Jewellery That Tells Your Story</h3>
        <p className="text-neutral-600 leading-loose text-lg font-light">
          Founded on the principles of purity and artistry, Ismaran pieces are more than just accessories. 
          They are heirlooms crafted to celebrate your most precious moments, from grand weddings to 
          the quiet beauty of everyday life.
        </p>
        <div className="mt-10 h-[1px] w-24 bg-[#C59D5F] mx-auto" />
      </motion.div>
    </section>
  );
}
