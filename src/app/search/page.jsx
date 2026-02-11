"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { products } from "@/data/products"; 
import Link from "next/link";
import { Heart, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);

  // Simulate a premium loading feel
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Featured items for empty states or sidebars
  const trendingItems = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FCFCFC] text-black pb-20">
      
      {/* 1. HERO HEADER */}
      <div className="pt-24 pb-16 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-6">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <span className="text-black">Search Results</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              {query ? (
                <>Results for <span className="italic serif text-[#C59D5F]">&ldquo;{query}&rdquo;</span></>
              ) : (
                "Our Collections"
              )}
            </h1>
          </div>
          
          {/* Filters Bar */}
          <div className="flex items-center gap-8 border-b border-neutral-200 pb-2">
            <button className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold hover:text-[#C59D5F] transition-colors">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold hover:text-[#C59D5F] transition-colors">
              Sort By <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        {loading ? (
          /* SKELETON LOADING */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-neutral-100 animate-pulse" />
                <div className="h-4 w-2/3 bg-neutral-100 animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* 2. ENGAGING EMPTY STATE */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-light mb-4">The piece you're looking for is currently a mystery.</h3>
              <p className="text-neutral-500 text-sm mb-10 leading-relaxed">
                We couldn't find matches for "{query}". Explore our most coveted pieces instead or chat with a diamond expert.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {trendingItems.map(item => (
                   <Link key={item.id} href={`/product/${item.id}`} className="group">
                      <div className="aspect-square relative overflow-hidden mb-3">
                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <p className="text-[10px] uppercase tracking-tighter truncate">{item.name}</p>
                   </Link>
                 ))}
              </div>

              <Link
                href="/collections"
                className="inline-block bg-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#C59D5F] transition-all"
              >
                Browse All Jewellery
              </Link>
            </div>
          </div>
        ) : (
          /* 3. PREMIUM GRID */
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-20">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                {/* Product Image Card */}
                <div className="relative aspect-[4/5] bg-[#F3F3F3] overflow-hidden mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Heart / Wishlist Icon */}
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-neutral-400 hover:text-red-500">
                    <Heart size={16} />
                  </button>

                  {/* Elegant "Quick Add" floating button */}
                  <div className="absolute inset-x-0 bottom-6 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-black/90 text-white px-6 py-2 text-[9px] uppercase tracking-widest font-bold backdrop-blur-sm hover:bg-[#C59D5F]">
                      Explore Details
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C59D5F] font-bold mb-2">
                    {product.category}
                  </span>
                  <h2 className="text-sm md:text-base font-light tracking-wide text-center group-hover:text-neutral-600 transition-colors">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="h-[1px] w-4 bg-neutral-300"></span>
                    <p className="text-sm font-medium">
                      ${product.price.toLocaleString()}
                    </p>
                    <span className="h-[1px] w-4 bg-neutral-300"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. NEWSLETTER / ENGAGEMENT STRIP */}
      <div className="mt-32 py-20 bg-neutral-900 text-white text-center px-6">
        <h4 className="serif italic text-3xl mb-4">Stay in the sparkle.</h4>
        <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] mb-8">Join the Ismarn Circle for exclusive access to new drops.</p>
        <div className="max-w-md mx-auto flex border-b border-neutral-700">
            <input type="email" placeholder="Your Email Address" className="bg-transparent w-full py-3 outline-none text-sm" />
            <button className="uppercase text-[10px] tracking-widest font-bold text-[#C59D5F]">Join</button>
        </div>
      </div>
    </div>
  );
}