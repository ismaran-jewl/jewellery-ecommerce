"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Gem,
  ShieldCheck,
  Truck,
  Star,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-yellow-500/20">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-extrabold tracking-widest text-yellow-500">
            JEWELLERY<span className="text-white">MART</span>
          </h1>

          <nav className="hidden md:flex gap-8 text-sm tracking-wider">
            {["Home", "Collections", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-yellow-500 transition"
              >
                {item}
              </a>
            ))}
          </nav>

          <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop Now
          </Button>
        </div>
      </header>

      {/* ================= VIDEO HERO ================= */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/videos/jewellery.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-4xl px-6"
        >
          <Badge className="mb-6 bg-yellow-500 text-black">
            Luxury • Gold • Legacy
          </Badge>

          <h2 className="text-6xl md:text-8xl font-extrabold leading-tight">
            Crafted in <span className="text-yellow-500">Gold</span>
            <br /> Designed for Eternity
          </h2>

          <p className="mt-8 text-gray-300 text-lg">
            Discover premium gold & diamond jewellery — designed to define
            elegance, power, and timeless beauty.
          </p>

          <div className="mt-12 flex justify-center gap-6">
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
              Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500">
              Sell Jewellery
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ================= TRUST METRICS ================= */}
      <section className="container mx-auto py-24 grid md:grid-cols-4 gap-8">
        <Feature icon={<Gem />} title="Certified Gold" desc="100% purity & hallmark assurance" />
        <Feature icon={<ShieldCheck />} title="Secure Payments" desc="Bank-grade encrypted checkout" />
        <Feature icon={<Truck />} title="Insured Delivery" desc="Fast & protected shipping" />
        <Feature icon={<Star />} title="Elite Craftsmanship" desc="Designed by master artisans" />
      </section>

      <Separator className="bg-yellow-500/20" />

      {/* ================= COLLECTION SHOWCASE ================= */}
      <section className="py-24">
        <h3 className="text-center text-5xl font-extrabold mb-16">
          Signature <span className="text-yellow-500">Collections</span>
        </h3>

        <div className="container mx-auto grid md:grid-cols-3 gap-12">
          <CollectionCard title="Gold Royal" image="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed" />
          <CollectionCard title="Diamond Luxe" image="https://images.unsplash.com/photo-1605100804763-247f67b3557e" />
          <CollectionCard title="Wedding Heirloom" image="https://images.unsplash.com/photo-1585386959984-a41552231693" />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-br from-black via-neutral-900 to-black py-24 text-center">
        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold"
        >
          Your Legacy Begins Here
        </motion.h3>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto">
          Join thousands who trust JewelleryMart for elegance, value & authenticity.
        </p>

        <Button size="lg" className="mt-10 bg-yellow-500 text-black hover:bg-yellow-400">
          Get Started
        </Button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black border-t border-yellow-500/20 py-12">
        <div className="container mx-auto grid md:grid-cols-3 gap-8 text-gray-400">
          <div>
            <h4 className="text-yellow-500 font-bold mb-2">JewelleryMart</h4>
            <p className="text-sm">
              Premium jewellery marketplace built on trust & luxury.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li>Home</li>
              <li>Shop</li>
              <li>Sell</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Contact</h4>
            <p className="text-sm">support@jewellerymart.com</p>
          </div>
        </div>

        <p className="text-center text-xs mt-8 text-gray-600">
          © {new Date().getFullYear()} JewelleryMart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Feature({ icon, title, desc }) {
  return (
    <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200 }}>
      <Card className="bg-neutral-900 border-yellow-500/20 text-center">
        <CardContent className="pt-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
            {icon}
          </div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-gray-400 mt-3">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CollectionCard({ title, image }) {
  return (
    <motion.div whileHover={{ scale: 1.08 }}>
      <Card className="bg-neutral-900 overflow-hidden border-yellow-500/20 cursor-pointer">
        <div
          className="h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardContent className="p-6 text-center">
          <h4 className="text-2xl font-semibold">{title}</h4>
          <Button className="mt-6 bg-yellow-500 text-black hover:bg-yellow-400 w-full">
            View Collection
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
