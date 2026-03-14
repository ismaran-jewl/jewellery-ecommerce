// src/app/api/payment/initialize/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRazorpayOrder } from "@/services/payment/razorpay";
import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const discountAmount = Number(body.discountAmount) || 0;

    await connectDB();

    const cart = await Cart.findOne({ user: session.user.id })
      .populate("items.product", "price stock")
      .lean();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount (matching the order calculation)
    const itemsTotal = cart.items.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    const shippingPrice = itemsTotal > 10000 ? 0 : 500;
    const taxPrice = Math.round(itemsTotal * 0.03);
    const safeDiscount = Math.min(discountAmount, itemsTotal);
    const totalAmount = Math.max(0, itemsTotal + shippingPrice + taxPrice - safeDiscount);

    if (totalAmount < 1) {
      return NextResponse.json({ error: "Order total too low for online payment" }, { status: 400 });
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      totalAmount,
      "INR",
      `ORDER-${session.user.id.toString().slice(-6)}-${Date.now()}`
    );

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
