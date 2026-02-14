import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/providers/database/Product";
export async function GET(request, { params }) {
  await dbConnect();

  // FIX: Await params before destructuring id
  const { id } = await params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json(product );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}