"use client";

import HeroSection from "@/components/layout/home/HeroSection";
import TrustStrip from "@/components/layout/home/TrustStrip";
import FeaturedProducts from "@/components/layout/home/FeaturedProducts";
import CollectionsGrid from "@/components/layout/home/CollectionsGrid";
import SeasonalOffers from "@/components/layout/home/SeasonalOffers";

import ShareYourStory from "@/components/layout/home/ShareYourStory";
import VoiceGiftSection from "@/components/layout/home/VoiceGiftSection";
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
