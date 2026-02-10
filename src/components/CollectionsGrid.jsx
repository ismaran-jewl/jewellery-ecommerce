"use client";

import { Button } from "@/components/ui/button";

const collections = [
  { name: "The Bridal Suite", desc: "Timeless pieces for your big day", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800" },
  { name: "Modern Minimalist", desc: "Everyday luxury for the office", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800" },
  { name: "Royal Heritage", desc: "Inspired by ancient craftsmanship", image: "https://images.unsplash.com/photo-1617033935328-82aa5819c674?auto=format&fit=crop&q=80&w=800" },
];

export default function CollectionsGrid() {
  return (
    <section className="py-24 bg-[#F8C8DC]">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl md:text-4xl font-serif text-center mb-16 underline underline-offset-[12px] decoration-[#C59D5F]/30">
          Curated Collections
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {collections.map((collection, i) => (
            <div key={i} className="relative h-[500px] overflow-hidden group cursor-pointer">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h4 className="text-2xl font-serif mb-2">{collection.name}</h4>
                <p className="text-sm text-white/70 mb-4">{collection.desc}</p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none transition-colors">
                  Explore
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
