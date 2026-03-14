// src/app/api/reviews/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";

// GET — fetch reviews for a product
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    await connectDB();

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Distribution: 1-5 star counts
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => { distribution[r.rating] = (distribution[r.rating] || 0) + 1; });

    return NextResponse.json({
      reviews,
      totalReviews,
      avgRating: Math.round(avgRating * 10) / 10,
      distribution,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST — submit a new review
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, title, body } = await req.json();

    if (!productId || !rating || !title || !body) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (title.length > 100 || body.length > 1000) {
      return NextResponse.json({ error: "Review too long" }, { status: 400 });
    }

    await connectDB();

    // Check if user has ordered this product (verified purchase)
    const hasOrdered = await Order.exists({
      user: session.user.id,
      "orderItems.product": productId,
      paymentStatus: { $in: ["captured", "completed", "paid"] },
    });

    const review = await Review.create({
      product: productId,
      user: session.user.id,
      name: session.user.name || "Anonymous",
      rating,
      title,
      body,
      verified: !!hasOrdered,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
