"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 z-40 ${
          isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSearchOpen(false)}
      />

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled || isSearchOpen
            ? "bg-white py-3 shadow-md"
            : "bg-white py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-50">
          
          {/* LEFT: Branding */}
          <div
            className="flex flex-col w-1/4 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <h1 className="tracking-[0.5em] text-xl md:text-2xl font-black text-black leading-none">
              ISMARN
            </h1>
            <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#C59D5F] mt-1">
              Fine Jewellery
            </p>
          </div>

          {/* CENTER: Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            {[
              { name: "All Jewellery", link: "/all-jewellery" },
              { name: "Gold", link: "/gold" },
              { name: "Diamond", link: "/diamond" },
              { name: "Bridal", link: "/bridal" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="relative text-[11px] uppercase tracking-[0.2em] font-semibold text-neutral-800 hover:text-[#C59D5F] transition-colors cursor-pointer group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#C59D5F] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center justify-end gap-5 w-1/4">
            
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-black hover:text-[#C59D5F] transition-colors p-2"
            >
              {isSearchOpen ? (
                <X size={20} />
              ) : (
                <Search size={20} strokeWidth={2} />
              )}
            </button>

            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

            {/* Cart */}
            <Link href="/cart">
              <button className="relative text-black group p-2">
                <ShoppingBag size={20} strokeWidth={2} />
                <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </Link>

            {/* Mobile Menu */}
            <button className="md:hidden text-black p-2">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`absolute left-0 w-full bg-white border-t border-neutral-100 overflow-hidden transition-all duration-500 ease-in-out z-40 ${
            isSearchOpen ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="max-w-3xl mx-auto px-6 py-8">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search collections, gems, or styles..."
                className="w-full text-xl font-light border-b border-neutral-300 py-2 outline-none focus:border-black transition-colors placeholder:text-neutral-300"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-3 text-neutral-400 hover:text-black transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="flex gap-4 mt-3">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                Trending:
              </span>
              {["Solitaire", "Tennis Bracelets", "Engagement"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-black underline underline-offset-4"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
