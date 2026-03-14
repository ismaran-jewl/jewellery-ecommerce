// src/app/api/promo/seed/route.js
// Idempotent seeder — safe to call multiple times.
// Seeds the default "FREE" promo code (99.99% off, unlimited usage).
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Promo from "@/models/Promo";

export async function POST() {
  try {
    await connectDB();

    const defaultPromos = [
      {
        code: "FREE",
        type: "percentage",
        value: 99.99,
        minOrderValue: 0,
        maxDiscount: null,        // No cap — truly 99.99% off
        usageLimit: null,         // Unlimited uses
        perUserLimit: 100,        // Each user can use up to 100 times
        active: true,
        expiresAt: null,
        description: "99.99% OFF — Welcome Gift! Almost free! 🎉",
      },
    ];

    const results = [];
    for (const promo of defaultPromos) {
      const existing = await Promo.findOne({ code: promo.code });
      if (!existing) {
        const created = await Promo.create(promo);
        results.push({ code: created.code, status: "created" });
      } else {
        results.push({ code: existing.code, status: "already_exists" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Promo seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
