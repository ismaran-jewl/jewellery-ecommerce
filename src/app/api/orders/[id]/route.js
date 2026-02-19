// src/app/api/orders/[id]/route.js
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order from "@/providers/database/Order"
import mongoose from "mongoose"

export async function GET(req, { params }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Next.js 15 — params is a Promise
  const { id } = await params

  // Validate it's a real MongoDB ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
  }

  await connectDB()

  const order = await Order.findOne({
    _id: id,
    user: session.user.id, // users can only see their own orders
  }).lean()

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

  return NextResponse.json({
    orderId:         order._id.toString(),
    orderRef:        order._id.toString().slice(-8).toUpperCase(),
    status:          order.status,
    isPaid:          order.isPaid,
    paymentMethod:   order.paymentMethod,
    itemsPrice:      order.itemsPrice,
    shippingPrice:   order.shippingPrice,
    taxPrice:        order.taxPrice,
    totalPrice:      order.totalPrice,
    orderItems:      order.orderItems,
    shippingAddress: order.shippingAddress,
    createdAt:       order.createdAt,
  })
}