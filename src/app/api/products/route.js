import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    let query = {};

    // 1. Text search using index if search term exists
    if (search) {
      query.$text = { $search: search };
    }

    // 2. Exact match filters (more efficient than regex for fixed categories)
    if (category) {
      // Still using regex for category flexibility if needed, but anchored and optimized
      query.category = { $regex: new RegExp(`^${category.replace(/s$/, '')}s?$`, "i") };
    }
    
    if (type) query.type = type;
    if (material) query.material = material;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // 3. Optimized count and fetch
    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 4. Map _id to id
    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(),
    }));

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
