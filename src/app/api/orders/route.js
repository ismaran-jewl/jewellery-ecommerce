// src/app/api/orders/route.js
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import Product from "@/models/Product"

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

  const { shippingAddress, paymentMethod } = await req.json()

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
  const shippingPrice = itemsPrice > 10000 ? 0 : 500
  const taxPrice = Math.round(itemsPrice * 0.03)
  const totalPrice = itemsPrice + shippingPrice + taxPrice

  const order = await Order.create({
    user: session.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: paymentMethod !== "cod",
    paidAt: paymentMethod !== "cod" ? new Date() : undefined,
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

  return NextResponse.json({
    success: true,
    orderId: order._id.toString(),
    orderRef: order._id.toString().slice(-8).toUpperCase(),
    totalPrice,
  })
}