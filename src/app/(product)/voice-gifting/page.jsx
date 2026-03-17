import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import VoiceGiftingClient from "./VoiceGiftingClient";
import { Suspense } from "react";

export const metadata = {
  title: "Voice Gifting | Memory-Linked Jewellery",
  description: "Create your memory piece. Our luxury jewellery comes embedded with voice, video, and hidden messages.",
};

export default async function VoiceGiftingPage() {
  await dbConnect();

  const products = await Product.find({
    homepageSections: "VoiceGift"
  }).lean();

  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
        <Suspense fallback={<div className="p-20 text-center animate-pulse">Loading Voice Gifting...</div>}>
          <VoiceGiftingClient initialProducts={formattedProducts} />
        </Suspense>
    </main>
  );
}
