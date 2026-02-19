// src/app/api/qr-code/route.js
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Message from "@/providers/database/Message"
import User from "@/providers/database/User"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const messages = await Message.find({ 'sender': user._id })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(messages.map((message) => ({
    url: message.contentUrl,
    type: message.contentType,
    name: `Memory ${new Date(message.createdAt).toLocaleDateString()}`,
    createdAt: message.createdAt,
  })))
}
