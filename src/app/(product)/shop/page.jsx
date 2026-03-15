import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ShopClient from "./ShopClient";
import { Suspense } from "react";

export const metadata = {
  title: "Exquisite Collection | Luxury Jewellery Shop",
  description: "Browse our handpicked collection of premium gold, diamond and gemstone jewellery. Find the perfect piece for your special moments.",
};

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  await dbConnect();

  // Parallel fetching of distinct values for filters
  const [categories, types, materials] = await Promise.all([
    Product.distinct("category"),
    Product.distinct("type"),
    Product.distinct("material")
  ]);

  const filter = {};
  
  if (sp.search) {
    filter.name = { $regex: sp.search, $options: "i" };
  }

  const GENDER_OPTIONS = ["Women", "Men", "Unisex"];
  if (sp.gender) {
    const genders = sp.gender.split(",").map(g => g.trim());
    filter.$or = [
      { gender: { $in: genders.map(g => new RegExp(`^${g}$`, "i")) } },
      { category: { $in: genders.map(g => new RegExp(`^${g}$`, "i")) } }
    ];
  }

  if (sp.category) {
    const cats = sp.category.split(",").map(c => c.trim());
    filter.category = { $in: cats.map(c => new RegExp(`^${c.replace(/s$/, '')}s?$`, "i")) };
  }

  if (sp.type) {
    const t = sp.type.split(",").map(v => v.trim());
    filter.type = { $in: t.map(v => new RegExp(`^${v}$`, "i")) };
  }

  if (sp.material) {
    const m = sp.material.split(",").map(v => v.trim());
    filter.material = { $in: m.map(v => new RegExp(`^${v}$`, "i")) };
  }

  // Fetch products with lean() for performance
  const rawProducts = await Product.find(filter).sort({ createdAt: -1 }).lean();
  
  const products = rawProducts.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  // Filter out gender names from categories for cleaner tiles
  const filteredCategories = categories.filter(c => !GENDER_OPTIONS.some(g => g.toLowerCase() === c.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <div className="container mx-auto px-0 py-4 max-w-8xl">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient 
            initialProducts={products} 
            categories={filteredCategories}
            types={types}
            materials={materials}
          />
        </Suspense>
      </div>
    </main>
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-64 bg-gray-100 rounded-3xl w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
