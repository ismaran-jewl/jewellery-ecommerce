"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { apiUrl } from "@/lib/fetcher";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl("/api/products"));
        if (response.ok) {
          const data = await response.json();
          const productsArray = Array.isArray(data) ? data : data.products;
          if (Array.isArray(productsArray) && productsArray.length > 0) {
            setProducts(productsArray.slice(0, 3));
            setLoading(false);
            return;
          }
        }
      } catch (err) {}

      setProducts([
        { id: 1, name: "Peach Sapphire Solitaire", price: "1,20,000", image: "https://i.pinimg.com/1200x/11/40/f9/1140f9933b0c265cd646744b5c00ac18.jpg" },
        { id: 2, name: "Rose Gold Temple Set", price: "85,000", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" },
        { id: 3, name: "Blush Emerald Drops", price: "60,000", image: "https://images.unsplash.com/photo-1635767791022-343cb72909c4" },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;
    setAddingProductId(productId);
    await addToCart(product, 1);
    setAddingProductId(null);
    setAddedProductId(productId);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  if (loading) {
    return (
      /* bg-transparent — background comes from the seamless canvas in page.jsx */
      <section className="py-24 flex items-center justify-center bg-transparent">
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#E07040" }} />
      </section>
    );
  }

  return (
    /* bg-transparent — background comes from the seamless canvas in page.jsx */
    <section className="relative py-10 md:py-32 overflow-hidden bg-transparent">

      <div className="container mx-auto px-4 md:px-6 relative z-10">

        {/* Magazine Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-2 md:mb-4"
            >
              <motion.span
                variants={{ hidden: { scaleX: 0, originX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: "circOut" } } }}
                className="h-px w-8"
                style={{ background: "rgba(224,112,64,0.5)" }}
              />
              <motion.div
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="flex overflow-hidden"
              >
                {["Editor's", "Choice"].map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden">
                    <motion.span
                      variants={{
                        hidden: { y: "100%" },
                        visible: { y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                      }}
                      className="text-xs font-bold uppercase tracking-[0.3em] inline-block mr-2"
                      style={{ color: "rgba(180,90,40,0.8)" }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="text-3xl md:text-6xl lg:text-7xl font-serif leading-[0.9]"
              style={{ color: "#2D2D2D" }}
            >
              <span className="inline-block overflow-hidden">
                <motion.span variants={{ hidden: { y: "100%" }, visible: { y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } } }} className="inline-block">The</motion.span>
              </span>{" "}
              <span className="inline-block overflow-hidden">
                <motion.span
                  variants={{ hidden: { y: "100%" }, visible: { y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } } }}
                  className="italic font-light inline-block"
                  style={{ color: "#E07040" }}
                >
                  Signature
                </motion.span>
              </span>
              <br />
              <span className="inline-block overflow-hidden">
                <motion.span variants={{ hidden: { y: "100%" }, visible: { y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } } }} className="inline-block">Collection</motion.span>
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:max-w-xs"
          >
            <p
              className="text-xs md:text-sm leading-relaxed border-l-2 pl-4"
              style={{ color: "#7A8A82", borderColor: "rgba(82,183,136,0.3)" }}
            >
              A curation of our most exquisite pieces, designed to define moments and transcend trends.
            </p>
          </motion.div>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 auto-rows-[180px] md:auto-rows-[300px]">
          {products.map((product, idx) => {
            const isFeatured = idx === 0;
            const gridClasses = isFeatured
              ? "col-span-2 md:col-span-2 md:row-span-2"
              : "col-span-1 md:col-span-1 md:row-span-1";

            return (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                className={`group relative rounded-[2rem] overflow-hidden ${gridClasses}`}
              >
                <div className="absolute inset-0 bg-stone-100">
                  <Link href={`/product/${product._id || product.id}`} className="block w-full h-full">
                    <img
                      src={product.image || product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </Link>
                </div>

                {/* Glass Card */}
                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4">
                  <div className="relative overflow-hidden rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 p-5 md:p-6 text-white shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        {isFeatured && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD4C2] animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD4C2]">Featured</span>
                          </div>
                        )}
                        <Link href={`/product/${product._id || product.id}`}>
                          <h3 className={`font-serif ${isFeatured ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"} leading-none mb-1 truncate hover:text-[#FFD4C2] transition-colors`}>
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-white/80 font-medium text-sm md:text-base">₹{product.price}</p>
                      </div>

                      <Button
                        onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
                        size="icon"
                        className={`rounded-full shrink-0 transition-all duration-300 ${isFeatured ? "h-12 w-12" : "h-10 w-10"} bg-white text-slate-900 hover:bg-[#FFE8D6] border-0`}
                        disabled={addingProductId === (product._id || product.id)}
                      >
                        {addingProductId === (product._id || product.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : addedProductId === (product._id || product.id) ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" style={{ color: "#E07040" }} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="mt-8 md:mt-12 flex justify-center">
          <Link href="/shop">
            <Button
              variant="ghost"
              className="group hover:bg-transparent"
              style={{ color: "#7A8A82" }}
            >
              <span
                
  className="text-xs font-bold uppercase tracking-[0.25em] border-b border-transparent pb-1 transition-all"
  style={{ "--hover-color": "#E07040" }}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E07040"; e.currentTarget.style.color = "#E07040"; }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.color = "#7A8A82"; }}
>
                View Full Collection
              </span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}