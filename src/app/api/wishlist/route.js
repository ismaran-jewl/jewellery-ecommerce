import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

// ======================================
// GET — Get current user's wishlist
// ======================================
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const wishlist = await Wishlist.findOne({ user: session.user.id })
    .populate("products")
    .lean();

  return NextResponse.json({
    wishlist: wishlist?.products || [],
  });
}

// ======================================
// POST — Add product to wishlist
// ======================================
export async function POST(req) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  await connectDB();

  let wishlist = await Wishlist.findOne({ user: session.user.id });

  // If no wishlist exists → create one
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: session.user.id,
      products: [productId],
    });

    return NextResponse.json({ message: "Added to wishlist" });
  }

  // Prevent duplicates
  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return NextResponse.json({ message: "Added to wishlist" });
}

// ======================================
// DELETE — Remove product
// ======================================
export async function DELETE(req) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  await connectDB();

  await Wishlist.findOneAndUpdate(
    { user: session.user.id },
    { $pull: { products: productId } }
  );

  return NextResponse.json({ message: "Removed from wishlist" });
}
