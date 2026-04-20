"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Mic, 
  Video, 
  Image as ImageIcon, 
  Type, 
  Sparkles, 
  CheckCircle2, 
  Music,
  ShoppingBag,
  Heart,
  Palette,
  ArrowRight,
  Monitor
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MediaCustomizer from "@/components/voice-gift/MediaCustomizer";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Sample Card Templates Linked to Real Product IDs
const CARD_TEMPLATES = [
  {
    id: "6990540bd03ba33b66ffa1df", // Real ID from DB
    name: "Platinum Sparkle Card",
    price: 499,
    description: "A premium holographic card with platinum foil accents.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80",
    theme: "modern",
  },
  {
    id: "6990540bd03ba33b66ffa1e0", // Real ID from DB
    name: "Royal Heritage Scroll",
    price: 799,
    description: "Traditional velvet finish scroll with gold leaf engraving.",
    image: "https://images.unsplash.com/photo-1549461754-8c14227ad9a6?auto=format&fit=crop&q=80",
    theme: "classic",
  },
  {
    id: "minimalist-gold-mockid",
    name: "Minimalist Gold Leaf",
    price: 399,
    description: "Simple, elegant ivory card with a single 24K gold leaf.",
    image: "https://images.unsplash.com/photo-1606206591513-adbf6da206f6?auto=format&fit=crop&q=80",
    theme: "minimal",
  }
];

export default function PersonalizedCardPage() {
  const [step, setStep] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [customization, setCustomization] = useState({
    recipient: "",
    message: "",
    font: "serif",
    color: "#1B4D3E",
    media: {
      audio: null,
      video: null,
      picture: null,
    }
  });

  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToBag = () => {
    if (!selectedCard) return;

    const productForCart = {
      _id: selectedCard.id,
      name: selectedCard.name,
      price: selectedCard.price,
      image: selectedCard.image,
    };

    addToCart(productForCart, 1, {
      ...customization,
      template: selectedCard.name,
    });

    toast.success("Added your personalized gift to the bag!");
    router.push("/cart");
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: "Select Card", icon: Sparkles },
    { title: "Media", icon: Music },
    { title: "Message", icon: Type },
    { title: "Preview", icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F6] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#1B4D3E] mb-4"
          >
            Create Your <span className="text-[#C59D5F]">Personalized</span> Gift
          </motion.h1>
          <p className="text-[#1B4D3E]/70 max-w-2xl mx-auto">
            Design a unique experience with voice notes, videos, and heartfelt messages.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#1B4D3E]/10 -z-10" />
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step > i + 1 ? "bg-[#1B4D3E] border-[#1B4D3E] text-white" :
                  step === i + 1 ? "bg-white border-[#C59D5F] text-[#C59D5F] shadow-lg" :
                  "bg-white border-[#1B4D3E]/10 text-[#1B4D3E]/30"
                }`}
                animate={step === i + 1 ? { scale: 1.1 } : { scale: 1 }}
              >
                <s.icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-xs font-medium ${step === i + 1 ? "text-[#1B4D3E]" : "text-[#1B4D3E]/40"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#1B4D3E]/5 min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CARD_TEMPLATES.map((template) => (
                    <Card 
                      key={template.id}
                      className={`overflow-hidden cursor-pointer group border-2 transition-all duration-300 ${
                        selectedCard?.id === template.id ? "border-[#C59D5F] ring-2 ring-[#C59D5F]/20" : "border-transparent hover:border-[#1B4D3E]/20"
                      }`}
                      onClick={() => setSelectedCard(template)}
                    >
                      <div className="relative aspect-[4/5]">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif text-lg font-bold text-[#1B4D3E] uppercase tracking-wide">{template.name}</h3>
                        <p className="text-sm text-[#1B4D3E]/60 line-clamp-2 mt-1">{template.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[#C59D5F] font-bold">₹{template.price}</span>
                          <Button variant="ghost" size="sm" className="text-[#1B4D3E]">Select <ArrowRight className="ml-2 w-4 h-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button 
                    disabled={!selectedCard}
                    onClick={nextStep}
                    className="bg-[#1B4D3E] hover:bg-[#143a2f] text-white px-8 py-6 rounded-full text-lg"
                  >
                    Continue to Customize <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <MediaCustomizer 
                  value={customization.media}
                  onUpdate={(media) => setCustomization({...customization, media})}
                />
                <div className="flex justify-between pt-8">
                  <Button variant="outline" onClick={prevStep} className="rounded-full px-8 py-6">Back</Button>
                  <Button 
                    onClick={nextStep}
                    className="bg-[#1B4D3E] hover:bg-[#143a2f] text-white px-8 py-6 rounded-full text-lg"
                  >
                    Continue to Message <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-[#1B4D3E]">Card Message</h3>
                  
                  <div className="space-y-2">
                    <Label className="text-[#1B4D3E]/60">Recipient Name</Label>
                    <Input 
                      placeholder="e.g. My Dearest Olivia" 
                      value={customization.recipient}
                      onChange={(e) => setCustomization({...customization, recipient: e.target.value})}
                      className="border-[#1B4D3E]/10 focus:border-[#C59D5F] rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#1B4D3E]/60">Your Heartfelt Message</Label>
                    <Textarea 
                      placeholder="Type your message here..." 
                      className="min-h-[150px] border-[#1B4D3E]/10 focus:border-[#C59D5F] rounded-2xl p-4"
                      value={customization.message}
                      onChange={(e) => setCustomization({...customization, message: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#1B4D3E]/60">Select Font</Label>
                      <Select 
                        value={customization.font}
                        onValueChange={(v) => setCustomization({...customization, font: v})}
                      >
                        <SelectTrigger className="rounded-xl border-[#1B4D3E]/10 h-12">
                          <SelectValue placeholder="Font Style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serif">Classic Serif</SelectItem>
                          <SelectItem value="sans">Modern Sans</SelectItem>
                          <SelectItem value="cursive">Elegant Cursive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#1B4D3E]/60">Text Color</Label>
                      <div className="flex gap-2">
                        {["#1B4D3E", "#C59D5F", "#B45309", "#4A1D1F"].map(color => (
                          <button 
                            key={color}
                            onClick={() => setCustomization({...customization, color})}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${customization.color === color ? "scale-125 border-gray-400" : "border-transparent"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Preview Side */}
                <div className="bg-[#FAF5F2] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm aspect-[4/5] flex flex-col items-center text-center overflow-hidden">
                    <Sparkles className="w-8 h-8 text-[#C59D5F] mb-6 opacity-20" />
                    <h4 
                      className={`text-xl mb-4 font-bold`} 
                      style={{ color: customization.color, fontFamily: customization.font === 'serif' ? 'serif' : customization.font === 'cursive' ? 'cursive' : 'sans-serif' }}
                    >
                      {customization.recipient || "Recipent Name"}
                    </h4>
                    <p 
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: customization.color, fontFamily: customization.font === 'serif' ? 'serif' : customization.font === 'cursive' ? 'cursive' : 'sans-serif' }}
                    >
                      {customization.message || "Your message will appear here..."}
                    </p>
                    <div className="mt-auto pt-8 flex gap-2">
                      {customization.media.audio && <Mic className="w-4 h-4 text-[#C59D5F]" />}
                      {customization.media.video && <Video className="w-4 h-4 text-[#C59D5F]" />}
                      {customization.media.picture && <ImageIcon className="w-4 h-4 text-[#C59D5F]" />}
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-[#1B4D3E]/40 font-medium">Digital Preview Only</p>
                </div>

                <div className="col-span-full flex justify-between pt-8 border-t border-[#1B4D3E]/5">
                  <Button variant="outline" onClick={prevStep} className="rounded-full px-8 py-6">Back</Button>
                  <Button 
                    onClick={nextStep}
                    className="bg-[#1B4D3E] hover:bg-[#143a2f] text-white px-12 py-6 rounded-full text-lg"
                  >
                    Preview My Gift <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Card Animation/Visual */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#C59D5F]/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white p-2 rounded-[2.5rem] shadow-2xl border border-[#1B4D3E]/5 overflow-hidden transform hover:-rotate-2 transition-transform duration-500">
                      <img src={selectedCard?.image} className="w-full aspect-[4/5] object-cover rounded-[2rem]" />
                      {customization.media.picture && (
                        <div className="absolute inset-4 rounded-[1.8rem] overflow-hidden border-4 border-white shadow-lg">
                           <img src={customization.media.picture} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="flex flex-col justify-center space-y-8">
                    <div>
                      <h3 className="text-3xl font-serif font-bold text-[#1B4D3E] mb-2">{selectedCard?.name}</h3>
                      <div className="flex items-center gap-4 text-[#C59D5F]">
                         <span className="text-2xl font-bold">₹{selectedCard?.price}</span>
                         <span className="bg-[#D1F2EB] text-[#1B4D3E] text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">Premium Personalized</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-[#1B4D3E]/40">Your Customizations</h4>
                      <div className="flex flex-wrap gap-3">
                        {customization.media.audio && (
                          <div className="flex items-center gap-2 bg-[#F0FDF4] text-[#166534] px-4 py-2 rounded-full border border-[#166534]/10">
                            <Mic className="w-4 h-4" /> <span className="text-sm font-medium">Voice Note Attached</span>
                          </div>
                        )}
                        {customization.media.video && (
                          <div className="flex items-center gap-2 bg-[#EFF6FF] text-[#1E40AF] px-4 py-2 rounded-full border border-[#1E40AF]/10">
                            <Video className="w-4 h-4" /> <span className="text-sm font-medium">Video Message Included</span>
                          </div>
                        )}
                        {customization.media.picture && (
                          <div className="flex items-center gap-2 bg-[#FFF7ED] text-[#9A3412] px-4 py-2 rounded-full border border-[#9A3412]/10">
                            <ImageIcon className="w-4 h-4" /> <span className="text-sm font-medium">Cover Photo Custom</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-[#FAF5F2] rounded-2xl border border-[#1B4D3E]/5">
                      <p className="text-xs text-[#1B4D3E]/40 font-bold uppercase tracking-widest mb-3">Preview Message</p>
                      <p className="text-[#1B4D3E] font-serif italic text-lg leading-relaxed">
                        "{customization.message || "No message provided"}"
                      </p>
                      <p className="mt-4 text-sm font-bold text-[#C59D5F]">— To: {customization.recipient || "Guest"}</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={prevStep} className="flex-1 rounded-full py-8 text-lg hover:bg-[#1B4D3E]/5 border-[#1B4D3E]/10">
                         Edit Details
                      </Button>
                      <Button 
                        onClick={handleAddToBag}
                        className="flex-[2] bg-[#1B4D3E] hover:bg-[#143a2f] text-white rounded-full py-8 text-lg shadow-xl shadow-[#1B4D3E]/20"
                      >
                         Add to Gift Bag <ShoppingBag className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-[#1B4D3E]/5 rounded-3xl text-[#1B4D3E]">
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Heart className="w-5 h-5" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider">Handcrafted</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Palette className="w-5 h-5" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider">Custom Style</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Music className="w-5 h-5" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider">Multimedia</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"><Sparkles className="w-5 h-5" /></div>
                      <span className="text-xs font-bold uppercase tracking-wider">Instant Gift</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
