import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import CollectionsClient from "./CollectionsClient";
import { Suspense } from "react";

export const metadata = {
  title: "Collections | Ismaran Jewels",
  description: "Explore our curated collections of luxury jewellery.",
};

export default async function CollectionsPage({ searchParams }) {
  await dbConnect();

  // If a name query param is passed, we show just that collection.
  // Otherwise, we load products tagged for any of the collections and group them.
  const { name } = await searchParams;
  
  const targetSections = ["Modern Minimalist", "The Bridal Suite", "Royal Heritage"];
  
  let query = { homepageSections: { $in: targetSections } };
  
  if (name && targetSections.includes(name)) {
      query = { homepageSections: name };
  }

  const products = await Product.find(query).lean();

  const formattedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
        <Suspense fallback={<div className="p-20 text-center animate-pulse">Loading collection...</div>}>
          <CollectionsClient initialProducts={formattedProducts} initialFilter={name} />
        </Suspense>
    </main>
  );
}
