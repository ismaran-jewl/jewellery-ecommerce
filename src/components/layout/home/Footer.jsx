"use client";

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function EnhancedFooter() {
  return (
    <footer className="relative w-full border-t bg-gradient-to-b from-white to-[#fcfaf8] overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#7c6a58]/30 to-transparent" />
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={footerVariants}
        className="container mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section - Takes 4 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="group cursor-default">
              <h2 className="text-3xl font-serif font-bold text-[#7c6a58] tracking-tight">
                ISMARN
              </h2>
              <div className="h-0.5 w-0 group-hover:w-20 bg-[#7c6a58] transition-all duration-500 ease-out" />
            </div>
            
            <p className="text-balance text-muted-foreground leading-relaxed max-w-sm">
              Crafting stories in gems and jewels. Join 50,000+ style enthusiasts receiving our weekly curation of elegance.
            </p>

            <div className="flex flex-col space-y-3">
               <div className="relative group max-w-sm">
                <Input 
                  placeholder="Your email address" 
                  className="pl-4 pr-12 py-6 border-[#7c6a58]/20 focus-visible:ring-[#7c6a58] rounded-full transition-all duration-300"
                />
                <Button 
                  size="icon" 
                  className="absolute right-1.5 top-1.5 rounded-full bg-[#7c6a58] hover:bg-[#5e4f42] h-9 w-9 transition-transform hover:scale-105"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground px-4">
                By subscribing, you agree to our Privacy Policy.
              </p>
            </div>
          </motion.div>

          {/* Links Sections - 2 columns each */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-widest text-xs">Collections</h4>
            <ul className="space-y-4">
              {["Shop All", "New Arrivals", "Best Sellers", "Custom Design"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#7c6a58] transition-all duration-300 flex items-center group">
                    <span className="bg-[#7c6a58] h-px w-0 group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4">
              {["Shipping Info", "Returns", "Order Tracking", "Size Guide"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-[#7c6a58] transition-all duration-300 flex items-center group">
                    <span className="bg-[#7c6a58] h-px w-0 group-hover:w-3 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section - 4 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-full bg-[#7c6a58]/5 group-hover:bg-[#7c6a58] group-hover:text-white transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>ismarn.jewls@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-full bg-[#7c6a58]/5 group-hover:bg-[#7c6a58] group-hover:text-white transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+1 (888) LUXE-GOLD</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="p-3 rounded-full border border-[#7c6a58]/10 text-[#7c6a58] hover:border-[#7c6a58] transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <Separator className="bg-[#7c6a58]/10" />

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ISMARN Boutique. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <a href="#" className="hover:text-[#7c6a58] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#7c6a58] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#7c6a58] transition-colors">Cookies</a>
          </div>

          <div className="flex items-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             {/* Simple SVG/Image Placeholders for Payment */}
            <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" title="Visa" />
            <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" title="Mastercard" />
            <div className="h-6 w-10 bg-slate-200 rounded animate-pulse" title="Amex" />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}