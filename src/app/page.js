"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Gem, ShieldCheck, Truck, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold tracking-tight">
            💎 JewelleryMart
          </h1>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-primary">Home</a>
            <a href="#" className="hover:text-primary">Collections</a>
            <a href="#" className="hover:text-primary">About</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </nav>
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Shop Now
          </Button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="container mx-auto py-20 text-center">
        <Badge className="mb-4">Luxury • Trust • Craftsmanship</Badge>
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Discover Timeless <span className="text-primary">Jewellery</span>
        </h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
          Buy and sell premium gold, diamond, and custom jewellery crafted
          with elegance and authenticity.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Explore Collection</Button>
          <Button size="lg" variant="outline">Sell Jewellery</Button>
        </div>
      </section>

      <Separator />

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto py-20 grid md:grid-cols-4 gap-6">
        <Feature
          icon={<Gem />}
          title="Certified Jewellery"
          desc="100% purity & authenticity guarantee"
        />
        <Feature
          icon={<ShieldCheck />}
          title="Secure Payments"
          desc="Protected & encrypted transactions"
        />
        <Feature
          icon={<Truck />}
          title="Fast Delivery"
          desc="Insured doorstep delivery"
        />
        <Feature
          icon={<Star />}
          title="Premium Quality"
          desc="Crafted by expert artisans"
        />
      </section>

      {/* ================= COLLECTIONS ================= */}
      <section className="bg-muted py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Popular Collections
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <CollectionCard
              title="Gold Collection"
              desc="Elegant gold jewellery for every occasion"
            />
            <CollectionCard
              title="Diamond Collection"
              desc="Luxury diamonds that shine forever"
            />
            <CollectionCard
              title="Wedding Specials"
              desc="Perfect jewellery for your big day"
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="container mx-auto py-20 text-center">
        <h3 className="text-4xl font-bold">
          Start Your Jewellery Journey Today
        </h3>
        <p className="mt-4 text-muted-foreground">
          Join thousands of happy customers buying and selling jewellery online.
        </p>
        <Button size="lg" className="mt-6">
          Get Started
        </Button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-2">JewelleryMart</h4>
            <p className="text-sm text-gray-400">
              Premium jewellery marketplace you can trust.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Home</li>
              <li>Shop</li>
              <li>Sell</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-400">
              Email: support@jewellerymart.com
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} JewelleryMart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon, title, desc }) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground mt-2">{desc}</p>
      </CardContent>
    </Card>
  );
}

function CollectionCard({ title, desc }) {
  return (
    <Card className="hover:shadow-xl transition">
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground mt-2">{desc}</p>
        <Button variant="outline" className="mt-4">
          View Collection
        </Button>
      </CardContent>
    </Card>
  );
}
