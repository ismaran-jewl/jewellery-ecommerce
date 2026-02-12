"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { CreditCard, MapPin, Wallet, Truck, Landmark, ShieldCheck } from "lucide-react";

// --- NEW COMPONENT FOR BACKGROUND BLOBS TO FIX HOOK ERROR ---
function BackgroundBlob({ index, springX, springY }) {
  // Hooks are now stable inside this sub-component
  const x = useTransform(springX, (v) => v * (index + 1) * -0.2);
  const y = useTransform(springY, (v) => v * (index + 1) * -0.2);

  return (
    <motion.div
      className="absolute rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20"
      style={{
        width: 100 + (index * 50),
        height: 100 + (index * 50),
        left: `${(index * 20) % 100}%`,
        top: `${(index * 15) % 100}%`,
        x,
        y,
      }}
    />
  );
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <main className="bg-[#FFFAF5] text-[#2D3436] min-h-screen relative overflow-hidden">
      
      {/* Fixed Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <BackgroundBlob key={i} index={i} springX={springX} springY={springY} />
        ))}
      </div>

     

      <div className="fixed left-12 top-1/2 -translate-y-1/2 z-50 flex items-end gap-3 pointer-events-none hidden xl:flex">
        <Minion type="bob" isPrivacy={isPrivacyMode} mX={springX} mY={springY} method={paymentMethod} />
        <Minion type="kevin" isPrivacy={isPrivacyMode} mX={springX} mY={springY} method={paymentMethod} />
        <Minion type="stuart" isPrivacy={isPrivacyMode} mX={springX} mY={springY} method={paymentMethod} />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-[#4A5D4E]">
            Secure <span className="italic font-light text-[#D4AF37]">Checkout</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white shadow-xl">
              <h2 className="text-2xl font-serif text-[#4A5D4E] mb-10 flex items-center gap-3">
                <MapPin className="text-[#D4AF37]" /> Delivery Details
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <FloatingInput label="First Name" />
                <FloatingInput label="Last Name" />
                <div className="md:col-span-2">
                  <FloatingInput label="Full Address" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border-2 border-white shadow-xl">
              <h2 className="text-2xl font-serif text-[#4A5D4E] mb-10 flex items-center gap-3">
                <Wallet className="text-[#D4AF37]" /> Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <PaymentOption active={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} icon={<CreditCard size={20} />} label="Card" />
                <PaymentOption active={paymentMethod === "upi"} onClick={() => setPaymentMethod("upi")} icon={<Landmark size={20} />} label="UPI" />
                <PaymentOption active={paymentMethod === "cod"} onClick={() => setPaymentMethod("cod")} icon={<Truck size={20} />} label="COD" />
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === "card" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="space-y-6"
                    onFocusCapture={() => setIsPrivacyMode(true)}
                    onBlurCapture={() => setIsPrivacyMode(false)}
                  >
                    <input type="text" placeholder="Card Number" className="w-full bg-white/50 border-2 border-[#E0F2F1] p-4 rounded-2xl outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="bg-white/50 border-2 border-[#E0F2F1] p-4 rounded-2xl outline-none" />
                      <input type="text" placeholder="CVV" className="bg-white/50 border-2 border-[#E0F2F1] p-4 rounded-2xl outline-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-2 bg-[#4A5D4E] text-white p-10 rounded-[4rem] shadow-2xl h-fit lg:sticky lg:top-24">
            <h3 className="text-2xl font-serif mb-10">Order Summary</h3>
            <div className="text-4xl font-serif text-[#D4AF37] mb-12">₹37,498</div>
            <Button className="w-full bg-[#D4AF37] text-[#4A5D4E] h-20 rounded-full font-black uppercase tracking-widest hover:bg-white transition-colors">
              Pay Now
            </Button>
          </aside>
        </div>
      </section>
     
    </main>
  );
}

// --- MINION COMPONENT (WITH BLACK OUTLINE & TRACKING) ---
function Minion({ type, isPrivacy, mX, mY, method }) {
  const configs = {
    bob: { h: "h-24", w: "w-16", eyes: 2, z: 10 },
    kevin: { h: "h-48", w: "w-20", eyes: 2, z: 30 },
    stuart: { h: "h-36", w: "w-22", eyes: 1, z: 20 }
  };
  const config = configs[type];

  const rY = useTransform(mX, [-50, 50], [-20, 20]);
  const rX = useTransform(mY, [-50, 50], [15, -15]);
  const pX = useTransform(mX, [-50, 50], [-5, 5]);
  const pY = useTransform(mY, [-50, 50], [-4, 4]);

  return (
    <motion.div 
      className={`relative ${config.h} ${config.w}`}
      style={{ zIndex: config.z, rotateY: isPrivacy ? 180 : rY, rotateX: isPrivacy ? 0 : rX }}
      animate={{ 
        y: (isPrivacy && type === "bob") ? 140 : (method === "upi" ? [0, -25, 0] : 0),
        x: (isPrivacy && type === "bob") ? 50 : 0,
        opacity: (isPrivacy && type === "bob") ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 12, y: { repeat: method === "upi" ? Infinity : 0, duration: 0.6 } }}
    >
      {/* Added border-[3px] border-black for outline */}
      <div className="w-full h-full bg-[#FCE029] rounded-full relative overflow-hidden border-[3px] border-black shadow-lg">
        <div className="absolute bottom-0 w-full h-1/3 bg-[#2D5DA7] border-t-[3px] border-black" />
        
        <div className="absolute top-1/4 w-full h-10 flex justify-center items-center">
          <div className="absolute w-full h-3 bg-[#333] border-y border-black" />
          {[...Array(config.eyes)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white border-[3px] border-[#999] rounded-full z-10 flex items-center justify-center overflow-hidden">
              <motion.div 
                style={{ x: pX, y: pY }}
                animate={{ scaleY: isPrivacy ? 0 : 1 }}
                className="w-3 h-3 bg-black rounded-full" 
              />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{
          rotateZ: method === "upi" ? -150 : (method === "cod" ? -45 : (isPrivacy && type === "kevin" ? -140 : 0)),
          y: (method === "upi" || (isPrivacy && type === "kevin")) ? -20 : 0
        }}
        className="absolute top-1/2 -left-2 w-2 h-10 bg-[#FCE029] rounded-full origin-top border-2 border-black"
      />
      <motion.div
        animate={{
          rotateZ: method === "upi" ? 150 : (method === "cod" ? 45 : (isPrivacy && type === "kevin" ? 140 : 0)),
          y: (method === "upi" || (isPrivacy && type === "kevin")) ? -20 : 0
        }}
        className="absolute top-1/2 -right-2 w-2 h-10 bg-[#FCE029] rounded-full origin-top border-2 border-black"
      />
    </motion.div>
  );
}

function FloatingInput({ label }) {
  return (
    <div className="relative w-full">
      <input type="text" placeholder=" " className="peer w-full bg-transparent border-b-2 border-[#B9D9C3] py-4 focus:outline-none focus:border-[#4A5D4E] transition-all" />
      <label className="absolute left-0 top-4 text-neutral-400 text-sm transition-all pointer-events-none peer-focus:text-xs peer-focus:-top-2 peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-top-2 uppercase tracking-widest font-bold">
        {label}
      </label>
    </div>
  );
}

function PaymentOption({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${active ? "border-[#4A5D4E] bg-[#4A5D4E] text-white" : "border-[#E0F2F1] text-[#4A5D4E] hover:border-[#D4AF37]"}`}>
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}