"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { apiUrl } from "@/lib/fetcher";
import { useSiteContent } from "@/hooks/useSiteContent";
import { FEATURED_PRODUCTS_FALLBACK } from "@/config/home";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);
  const { addToCart } = useCart();

  const { content: cms } = useSiteContent("featured_collection");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl("/api/products?homepageSection=Featured&limit=3"));
        if (response.ok) {
          const data = await response.json();
          const productsArray = Array.isArray(data) ? data : data.products;
          if (Array.isArray(productsArray) && productsArray.length > 0) {
            setProducts(productsArray);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }

      // Fallback
      setProducts(FEATURED_PRODUCTS_FALLBACK);
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

  const displayTitle = cms?.title || "The Signature Collection";
  const displaySub = cms?.subtitle || "A curation of our most exquisite pieces, designed to define moments and transcend trends.";

  return (
    /* bg-transparent — background comes from the seamless canvas in page.jsx */
    <section className="relative z-20 py-10 md:py-32 overflow-hidden bg-transparent">

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
                      {cms?.metadata?.accentWord || word}
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
              {cms?.title ? (
                <span dangerouslySetInnerHTML={{ __html: cms.title.replace("Signature", `<span class="italic font-light" style="color: #E07040;">Signature</span>`).replace(/\n/g, '<br />') }} />
              ) : (
                <>
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
                </>
              )}
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
              {displaySub}
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
            
            const productId = product._id || product.id;
            const linkHref = String(productId).length < 5 ? "/shop" : `/product/${productId}`;

            return (
              <motion.div
                key={productId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                className={`group relative rounded-[2rem] overflow-hidden ${gridClasses}`}
              >
                <div className="absolute inset-0 bg-stone-100">
                  <Link href={linkHref} className="block w-full h-full">
                    <img
                      src={product.image || product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                  </Link>
                </div>

                {/* Glass Card */}
                <div className="absolute inset-x-3 bottom-3 md:inset-x-4 md:bottom-4">
                  <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 md:p-6 text-white shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40 pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        {isFeatured && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD4C2] animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD4C2]">Featured</span>
                          </div>
                        )}
                        <Link href={linkHref}>
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
          <Link href="/featured">
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