"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/**
 * RecentlyViewed — renders up to 5 recently viewed products
 * sourced from localStorage. Fetches product data from the API.
 * 
 * @param {string} [excludeId] — product ID to exclude (e.g., current product page)
 */
export default function RecentlyViewed({ excludeId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]")
        .filter((id) => id !== excludeId)
        .slice(0, 5);

      if (ids.length === 0) return;

      // Fetch each product in parallel
      Promise.all(
        ids.map((id) =>
          fetch(`/api/products/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      ).then((results) => {
        setProducts(results.filter(Boolean));
      });
    } catch {
      // localStorage access may fail in SSR or private browsing
    }
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-serif font-bold text-[#2d1a10] flex items-center gap-2 mb-5">
        <Clock className="w-4 h-4 text-[#C59D5F]" />
        Recently Viewed
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex-shrink-0 w-36 group"
          >
            <Link href={`/product/${product._id}`}>
              <div className="aspect-square rounded-xl overflow-hidden bg-[#fdf6ef] border border-[#ede3d8] group-hover:border-[#c4a882] transition-colors">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mt-2 px-1">
                <p className="text-xs font-semibold text-[#2d1a10] truncate group-hover:text-[#C59D5F] transition-colors">
                  {product.name}
                </p>
                <p className="text-xs font-bold text-[#5c4632] mt-0.5">{fmt(product.price)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
