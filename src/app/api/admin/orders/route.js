// src/app/api/admin/orders/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";

function isAdmin(session) {
  return session?.user?.role === "admin";
}

// GET — all orders with user + product details
export async function GET(req) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page   = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    const filter = status && status !== "all" ? { status } : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name email")
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({ orders, total, page, limit });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PATCH — update order status
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderId, status } = await req.json();
    if (!orderId || !status) return NextResponse.json({ error: "orderId and status required" }, { status: 400 });

    const validStatuses = ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    await connectDB();

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        ...(status === "Delivered" ? { isDelivered: true, deliveredAt: new Date() } : {}),
      },
      { new: true }
    ).populate("user", "name email").lean();

    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Admin orders PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
