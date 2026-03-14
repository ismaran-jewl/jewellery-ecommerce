"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Instagram, MessageCircle, Clock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Bespoke Voice Gifting",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Inquiry sent! Our concierge will contact you soon.");
        setFormData({ name: "", email: "", subject: "Bespoke Voice Gifting", message: "" });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Editorial Header */}
        <div className="mb-20">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-10" style={{ background: "#E07040" }} />
            <span className="text-[11px] font-bold uppercase tracking-[6px]" style={{ color: "#E07040" }}>Private Concierge</span>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-bold text-stone-900 leading-[0.9]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How Can We <br />
              <em className="italic font-light" style={{ color: "#E07040" }}>Serve You?</em>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-stone-500 font-serif italic text-xl md:text-2xl leading-relaxed"
            >
              "Whether it's a sizing query or a bespoke voice-gifting request, our artisans are here to assist."
            </motion.p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/60 shadow-2xl space-y-10"
            >
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Mailing Address</h4>
                  <p className="font-bold text-stone-900">boutique@ismarn.jewels</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Private Line</h4>
                  <p className="font-bold text-stone-900">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">The Atelier</h4>
                  <p className="font-bold text-stone-900">123, Rose Villa, MG Road, Mumbai</p>
                </div>
              </div>
            </motion.div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Instagram />, label: "@ismarn.jewels", color: "bg-orange-50" },
                 { icon: <MessageCircle />, label: "WhatsApp Chat", color: "bg-emerald-50" }
               ].map((item, i) => (
                 <div key={i} className={`p-6 rounded-3xl ${item.color} flex flex-col items-center justify-center gap-3 border border-white`}>
                    <div className="text-stone-700">{item.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{item.label}</span>
                 </div>
               ))}
            </div>

            <div className="flex items-center gap-3 px-8 py-4 bg-stone-900 rounded-2xl text-white">
               <Clock className="w-4 h-4 text-orange-400" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Typical response time: &lt; 2 Hours</span>
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 bg-white/60 backdrop-blur-3xl rounded-[3.5rem] p-8 md:p-16 border border-white/40 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Sparkles className="w-20 h-20 text-orange-600 rotate-12" />
            </div>

            <h3 className="text-3xl font-bold text-stone-900 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              Inquiry <span style={{ color: "#E07040" }}>Portal</span>
            </h3>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Your Name</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name" 
                    required
                    className="h-16 rounded-2xl border-stone-200 bg-white/50 focus:bg-white transition-all px-6"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Email Address</label>
                  <Input 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    placeholder="Enter email" 
                    required
                    className="h-16 rounded-2xl border-stone-200 bg-white/50 focus:bg-white transition-all px-6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Subject of Interest</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="flex h-16 w-full rounded-2xl border border-stone-200 bg-white/50 px-6 py-2 text-sm focus:bg-white transition-all outline-none"
                >
                  <option>Bespoke Voice Gifting</option>
                  <option>Order Status & Tracking</option>
                  <option>Repair & Restoration</option>
                  <option>Luxury Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-4">Detailed Message</label>
                <Textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our concierge help you?" 
                  required
                  className="min-h-[180px] rounded-3xl border-stone-200 bg-white/50 focus:bg-white transition-all px-6 py-6"
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase tracking-[4px] text-xs transition-transform active:scale-95 shadow-2xl disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Inquiry <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
