
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import SeasonalEditClient from "./SeasonalEditClient";
import { Suspense } from "react";

export const metadata = {
  title: "Seasonal Edit 2026 | Curated Luxury Jewellery",
  description: "Explore our handpicked seasonal edit featuring the finest solitaire diamonds, golden charms, and rare masterpieces.",
};

export default async function SeasonalEditPage() {
  await dbConnect();

  // Define the criteria for 'Seasonal Edit' products based on the homepage banners
  // For this implementation, we'll select products that match the themes: 
  // Solitaire, Golden Charms, Midnight Gold, Heritage, and Rare Gems.
  const seasonalThemes = [
    "Diamond Solitaire Ring",
    "Gold Chain Necklace",
    "Diamond Pendant",
    "Gold Bracelet",
    "Diamond Bracelet",
    "Men Gold Ring",
    "Men Platinum Ring",
    "Men Gold Chain",
    "Diamond Stud Earrings",
    "Gold Hoop Earrings",
    "Anniversary Diamond Ring",
    "Temple Gold Necklace"
  ];

  const products = await Product.find({
    name: { $in: seasonalThemes.map(name => new RegExp(`^${name}$`, "i")) }
  }).lean();

  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
        <Suspense fallback={<SeasonalSkeleton />}>
          <SeasonalEditClient initialProducts={formattedProducts} />
        </Suspense>
    </main>
  );
}

function SeasonalSkeleton() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl animate-pulse">
      <div className="h-12 bg-gray-100 rounded-3xl w-1/3 mb-4 mx-auto" />
      <div className="h-6 bg-gray-100 rounded-2xl w-1/2 mb-12 mx-auto" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[4/5] bg-gray-100 rounded-3xl w-full" />
            <div className="h-4 bg-gray-100 rounded-md w-3/4" />
            <div className="h-4 bg-gray-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
