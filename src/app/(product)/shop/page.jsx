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

  const page = parseInt(sp.page) || 1;
  const limit = parseInt(sp.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (sp.search) {
    // Use text index if available
    filter.$text = { $search: sp.search };
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

  if (sp.maxPrice) {
    const price = parseFloat(sp.maxPrice);
    if (!isNaN(price)) {
      filter.price = { $lte: price };
    }
  }

  // Sorting
  const sort = {};
  if (sp.sort === "price-asc") sort.price = 1;
  else if (sp.sort === "price-desc") sort.price = -1;
  else if (sp.sort === "name-asc") sort.name = 1;
  else sort.createdAt = -1;

  // Fetch products with lean() and pagination
  const [rawProducts, totalCount] = await Promise.all([
    Product.find(filter)
      .sort(sp.search ? { score: { $meta: "textScore" } } : sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);
  
  const products = rawProducts.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  const pagination = {
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit)
  };

  // Filter out gender names from categories for cleaner tiles
  const filteredCategories = categories.filter(c => !GENDER_OPTIONS.some(g => g.toLowerCase() === c.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <div className="container mx-auto px-0 py-4 max-w-8xl">
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient 
            initialProducts={products} 
            pagination={pagination}
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
    <div className="flex flex-col p-4 animate-pulse">
      {/* Skeleton Sort/View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="h-4 bg-gray-100 rounded-md w-32" />
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="h-10 bg-gray-100 rounded-lg w-24" />
          <div className="h-10 bg-gray-100 rounded-lg w-32" />
        </div>
      </div>
      
      {/* Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
             <div className="aspect-[4/5] bg-gray-100 rounded-2xl w-full" />
             <div className="h-4 bg-gray-100 rounded-md w-3/4" />
             <div className="h-4 bg-gray-100 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
