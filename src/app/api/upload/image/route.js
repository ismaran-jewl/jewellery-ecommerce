// src/app/api/upload/image/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage, validateImageFile } from "@/services/upload/imageUpload";

export async function POST(req) {
  try {
    const session = await auth();
    
    // Allow upload for authenticated users or admins
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Upload file
    const uploadResult = await uploadImage(file);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId || uploadResult.key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
