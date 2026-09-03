import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type: images and videos
    const mimeType = file.type || "";
    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP) or video files (MP4, MOV, WebM) are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine extension
    let ext = path.extname(file.name).toLowerCase();
    if (!ext || ext === ".") {
      if (mimeType.includes("mp4")) ext = ".mp4";
      else if (mimeType.includes("webm")) ext = ".webm";
      else if (mimeType.includes("quicktime")) ext = ".mov";
      else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = ".jpg";
      else if (mimeType.includes("png")) ext = ".png";
      else if (mimeType.includes("webp")) ext = ".webp";
      else if (mimeType.includes("avif")) ext = ".avif";
      else ext = isVideo ? ".mp4" : ".jpg";
    }

    // Clean original name prefix (letters/numbers only)
    const mediaPrefix = isVideo ? "preshoot-video" : "preshoot-photo";
    const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 20) || "media";
    const uniqueFilename = `${mediaPrefix}-${baseClean}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;


    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      mimeType: file.type,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 });
  }
}
