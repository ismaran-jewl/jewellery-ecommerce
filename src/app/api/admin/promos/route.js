// src/app/api/admin/promos/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Promo from "@/models/Promo";

function isAdmin(session) {
  return session?.user?.role === "admin";
}

// GET — list all promos (admin only)
export async function GET() {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const promos = await Promo.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ promos });
}

// POST — create a new promo code (admin only)
export async function POST(req) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { code, type, value, minOrderValue, maxDiscount, usageLimit, perUserLimit, expiresAt, description } = body;

  if (!code || !type || value === undefined) {
    return NextResponse.json({ error: "code, type, value are required" }, { status: 400 });
  }

  await connectDB();

  try {
    const promo = await Promo.create({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perUserLimit: Number(perUserLimit) || 1,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      description: description || "",
    });
    return NextResponse.json({ success: true, promo }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 409 });
    }
    throw error;
  }
}

// PATCH — toggle promo active/inactive (admin only)
export async function PATCH(req) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, active } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();
  const promo = await Promo.findByIdAndUpdate(id, { active }, { new: true });
  if (!promo) return NextResponse.json({ error: "Promo not found" }, { status: 404 });
  return NextResponse.json({ success: true, promo });
}

// DELETE — remove promo (admin only)
export async function DELETE(req) {
  const session = await auth();
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();
  await Promo.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
