import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import FeaturedClient from "./FeaturedClient";
import { Suspense } from "react";

export const metadata = {
  title: "Featured Collection | Curated Luxury Jewellery",
  description: "Explore our most highly coveted and signature pieces, specially curated for you.",
};

export default async function FeaturedPage() {
  await dbConnect();

  // Fetch products tagged with "Featured" in their homepageSections array.
  const products = await Product.find({
    homepageSections: "Featured"
  }).lean();

  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedClient initialProducts={formattedProducts} />
        </Suspense>
    </main>
  );
}

function FeaturedSkeleton() {
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
