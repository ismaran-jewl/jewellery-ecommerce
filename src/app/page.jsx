"use client";

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
  return (
    <>
      <Navbar />
      <HeroSection />
      <SeasonalOffers />
      <FeaturedProducts />
      <CollectionsGrid />
      <VoiceGiftSection />
      <ShareYourStory />
      <TrustStrip />
      <Footer />
    </>
  );
}
