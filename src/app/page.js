"use client";

import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import FeaturedProducts from "@/components/FeaturedProducts";
import CollectionsGrid from "@/components/CollectionsGrid";
import SeasonalOffers from "@/components/SeasonalOffers";
 import Navbar from "@/components/Navbar";
 import Footer from "@/components/Footer";
import ShareYourStory from "@/components/ShareYourStory";
export default function HomePage() {
  return (
    <main className="bg-[#FAF9F6] text-[#2D2D2D] selection:bg-[#C59D5F] selection:text-white">
      <Navbar />
      <HeroSection />
      <SeasonalOffers />
      <FeaturedProducts />
      <CollectionsGrid />
      <ShareYourStory></ShareYourStory>
      <TrustStrip />
      <Footer />
    </main>
  );
}
