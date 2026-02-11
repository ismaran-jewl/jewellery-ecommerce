"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Royal Gold Necklace",
    price: "₹24,999",
    image: "/images/product1.jpg",
    description:
      "A handcrafted royal gold necklace designed for weddings and grand occasions. Made with premium 22K gold finish.",
  },
  {
    id: 2,
    name: "Diamond Stud Earrings",
    price: "₹12,499",
    image: "/images/product2.jpg",
    description:
      "Elegant diamond studs crafted for timeless beauty and everyday luxury.",
  },
  {
    id: 3,
    name: "Elegant Gold Ring",
    price: "₹8,999",
    image: "/images/product3.jpg",
    description:
      "Minimal yet luxurious gold ring perfect for gifting and special celebrations.",
  },
  {
    id: 4,
    name: "Luxury Bracelet",
    price: "₹14,999",
    image: "/images/product4.jpg",
    description:
      "Premium bracelet with a modern luxury design for stylish elegance.",
  },
  {
    id: 5,
    name: "Pearl Drop Earrings",
    price: "₹6,999",
    image: "/images/product5.jpg",
    description:
      "Classic pearl earrings crafted to enhance grace and sophistication.",
  },
  {
    id: 6,
    name: "Classic Gold Chain",
    price: "₹18,499",
    image: "/images/product6.jpg",
    description:
      "Timeless gold chain suitable for daily wear and festive occasions.",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const product = products.find(
    (item) => item.id === Number(params.id)
  );

  if (!product) {
    return <div className="text-white p-20">Product Not Found</div>;
  }

  return (
    <main className="bg-[#0a0a0a] text-[#C59D5F] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-20">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-[#C59D5F] mb-10"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="rounded-xl w-full h-[500px] object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-serif text-white">
              {product.name}
            </h1>

            <p className="mt-4 text-2xl text-[#C59D5F]">
              {product.price}
            </p>

            <p className="mt-6 text-[#d6c3a3] leading-relaxed">
              {product.description}
            </p>

            <Button
              className="mt-8 w-full bg-[#C59D5F] text-black hover:bg-[#d6b67a]"
            >
              <ShoppingBag size={18} className="mr-2" />
              Add to Bag
            </Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
