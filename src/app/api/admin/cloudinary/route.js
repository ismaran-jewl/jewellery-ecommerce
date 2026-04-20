import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage, listImages, deleteImage } from "@/services/upload/imageUpload";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await listImages();
    if (result.success) {
      return NextResponse.json(result.images);
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try parsing as JSON first (for URL imports)
    let contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      let { url } = await request.json();
      if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });
      
      // Phase 1: Robust URL Normalization & Resolution
      let targetUrl = url.trim();

      // 1.1 Handle Pinterest redirects & oEmbed (for pin pages)
      if (targetUrl.includes("pinterest.com/pin/") || targetUrl.includes("pin.it/")) {
        try {
          const oRes = await fetch(`https://www.pinterest.com/oembed.json?url=${encodeURIComponent(targetUrl)}`);
          if (oRes.ok) {
            const oData = await oRes.json();
            if (oData.thumbnail_url) {
              targetUrl = oData.thumbnail_url;
              // Upgrade to high-res if it's a pinimg link
              if (targetUrl.includes("i.pinimg.com")) {
                targetUrl = targetUrl.replace(/\/\d+x\//, "/originals/");
              }
            }
          }
        } catch (error) {
          console.error("Pinterest resolution failed:", error);
        }
      }

      // 1.2 Handle Google Drive (already normalized in getImageUrl, but ensuring it's direct for Cloudinary)
      // Note: Cloudinary handles drive.google.com/thumbnail?id=... links well.

      const result = await uploadImage(targetUrl);
      return NextResponse.json(result);
    }

    // Otherwise handle as FormData (for file uploads)
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ error: "No file or URL provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(buffer).toString("base64")}`;
    
    const result = await uploadImage(base64);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 });
    }

    const result = await deleteImage(publicId);
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
