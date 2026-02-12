"use client";

import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CollectionsGrid from "@/components/home/CollectionsGrid";
import SeasonalOffers from "@/components/home/SeasonalOffers";
 
import ShareYourStory from "@/components/home/ShareYourStory";
import VoiceGiftSection from "@/components/home/VoiceGiftSection";
export default function HomePage() {
  return (
    <main className="bg-[#FAF9F6] text-[#2D2D2D] selection:bg-[#C59D5F] selection:text-white">
     
      <HeroSection />
      <SeasonalOffers />
      <FeaturedProducts />
      <CollectionsGrid />
      <VoiceGiftSection />
      <ShareYourStory></ShareYourStory>
      <TrustStrip />
     
    </main>
  );
}
