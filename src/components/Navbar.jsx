"use client";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="tracking-[0.3em] text-sm font-semibold text-neutral-900">
          ISMARN
        </h1>

        <nav className="hidden md:flex gap-8 text-sm text-neutral-700">
          <a className="hover:text-black transition-colors cursor-pointer">All Jewellery</a>
          <a className="hover:text-black transition-colors cursor-pointer">Gold</a>
          <a className="hover:text-black transition-colors cursor-pointer">Diamond</a>
          <a className="hover:text-black transition-colors cursor-pointer">Bridal</a>
          <a className="hover:text-black transition-colors cursor-pointer">Collections</a>
        </nav>

        <Button variant="outline" size="sm" className="hover:bg-black/5 transition">
          Store Locator
        </Button>
      </div>
    </header>
  );
}
