// src/app/api/promo/validate/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Promo from "@/models/Promo";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, cartTotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    await connectDB();

    const promo = await Promo.findOne({
      code: code.trim().toUpperCase(),
      active: true,
    });

    if (!promo) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 });
    }

    // Check expiry
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    // Check global usage limit
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 });
    }

    // Check per-user usage limit
    const userUsageCount = promo.usedBy.filter(
      (uid) => uid.toString() === session.user.id
    ).length;
    if (userUsageCount >= promo.perUserLimit) {
      return NextResponse.json({ error: "You've already used this promo code" }, { status: 400 });
    }

    // Check minimum order value
    if (cartTotal < promo.minOrderValue) {
      return NextResponse.json({
        error: `Minimum order of ₹${promo.minOrderValue.toLocaleString("en-IN")} required for this code`,
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    let freeShipping = false;

    if (promo.type === "percentage") {
      discount = Math.round((cartTotal * promo.value) / 100);
      if (promo.maxDiscount !== null) {
        discount = Math.min(discount, promo.maxDiscount);
      }
    } else if (promo.type === "fixed") {
      discount = Math.min(promo.value, cartTotal);
    } else if (promo.type === "free_shipping") {
      freeShipping = true;
      discount = 500; // Standard shipping cost
    }

    return NextResponse.json({
      success: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      discount,
      freeShipping,
      description: promo.description,
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}
