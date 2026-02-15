"use client"

import { motion } from "framer-motion"
import {
  User,
  Heart,
  Clock,
  Star,
  Gift,
  Package,
  ChevronRight,
  ShoppingBag,
  CreditCard,
} from "lucide-react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F6] p-6 md:p-12 text-[#1B4D3E]">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-3xl p-8 shadow-sm flex justify-between items-start mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-serif font-bold"
            >
              Welcome Back, Sparkle ✨
            </motion.h1>
            <p className="text-[#1B4D3E]/60 mt-3 text-lg">
              Manage your luxury collection and account details.
            </p>
          </div>

          <div className="h-12 w-12 rounded-full border border-[#1B4D3E]/20 flex items-center justify-center">
            <User size={22} />
          </div>
        </div>

        {/* ================= QUICK STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <LuxuryStat
            title="Active Orders"
            value="2"
            secondary="12"
            secondaryLabel="Wishlist Items"
            icon1={Clock}
            icon2={Heart}
          />
          <LuxuryStat
            title="Order History"
            value="12"
            secondary="450"
            secondaryLabel="Rewards Points"
            icon1={Package}
            icon2={Star}
            highlight // This one gets a slightly more "blush" intensity
          />
          <LuxuryStat
            title="Reward Balance"
            value="450"
            secondary="24"
            secondaryLabel="Gift Cards"
            icon1={Star}
            icon2={Gift}
          />
        </div>

        {/* ================= MENU GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {menuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <ChevronRight size={18} className="opacity-40 group-hover:opacity-80" />
                  </div>

                  <p className="text-sm text-[#1B4D3E]/60">{item.desc}</p>

                  {/* glow circle */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#1B4D3E]/10 rounded-full blur-2xl" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Recent Activity */}
          <div>
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <Card className="rounded-2xl border-none shadow-sm relative overflow-hidden">
              <CardContent className="p-8">
                <div className="flex gap-4 mb-6">
                  <div className="p-3 bg-[#1B4D3E] text-white rounded-xl">
                    <Package size={22} />
                  </div>
                  <div className="p-3 bg-[#1B4D3E]/10 rounded-xl">
                    <Star size={22} />
                  </div>
                </div>

                <h4 className="text-lg font-semibold mb-2">Order #84920</h4>
                <p className="text-sm text-[#1B4D3E]/60">
                  Your "Eternal Diamond Ring" is out for delivery.
                </p>

                <ChevronRight className="absolute right-6 top-8 opacity-20" />

                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#1B4D3E]/10 rounded-full blur-3xl" />
              </CardContent>
            </Card>
          </div>

          {/* Exclusive Offer */}
          <div>
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Member Perks</h3>
            </div>

            {/* Changed gradient to Blush Pink/Rose tones */}
            <Card className="rounded-2xl border-none overflow-hidden relative text-[#1B4D3E] min-h-[280px] bg-gradient-to-br from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3] shadow-md">
              <CardContent className="p-10 relative z-10">
                <h3 className="text-2xl font-serif font-bold mb-3">
                  Exclusive Member Offer
                </h3>

                <p className="text-[#1B4D3E]/70 mb-8 max-w-xs">
                  You're 50 points away from a Silver Tier upgrade!
                </p>

                <div className="flex items-center gap-4">
                  {/* Button now matches the luxury green to contrast against the pink */}
                  <Button className="bg-[#1B4D3E] text-white rounded-full px-6 hover:bg-[#12382F] border-none">
                    Explore Collection
                  </Button>

                  <button className="flex items-center text-sm font-semibold hover:underline">
                    View Details →
                  </button>
                  <ShoppingBag size={36} className="text-[#1B4D3E]" />
                </div>

              </CardContent>

              {/* Subtle light overlay for extra "glow" */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ================== STAT CARD (FIXED FOR GREEN THEME) ================== */
function LuxuryStat({
  title,
  value,
  secondary,
  secondaryLabel,
  icon1: Icon1,
  icon2: Icon2,
  highlight = true,
}) {
  return (
    <Card
      className={`rounded-3xl border-none relative overflow-hidden transition-transform duration-300 ${highlight
        ? "bg-[#1B4D3E] text-white shadow-xl scale-105 z-10"
        : "bg-white text-[#1B4D3E] shadow-sm"
        }`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? "opacity-80" : "opacity-60"}`}>
            {title}
          </p>
          <ChevronRight size={16} className="opacity-40" />
        </div>

        <div className="flex items-center justify-between">
          {/* Left Side Stat */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${highlight ? "bg-white/10" : "bg-[#1B4D3E]/5"}`}>
              <Icon1 size={20} />
            </div>
            <span className="text-3xl font-serif font-bold leading-none">{value}</span>
          </div>

          {/* Vertical Divider */}
          <div className={`h-8 w-px ${highlight ? "bg-white/20" : "bg-[#1B4D3E]/10"}`} />

          {/* Right Side Stat */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex items-center justify-center ${highlight ? "bg-white/10" : "bg-[#1B4D3E]/5"}`}>
              <Icon2 size={20} />
            </div>
            <span className="text-3xl font-serif font-bold leading-none">{secondary}</span>
          </div>
        </div>

        <div className={`mt-4 flex justify-between text-[10px] uppercase tracking-widest font-bold ${highlight ? "opacity-70" : "opacity-50"}`}>
          <span>Status</span>
          <span>{secondaryLabel}</span>
        </div>

        <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full blur-2xl ${highlight ? "bg-white/10" : "bg-[#1B4D3E]/5"}`} />
      </CardContent>
    </Card>
  )
}
/* ================= MENU ITEMS ================= */

const menuItems = [
  {
    title: "My Profile",
    desc: "Manage your personal details",
    href: "/profile",
  },
  {
    title: "Addresses",
    desc: "Manage shipping locations",
    href: "/addresses",
  },
  {
    title: "Exclusive Member",
    desc: "Tier status & preferences",
    href: "/membership",
  },
  {
    title: "Gift Cards",
    desc: "Check balance & redeem",
    href: "/gift-cards",
  },
  {
    title: "Rewards",
    desc: "Points & transactions",
    href: "/rewards",
  },
  {
    title: "Settings",
    desc: "Security & account preferences",
    href: "/settings",
  },
]
