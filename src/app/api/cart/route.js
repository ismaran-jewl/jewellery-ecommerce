// src/app/api/cart/route.js
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Product from "@/models/Product"

// GET — fetch the current user's cart with populated product data
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB()

  const cart = await Cart.findOne({ user: session.user.id })
    .populate("items.product", "name price image material type stock")
    .lean()

  if (!cart) return NextResponse.json({ items: [] })

  const items = cart.items.map((item) => ({
    cartItemId: item._id.toString(),
    id: item.product?._id?.toString(),
    name: item.product?.name,
    price: item.product?.price,
    image: item.product?.image,
    material: item.product?.material,
    type: item.product?.type,
    stock: item.product?.stock,
    qty: item.quantity,
    message: item.message ?? null,
  })).filter((i) => i.id)

  return NextResponse.json({ items })
}

// POST — add an item or increment qty
export async function POST(req) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId, quantity = 1 } = await req.json()
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 })

  await connectDB()

  const product = await Product.findById(productId).select("stock").lean()
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })

  let cart = await Cart.findOne({ user: session.user.id })

  if (!cart) {
    cart = await Cart.create({
      user: session.user.id,
      items: [{ product: productId, quantity }],
    })
  } else {
    const existing = cart.items.find((i) => i.product.toString() === productId)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock)
    } else {
      cart.items.push({ product: productId, quantity })
    }
    await cart.save()
  }

  return NextResponse.json({ success: true })
}

// PATCH — update quantity or attach a message to a cart item
export async function PATCH(req) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId, quantity, message } = await req.json()
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 })

  await connectDB()

  const cart = await Cart.findOne({ user: session.user.id })
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 })

  const item = cart.items.find((i) => i.product.toString() === productId)
  if (!item) return NextResponse.json({ error: "Item not in cart" }, { status: 404 })

  if (quantity !== undefined) item.quantity = Math.max(1, quantity)
  if (message !== undefined) item.message = message

  await cart.save()
  return NextResponse.json({ success: true })
}

// DELETE — remove one item or clear the whole cart
export async function DELETE(req) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId, clearAll } = await req.json()
  await connectDB()

  const cart = await Cart.findOne({ user: session.user.id })
  if (!cart) return NextResponse.json({ success: true })

  if (clearAll) {
    cart.items = []
  } else {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId)
  }

  await cart.save()
  return NextResponse.json({ success: true })
}