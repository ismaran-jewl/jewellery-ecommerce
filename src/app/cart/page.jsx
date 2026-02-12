"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMouseMoveCosmos } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, filter: "blur(10px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Royal Gold Necklace", price: 24999, image: "/images/product1.jpg", quantity: 1 },
    { id: 2, name: "Diamond Stud Earrings", price: 12499, image: "/images/product2.jpg", quantity: 1 },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    ));
  };

  const removeItem = (id) => setCartItems(items => items.filter(item => item.id !== id));
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThreshold = 50000;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <main className="bg-[#FFFAF5] text-[#2D3436] min-h-screen relative overflow-hidden selection:bg-[#D4AF37]/30">
      
      {/* --- ELEGANT DYNAMIC BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Rotating Mandala */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 opacity-[0.03] text-[#4A5D4E]"
        >
          <svg width="800" height="800" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
            <path d="M50 2 L50 98 M2 50 L98 50 M15 15 L85 85 M85 15 L15 85" stroke="currentColor" strokeWidth="0.05" />
          </svg>
        </motion.div>

        {/* Floating "Dust" Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute bg-[#D4AF37]/20 rounded-full blur-xl"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

     

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase mb-4 block">Your Selection</span>
            <h1 className="text-6xl md:text-8xl font-serif text-[#4A5D4E]">
              The <span className="italic font-light text-[#D4AF37]">Atelier</span> Bag
            </h1>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-3 gap-16 items-start">
          
          {/* --- LEFT: CART ITEMS --- */}
          <div className="lg:col-span-2">
            {/* Free Shipping Progress */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-10 p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60"
            >
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#4A5D4E] mb-3">
                <span>{subtotal >= shippingThreshold ? "Complimentary Express Shipping Unlocked" : `₹${(shippingThreshold - subtotal).toLocaleString()} away from free shipping`}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E0F2F1] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#D4AF37]"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {cartItems.length > 0 ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.8, x: -100 }}
                      whileHover={{ scale: 1.01 }}
                      key={item.id}
                      className="group relative bg-white/80 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white flex gap-8 items-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all"
                    >
                      <div className="relative w-32 h-32 shrink-0 group-hover:rotate-2 transition-transform duration-500">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-3xl bg-[#FDEBD0] shadow-inner" />
                        <motion.div 
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/5 rounded-3xl"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-serif text-[#4A5D4E] text-2xl mb-2">{item.name}</h3>
                        <p className="text-[#7A8A7D] text-xs uppercase tracking-tighter mb-4">Certified Handcrafted</p>
                        
                        <div className="flex items-center gap-8">
                          <div className="flex items-center bg-[#F8F9FA] rounded-full p-1 border border-neutral-100">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-[#D4AF37]"><Minus size={14}/></motion.button>
                            <span className="w-10 text-center font-medium tabular-nums">{item.quantity}</span>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-[#D4AF37]"><Plus size={14}/></motion.button>
                          </div>
                          <span className="text-[#4A5D4E] font-serif text-xl">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.2, color: "#ef4444" }}
                        onClick={() => removeItem(item.id)} 
                        className="text-neutral-300 transition-colors self-start mt-2"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white/40 rounded-[4rem] border border-dashed border-[#4A5D4E]/10">
                  <div className="relative inline-block mb-6">
                    <ShoppingBag className="text-[#4A5D4E]/20" size={80} />
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute -top-2 -right-2 text-[#D4AF37]">
                      <Sparkles size={24} />
                    </motion.div>
                  </div>
                  <h3 className="font-serif text-2xl text-[#4A5D4E] mb-2">Your Bag is Empty</h3>
                  <p className="text-[#7A8A7D] mb-8">Start your journey with our curated collections.</p>
                  <Link href="/shop">
                    <Button className="bg-[#4A5D4E] hover:bg-[#D4AF37] text-white rounded-full px-10 py-6 transition-all">
                      <ArrowLeft size={16} className="mr-2"/> Discover Pieces
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <motion.aside 
            layout
            className="bg-[#4A5D4E] text-white p-12 rounded-[3.5rem] h-fit lg:sticky lg:top-24 shadow-2xl shadow-[#4A5D4E]/30"
          >
            <h2 className="text-3xl font-serif mb-10 border-b border-white/10 pb-6">Order Details</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-white/60 uppercase tracking-widest text-[10px] font-bold">
                <span>Subtotal</span>
                <span className="text-white tabular-nums text-sm">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/60 uppercase tracking-widest text-[10px] font-bold">
                <span>Shipping</span>
                <span className="text-[#D4AF37]">Complimentary</span>
              </div>
              <div className="flex justify-between text-white/60 uppercase tracking-widest text-[10px] font-bold">
                <span>Insurance</span>
                <span className="text-white">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-12">
              <span className="text-xs uppercase tracking-widest font-bold opacity-50">Total Est.</span>
              <motion.span 
                key={subtotal}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-serif text-[#D4AF37]"
              >
                ₹{subtotal.toLocaleString()}
              </motion.span>
            </div>

            <Link href="/checkout">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  disabled={cartItems.length === 0} 
                  className="w-full bg-[#D4AF37] hover:bg-white hover:text-[#4A5D4E] text-[#4A5D4E] rounded-full py-10 uppercase tracking-[0.3em] text-xs font-black transition-all shadow-xl"
                >
                  Confirm Order <ArrowRight size={18} className="ml-3" />
                </Button>
              </motion.div>
            </Link>

            <p className="text-center text-[9px] uppercase tracking-widest mt-8 opacity-40 leading-relaxed">
              Every piece is hand-inspected and shipped in our signature atelier packaging.
            </p>
          </motion.aside>
        </div>
      </section>

      
    </main>
  );
}