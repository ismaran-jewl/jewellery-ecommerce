"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
const products = [
  {
    id: 1,
    name: "Royal Gold Necklace",
    price: "₹24,999",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Diamond Stud Earrings",
    price: "₹12,499",
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Elegant Gold Ring",
    price: "₹8,999",
    image: "/images/product3.jpg",
  },
  {
    id: 4,
    name: "Luxury Bracelet",
    price: "₹14,999",
    image: "/images/product4.jpg",
  },
  {
    id: 5,
    name: "Pearl Drop Earrings",
    price: "₹6,999",
    image: "/images/product5.jpg",
  },
  {
    id: 6,
    name: "Classic Gold Chain",
    price: "₹18,499",
    image: "/images/product6.jpg",
  },
];

export default function AllJewelleryPage() {
  return (
    <main className="bg-[#0a0a0a] text-[#C59D5F] min-h-screen">

      {/* Header */}
      <section className="py-20 text-center border-b border-[#C59D5F]/20">
        <h1 className="text-4xl md:text-6xl font-serif tracking-wide">
          All Jewellery
        </h1>
        <p className="mt-4 text-[#d6c3a3] text-lg">
          Discover timeless elegance crafted for every occasion.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="flex justify-between items-center px-8 py-6 border-b border-[#C59D5F]/20">
        <p className="text-sm tracking-wide">{products.length} Products</p>

        <select className="bg-black border border-[#C59D5F]/30 px-4 py-2 text-sm focus:outline-none">
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </section>

      {/* Products Grid */}
      <section className="px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
  {products.map((product) => (
    <Link key={product.id} href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group bg-[#111] p-6 rounded-xl border border-[#C59D5F]/10 hover:border-[#C59D5F]/40 transition cursor-pointer"
      >
        {/* Image */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Info */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white">
            {product.name}
          </h3>
          <p className="mt-2 text-[#C59D5F] text-md">
            {product.price}
          </p>
        </div>
      </motion.div>
    </Link>
  ))}
</section>


      
    </main>
  );
}
