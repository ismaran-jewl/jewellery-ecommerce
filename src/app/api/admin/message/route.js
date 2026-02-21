import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

// GET all messages (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const messages = await Message.find({})
      .populate("sender", "name email image")
      .sort({ createdAt: -1 });

    // Convert Buffer content to base64 for transport
    const serialized = messages.map((msg) => ({
      _id: msg._id,
      sender: msg.sender,
      contentType: msg.contentType,
      contentBase64: msg.content ? msg.content.toString("base64") : null,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST a new message (authenticated users)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("media");

    if (!file) {
      return NextResponse.json(
        { error: "No media file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["audio/webm", "video/webm", "audio/ogg", "video/ogg", "audio/mp4", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid media type. Only audio/video files are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const message = new Message({
      sender: session.user.id,
      content: buffer,
      contentType: file.type,
    });

    await message.save();

    const populated = await message.populate("sender", "name email image");

    return NextResponse.json(
      {
        _id: populated._id,
        sender: populated.sender,
        contentType: populated.contentType,
        createdAt: populated.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}

// DELETE a message (admin only)
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
