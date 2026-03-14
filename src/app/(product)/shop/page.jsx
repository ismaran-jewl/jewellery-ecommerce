import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ShopClient from "./ShopClient";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/shop/ProductCard";

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const category = sp.category;
  const gender = sp.gender;
  
  let title = "Luxury Jewellery Collection | Premium Gold & Diamonds";
  if (category) title = `${category} Collection | Premium Jewellery`;
  else if (gender) title = `${gender}'s Jewellery Collection | Premium Jewellery`;

  return {
    title,
    description: "Discover our exquisite collection of handcrafted gold and diamond jewellery. Filter by category, material, and occasion to find your perfect piece.",
  };
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  await dbConnect();

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
    filter.category = { $in: cats.map(c => new RegExp(`^${c}$`, "i")) };
  }

  if (sp.type) {
    const t = sp.type.split(",").map(v => v.trim());
    filter.type = { $in: t.map(v => new RegExp(`^${v}$`, "i")) };
  }

  if (sp.material) {
    const m = sp.material.split(",").map(v => v.trim());
    filter.material = { $in: m.map(v => new RegExp(`^${v}$`, "i")) };
  }

  const rawProducts = await Product.find(filter).lean();
  
  const products = rawProducts.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  const filteredCategories = categories.filter(c => !GENDER_OPTIONS.some(g => g.toLowerCase() === c.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #fdf8f2 0%, #f9f2ea 100%)" }}>
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #c4a882, #8B5E3C, #c4a882, transparent)" }} />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32 max-w-7xl">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient 
            initialProducts={products} 
            categories={filteredCategories}
            types={types}
            materials={materials}
          />
        </Suspense>
      </div>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-8">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
