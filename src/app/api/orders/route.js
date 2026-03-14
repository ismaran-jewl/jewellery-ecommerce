// src/app/api/orders/route.js
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"
import Promo from "@/models/Promo"

// GET — fetch all orders for the current user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const orders = await Order.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ orders })
}

// POST — place a new order from the current cart
export async function POST(req) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { shippingAddress, paymentMethod, promoCode, discountAmount = 0, razorpayOrderId } = await req.json()

  if (!shippingAddress || !paymentMethod) {
    return NextResponse.json({ error: "Shipping address and payment method required" }, { status: 400 })
  }

  await connectDB()

  const cart = await Cart.findOne({ user: session.user.id })
    .populate("items.product", "name price image stock")
    .lean()

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  // Build order items + validate stock
  const orderItems = []
  for (const item of cart.items) {
    const product = item.product
    if (!product) continue
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `"${product.name}" only has ${product.stock} units left in stock` },
        { status: 409 }
      )
    }
    orderItems.push({
      name: product.name,
      quantity: item.quantity,
      image: product.image,
      price: product.price,
      product: product._id,
      message: item.message ?? undefined,
    })
  }

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shippingPrice = itemsPrice > 10000 || promoCode ? 0 : 500
  const taxPrice = Math.round(itemsPrice * 0.03)
  const safeDiscount = Math.min(Number(discountAmount) || 0, itemsPrice)
  const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - safeDiscount)

  const order = await Order.create({
    user: session.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    discountAmount: safeDiscount,
    promoCode: promoCode || null,
    razorpayOrderId: razorpayOrderId || null,
    // For Razorpay, order is pending until payment verification
    isPaid: paymentMethod === "cod",
    paidAt: paymentMethod === "cod" ? new Date() : undefined,
    paymentStatus: paymentMethod === "cod" ? "completed" : "pending",
    status: "Processing",
  })

  // Decrement stock
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  )

  // Clear cart
  await Cart.findOneAndUpdate(
    { user: session.user.id },
    { $set: { items: [] } }
  )

  // Mark promo code as used
  if (promoCode) {
    await Promo.findOneAndUpdate(
      { code: promoCode.toUpperCase() },
      { $inc: { usedCount: 1 }, $push: { usedBy: session.user.id } }
    )
  }

  return NextResponse.json({
    success: true,
    orderId: order._id.toString(),
    orderRef: order._id.toString().slice(-8).toUpperCase(),
    totalPrice,
  })
}