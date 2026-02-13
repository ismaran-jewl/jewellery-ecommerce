"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Users,
  Cake,
  Search,
  ShoppingBag,
  CalendarHeart,
  Gift,
  Leaf,
  ChevronDown,
  User,
  Stars
} from "lucide-react";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const showMenu = (menu) => setActiveMenu(menu);
  const hideMenu = () => setActiveMenu(null);

  return (
    <div className="w-full fixed top-0 z-50">
      {/* HIGH VISIBILITY TOP BAR */}
      <div className="w-full bg-[#7FD1B9] text-white py-2 px-6 text-center text-xs font-bold tracking-widest uppercase">
        ✨ Free Express Shipping on Orders Over $150 • Shop New Arrivals ✨
      </div>

      <nav className="w-full bg-white text-[#2D3436] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* BRAND */}
          <Link href="/" className="text-3xl font-black tracking-tighter text-[#7FD1B9] hover:opacity-90 transition">
            ISMARN<span className="text-[#F8B8A6]">.</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-10 items-center font-bold text-[13px] uppercase tracking-wider">

            {/* SHOP DROPDOWN */}
            <div className="relative" onMouseEnter={() => showMenu("shop")} onMouseLeave={hideMenu}>
              <button className="flex items-center gap-1.5 hover:text-[#7FD1B9] transition py-2 border-b-2 border-transparent hover:border-[#7FD1B9]">
                Shop <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {activeMenu === "shop" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[46px] -left-10 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-b-xl p-8 w-[550px] border-t-4 border-[#7FD1B9] grid grid-cols-3 gap-10"
                  >
                    <div>
                      <h3 className="text-[#F8B8A6] font-black mb-4 text-[11px]">WOMEN</h3>
                      <ul className="space-y-3 text-gray-500 font-medium normal-case text-sm">
                        <li><Link href="/shop/women/rings" className="hover:text-black transition">Rings</Link></li>
                        <li><Link href="/shop/women/necklaces" className="hover:text-black transition">Necklaces</Link></li>
                        <li><Link href="/shop/women/earrings" className="hover:text-black transition">Earrings</Link></li>
                        <li><Link href="/shop/women/bangles" className="hover:text-black transition">Bangles</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-[#F8B8A6] font-black mb-4 text-[11px]">MEN</h3>
                      <ul className="space-y-3 text-gray-500 font-medium normal-case text-sm">
                        <li><Link href="/shop/men/rings" className="hover:text-black transition">Rings</Link></li>
                        <li><Link href="/shop/men/chains" className="hover:text-black transition">Chains</Link></li>
                        <li><Link href="/shop/men/bracelets" className="hover:text-black transition">Bracelets</Link></li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-[#7FD1B9] font-black mb-4 text-[11px]">CURATED</h3>
                      <ul className="space-y-3 text-gray-700 font-bold normal-case text-sm">
                        <li><Link href="/shop/diamond" className="flex items-center gap-2">💎 Diamonds</Link></li>
                        <li><Link href="/shop/gold" className="flex items-center gap-2">✨ 24K Gold</Link></li>
                        <li><Link href="/shop/bridal" className="flex items-center gap-2">💍 Bridal</Link></li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GIFTING DROPDOWN (Restored & Improved) */}
            <div className="relative" onMouseEnter={() => showMenu("gifting")} onMouseLeave={hideMenu}>
              <button className="flex items-center gap-2 hover:text-[#7FD1B9] transition py-2 border-b-2 border-transparent hover:border-[#7FD1B9]">
                <Gift size={16} /> Gifting <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {activeMenu === "gifting" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[46px] left-0 bg-white shadow-2xl rounded-b-xl p-6 w-80 border-t-4 border-[#F8B8A6]"
                  >
                    <div className="grid grid-cols-1 gap-1 text-gray-600 font-bold normal-case text-sm">
                      <h3 className="text-[#F8B8A6] font-black mb-3 text-[10px] tracking-widest">THE GIFT GUIDE</h3>
                      <Link href="/gifting/for-her" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition hover:text-[#7FD1B9]">
                        <Heart size={18} className="text-[#F8B8A6]"/> For Her
                      </Link>
                      <Link href="/gifting/for-him" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition hover:text-[#7FD1B9]">
                        <Users size={18} className="text-[#7FD1B9]"/> For Him
                      </Link>
                      <Link href="/gifting/birthday" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition hover:text-[#7FD1B9]">
                        <Cake size={18} className="text-[#F8B8A6]"/> Birthday Gifts
                      </Link>
                      <Link href="/gifting/anniversary" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition hover:text-[#7FD1B9]">
                        <Stars size={18} className="text-[#7FD1B9]"/> Anniversary
                      </Link>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Link href="/gift-card" className="flex items-center justify-center bg-[#FFF7F4] text-[#F8B8A6] py-2 rounded-lg hover:bg-[#F8B8A6] hover:text-white transition">
                          E-Gift Cards
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* OCCASION */}
            <div className="relative" onMouseEnter={() => showMenu("occasion")} onMouseLeave={hideMenu}>
              <button className="flex items-center gap-1.5 hover:text-[#7FD1B9] transition py-2 border-b-2 border-transparent hover:border-[#7FD1B9]">
                Occasions <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {activeMenu === "occasion" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[46px] left-0 bg-white shadow-2xl rounded-b-xl p-6 w-56 border-t-4 border-[#7FD1B9]"
                  >
                    <div className="flex flex-col gap-4 text-gray-600 font-bold normal-case text-sm">
                      <Link href="/shop/occasion/wedding" className="flex items-center gap-3 hover:text-[#7FD1B9] transition"><CalendarHeart size={18} className="text-[#F8B8A6]"/> Wedding</Link>
                      <Link href="/shop/occasion/engagement" className="hover:text-[#7FD1B9] transition pl-[30px]">Engagement</Link>
                      <Link href="/shop/occasion/anniversary" className="hover:text-[#7FD1B9] transition pl-[30px]">Anniversary</Link>
                      <Link href="/shop/occasion/birthday" className="hover:text-[#7FD1B9] transition pl-[30px]">Birthday</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MEMORIES */}
            <div className="relative" onMouseEnter={() => showMenu("memories")} onMouseLeave={hideMenu}>
              <button className="flex items-center gap-2 hover:text-[#7FD1B9] transition py-2 border-b-2 border-transparent hover:border-[#7FD1B9]">
                <Leaf size={16} className="text-[#7FD1B9]" /> Memories
              </button>
              <AnimatePresence>
                {activeMenu === "memories" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[46px] -right-20 w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                  >
                    <div className="flex h-[300px]">
                      <div className="relative w-5/12 overflow-hidden">
                        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                          <source src="/memories-video.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#7FD1B9] mb-1">Preserve</p>
                          <h2 className="text-lg font-bold leading-tight">Your Story, Forever.</h2>
                        </div>
                      </div>
                      <div className="w-7/12 p-8 flex flex-col justify-center space-y-4 text-gray-700 normal-case font-bold">
                        <Link href="/memories/our-story" className="hover:text-[#7FD1B9] transition flex items-center justify-between">Our Story <ChevronDown size={14} className="-rotate-90 opacity-30"/></Link>
                        <Link href="/memories/customer-stories" className="hover:text-[#7FD1B9] transition flex items-center justify-between">Community <ChevronDown size={14} className="-rotate-90 opacity-30"/></Link>
                        <Link href="/memories/upload" className="bg-[#2D3436] text-white py-3 px-6 rounded-lg text-center hover:bg-[#7FD1B9] transition mt-2 text-xs uppercase tracking-tighter">Upload Your Memory</Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/nfc-jewellery" className="flex items-center gap-2 bg-[#FFF7F4] text-[#F8B8A6] px-4 py-2 rounded-full hover:bg-[#F8B8A6] hover:text-white transition group">
              <Sparkles size={16} className="group-hover:animate-pulse"/> <span className="text-[11px]">NFC TECH</span>
            </Link>
          </div>

          {/* SEARCH + ACTIONS */}
          <div className="flex items-center gap-4 relative">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 mr-2 border border-transparent focus-within:border-[#7FD1B9] focus-within:bg-white transition">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-32 font-bold" />
            </div>

            <button className="p-2 hover:text-[#7FD1B9] transition">
              <User size={22} />
            </button>

            <Link href="/cart" className="p-2 hover:text-[#7FD1B9] transition relative group">
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full group-hover:bg-[#7FD1B9] transition">
                2
              </span>
            </Link>
          </div>

        </div>
      </nav>
      {/* Spacer */}
      <div className="h-[110px]"></div>
    </div>
  );
}