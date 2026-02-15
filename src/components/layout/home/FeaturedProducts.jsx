"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.slice(0, 3));
            setLoading(false);
            return;
          }
        }
      } catch (err) { /* silent fallback */ }

      setProducts([
        { id: 1, name: "Peach Sapphire Solitaire", price: "1,20,000", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e" },
        { id: 2, name: "Rose Gold Temple Set", price: "85,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" },
        { id: 3, name: "Blush Emerald Drops", price: "60,000", image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4" },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">

        {/* Modern Minimal Header */}
        <div className="mb-10 text-left md:text-center">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">New Arrivals</span>
          <h2 className="text-3xl md:text-5xl font-serif mt-2 italic">The Featured Edit</h2>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group border-none shadow-none bg-transparent">

              {/* Image Container: 40vh on mobile, fixed aspect ratio on desktop */}
              {/* Image Container: Shrink size but keep it sharp */}
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-slate-100 shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Box */}
              <CardContent className="px-1 py-4 flex flex-col items-start">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-slate-900 tracking-tight leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 font-light">
                      ₹{product.price}
                    </p>
                  </div>

                  {/* Small Action Button */}
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Desktop-only full button for better UX on large screens */}
                <Link href={`/product/${product.id}`} className="hidden sm:block w-full mt-4">
                  <Button className="w-full rounded-full py-6 font-semibold uppercase tracking-tighter shadow-lg shadow-primary/20">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}