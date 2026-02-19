import dbConnect from "@/lib/mongodb";
import User from "@/providers/database/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const user = await User.findOne().lean(); // Replace with session logic

  return NextResponse.json({
    user,
    recentProducts: [],
    recommendedProducts: [],
  });
}
