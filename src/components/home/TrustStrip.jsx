"use client";

import { Gem, ShieldCheck, Truck, Heart } from "lucide-react";

const trustItems = [
  { icon: Gem, title: "BIS Hallmarked", sub: "100% Certified Gold" },
  { icon: ShieldCheck, title: "Lifetime Exchange", sub: "Easy upgrades" },
  { icon: Truck, title: "Insured Shipping", sub: "Safe to your doorstep" },
  { icon: Heart, title: "Heritage Craft", sub: "Handmade with love" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {trustItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <item.icon className="mb-4 w-8 h-8 text-[#C59D5F] group-hover:scale-110 transition-transform" />
            <h5 className="font-semibold text-sm uppercase tracking-wider">{item.title}</h5>
            <p className="text-xs text-neutral-500 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
