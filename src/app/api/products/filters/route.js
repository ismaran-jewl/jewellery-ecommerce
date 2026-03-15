import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const [categories, types, materials] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("type"),
      Product.distinct("material")
    ]);

    // Filter out gender names from categories for cleaner tiles
    const GENDER_OPTIONS = ["Women", "Men", "Unisex"];
    const filteredCategories = categories.filter(c => !GENDER_OPTIONS.some(g => g.toLowerCase() === c.toLowerCase()));

    return NextResponse.json({
      categories: filteredCategories,
      types,
      materials,
      genders: GENDER_OPTIONS
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 }
    );
  }
}
