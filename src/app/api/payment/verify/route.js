// src/app/api/payment/verify/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyRazorpayPayment } from "@/services/payment/razorpay";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Cart from "@/models/Cart";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, orderId, signature } = await req.json();

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyRazorpayPayment(paymentId, orderId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    await connectDB();

    // Update order with payment details
    const order = await Order.findOneAndUpdate(
      { user: session.user.id, razorpayOrderId: orderId },
      {
        paymentId,
        paymentStatus: "completed",
        status: "confirmed",
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Clear cart after successful payment
    await Cart.deleteOne({ user: session.user.id });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
