import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/providers/database/Product";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const material = searchParams.get("material");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    let query = {};

    // 1. Make category case-insensitive (matches "Men", "men", "MEN")
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    
    if (type) query.type = type;
    if (material) query.material = material;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 2. Use .lean() to get plain JavaScript objects instead of Mongoose documents
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    // 3. Map _id to id so the frontend can read it
    const formattedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(), // Keep _id as string just in case
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
