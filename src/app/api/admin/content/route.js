import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

export async function GET() {
  await dbConnect();
  try {
    const content = await SiteContent.find({});
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { key, ...updateData } = body;
    
    // Upsert behavior: update if exists, else create
    const content = await SiteContent.findOneAndUpdate(
      { key },
      { $set: updateData },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
