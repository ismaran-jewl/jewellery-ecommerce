// src/app/api/payment/webhook/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hmac !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 403 }
      );
    }

    const event = JSON.parse(body);

    await connectDB();

    switch (event.event) {
      case "payment.authorized":
        // Handle payment authorized
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.order?.entity?.id },
          { paymentStatus: "authorized" }
        );
        break;

      case "payment.failed":
        // Handle payment failed
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.order?.entity?.id },
          { paymentStatus: "failed", status: "cancelled" }
        );
        break;

      case "payment.captured":
        // Handle payment captured
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.order?.entity?.id },
          { paymentStatus: "captured", status: "confirmed" }
        );
        break;

      case "order.paid":
        // Handle order paid
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.order?.entity?.id },
          { paymentStatus: "paid", status: "processing" }
        );
        break;

      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
