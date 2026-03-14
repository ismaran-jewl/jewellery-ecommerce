"use client";

import { motion } from "framer-motion";
import { Ruler, Sparkles, AlertCircle, Info, Maximize, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RING_SIZES = [
  { in: 5, mm: 15.7, us: "J ½" },
  { in: 6, mm: 16.5, us: "L ½" },
  { in: 7, mm: 17.3, us: "N ½" },
  { in: 8, mm: 18.1, us: "P ½" },
  { in: 9, mm: 19.0, us: "R ½" },
  { in: 10, mm: 19.8, us: "T ½" },
];

const NECKLACE_SIZES = [
  { label: "Collar", size: "12-13\"", desc: "Sits tightly around the neck." },
  { label: "Choker", size: "14-16\"", desc: "Sits at the base of the neck." },
  { label: "Princess", size: "17-19\"", desc: "Sits on the collarbone." },
  { label: "Matinee", size: "20-24\"", desc: "Sits between collarbone and bust." },
];

export default function SizeGuidePage() {
  return (
    <main 
      className="pb-24 pt-12 md:pt-20 min-h-screen"
      style={{
        background: "linear-gradient(160deg, #FFF5F0 0%, #F0FAF4 35%, #FFF8F5 60%, #F2FAF6 100%)"
      }}
    >
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Editorial Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex p-4 rounded-full bg-white shadow-xl shadow-orange-500/5 border border-orange-100/50"
          >
            <Ruler className="w-8 h-8" style={{ color: "#E07040" }} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-stone-900 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Perfect <em className="italic font-light" style={{ color: "#E07040" }}>Proportions</em>
          </motion.h1>
          
          <p className="text-stone-500 font-serif italic text-lg max-w-xl mx-auto">
            "Beauty is in the details, but elegance is in the fit. Ensure your chosen treasure sits perfectly with our comprehensive measurement guide."
          </p>
        </div>

        {/* Measurement Content */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: General Tips */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-xl"
            >
               <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
                 <AlertCircle className="w-5 h-5 text-orange-400" />
                 Pro Tips
               </h3>
               <ul className="space-y-6">
                 {[
                   "Measure at the end of the day when your fingers are warm.",
                   "When in between sizes, we always recommend sizing up.",
                   "Consider the width of the band; wider bands feel tighter."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                      <p className="text-xs font-semibold text-stone-600 leading-relaxed uppercase tracking-wider">{tip}</p>
                   </li>
                 ))}
               </ul>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-stone-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden"
            >
               <Sparkles className="absolute -top-4 -right-4 w-20 h-20 text-orange-400/20" />
               <h3 className="text-lg font-bold mb-4">Still Unsure?</h3>
               <p className="text-sm text-stone-400 mb-6">
                 Contact our concierge for a physical sizing kit, delivered to your doorstep complimentary.
               </p>
               <button className="text-xs font-bold uppercase tracking-widest text-orange-400 hover:text-orange-300 transition-colors">
                 Request Kit →
               </button>
            </motion.div>
          </div>

          {/* Right: Size Tables */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white/40 backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-12 border border-white/60 shadow-2xl"
          >
            <Tabs defaultValue="rings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-stone-100 p-1 mb-10">
                <TabsTrigger value="rings" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-stone-900 font-bold uppercase tracking-widest text-[10px]">Ring Sizing</TabsTrigger>
                <TabsTrigger value="necklaces" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-stone-900 font-bold uppercase tracking-widest text-[10px]">Necklaces</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rings" className="space-y-8">
                <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-inner">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Indian Size</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Diameter (mm)</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">UK/US Equivalent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {RING_SIZES.map((size, i) => (
                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-stone-900">{size.in}</td>
                          <td className="px-6 py-4 text-stone-500 font-medium">{size.mm} mm</td>
                          <td className="px-6 py-4 text-orange-600 font-bold tracking-tight">{size.us}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4">
                   <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                   <p className="text-xs text-emerald-800 leading-relaxed italic">
                     "Measuring tip: Wrap a string around your finger, mark the overlap, and measure the string against a ruler for the circumference."
                   </p>
                </div>
              </TabsContent>

              <TabsContent value="necklaces" className="space-y-6">
                 <div className="grid gap-4">
                    {NECKLACE_SIZES.map((nec, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-stone-100 group hover:border-orange-200 transition-all">
                         <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                               <Maximize className="w-5 h-5" />
                            </div>
                            <div>
                               <h4 className="font-bold text-stone-900 uppercase tracking-widest text-xs">{nec.label}</h4>
                               <p className="text-xs text-stone-400">{nec.desc}</p>
                            </div>
                         </div>
                         <span className="text-xl font-black text-stone-300 group-hover:text-orange-200 transition-colors">{nec.size}</span>
                      </div>
                    ))}
                 </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
