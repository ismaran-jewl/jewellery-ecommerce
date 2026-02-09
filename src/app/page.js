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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            💎 JewelleryMart
          </h1>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {["Home", "Collections", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-primary transition"
              >
                {item}
              </a>
            ))}
          </nav>

          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop Now
          </Button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-black via-neutral-900 to-black text-white">
        <div className="container mx-auto py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4">Luxury • Trust • Craftsmanship</Badge>

            <h2 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Timeless <span className="text-primary">Jewellery</span>
            </h2>

            <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
              Buy, sell & explore premium gold, diamond and custom jewellery —
              crafted for elegance and legacy.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Sell Jewellery
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto py-20 grid md:grid-cols-4 gap-6">
        <Feature icon={<Gem />} title="Certified Jewellery" desc="Guaranteed purity & authenticity" />
        <Feature icon={<ShieldCheck />} title="Secure Payments" desc="End-to-end encrypted checkout" />
        <Feature icon={<Truck />} title="Fast Delivery" desc="Insured doorstep shipping" />
        <Feature icon={<Star />} title="Premium Craft" desc="Designed by master artisans" />
      </section>

      <Separator />

      {/* ================= COLLECTIONS ================= */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-14">
            Signature Collections
          </h3>

          <div className="grid md:grid-cols-3 gap-10">
            <CollectionCard
              title="Gold Collection"
              image="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed"
            />
            <CollectionCard
              title="Diamond Collection"
              image="https://images.unsplash.com/photo-1605100804763-247f67b3557e"
            />
            <CollectionCard
              title="Wedding Specials"
              image="https://images.unsplash.com/photo-1585386959984-a41552231693"
            />
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="container mx-auto py-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          Loved by Customers
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <Testimonial
            name="Ananya Sharma"
            text="Absolutely stunning jewellery. The quality exceeded my expectations!"
          />
          <Testimonial
            name="Rahul Mehta"
            text="Secure, fast delivery and beautiful craftsmanship. Highly recommended."
          />
          <Testimonial
            name="Neha Kapoor"
            text="Perfect wedding collection. I felt confident and elegant."
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-black text-white py-20 text-center">
        <h3 className="text-4xl font-bold">
          Begin Your Jewellery Story
        </h3>
        <p className="mt-4 text-gray-400">
          Join thousands who trust JewelleryMart for elegance & value.
        </p>
        <Button size="lg" className="mt-8">
          Get Started
        </Button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-neutral-950 text-gray-400 py-10">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold mb-2">JewelleryMart</h4>
            <p className="text-sm">
              A premium jewellery marketplace built on trust & luxury.
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

        <p className="text-center text-xs mt-8">
          © {new Date().getFullYear()} JewelleryMart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground mt-2">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CollectionCard({ title, image }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card className="overflow-hidden cursor-pointer">
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold">{title}</h4>
          <Button variant="outline" className="mt-4 w-full">
            View Collection
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Testimonial({ name, text }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="italic text-muted-foreground">“{text}”</p>
        <p className="mt-4 font-semibold">{name}</p>
      </CardContent>
    </Card>
  );
}
