"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

import HeroSection from "@/components/layout/home/HeroSection";
import TrustStrip from "@/components/layout/home/TrustStrip";
import FeaturedProducts from "@/components/layout/home/FeaturedProducts";
import CollectionsGrid from "@/components/layout/home/CollectionsGrid";
import SeasonalOffers from "@/components/layout/home/SeasonalOffers";
import Navbar from "@/components/layout/home/Navbar";
import Footer from "@/components/layout/home/Footer";
import ShareYourStory from "@/components/layout/home/ShareYourStory";
import VoiceGiftSection from "@/components/layout/home/VoiceGiftSection";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    /*
      Single seamless canvas — all sections sit on this one background.
      Every child section must be bg-transparent so this shows through.
      `overflow-hidden` prevents any section from leaking outside the canvas.
    */
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #FFF8E7 0%, #FEEECC 35%, #FDE6B0 65%, #FFF8E7 100%)",
      }}
    >
      <Navbar />

      {/* All sections stacked with zero gap — no margin, no padding between */}
      <main className="flex flex-col">
        <HeroSection />
        <SeasonalOffers />
        <FeaturedProducts />
        <CollectionsGrid />
        <VoiceGiftSection />
        <ShareYourStory />
        <TrustStrip />
      </main>

      <Footer />
    </div>
  );
}