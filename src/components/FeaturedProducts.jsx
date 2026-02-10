"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredProducts = [
  { name: "Diamond Solitaire Ring", price: "₹1,20,000", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800" },
  { name: "Gold Temple Necklace", price: "₹85,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" },
  { name: "Emerald Drop Earrings", price: "₹60,000", image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4?auto=format&fit=crop&q=80&w=800" },
  { name: "Rose Gold Bangle", price: "₹45,000", image: "https://images.unsplash.com/photo-1573408302355-4e0b779be163?auto=format&fit=crop&q=80&w=800" },
];

export default function FeaturedProducts() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div className="text-left">
          <span className="text-[#C59D5F] font-medium tracking-widest uppercase text-xs">New Arrivals</span>
          <h3 className="text-3xl md:text-4xl font-serif mt-2">The Season's Best</h3>
        </div>
        <Button variant="link" className="text-[#C59D5F] group">
          View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredProducts.map((product, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} className="group">
            <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-neutral-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <Button size="sm" className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 text-black hover:bg-white rounded-none">
                Quick View
              </Button>
            </div>
            <h4 className="font-medium text-lg mb-1">{product.name}</h4>
            <p className="text-[#C59D5F] font-semibold">{product.price}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
