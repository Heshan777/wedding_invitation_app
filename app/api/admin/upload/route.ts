import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCloudinaryConfig, uploadBufferToCloudinary } from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// GET /api/admin/upload - Check storage configuration status
export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isVercel = Boolean(process.env.VERCEL);
    const cloudinaryConfig = getCloudinaryConfig();
    const hasCloudinary = Boolean(cloudinaryConfig);

    return NextResponse.json({
      configured: hasCloudinary || !isVercel,
      provider: hasCloudinary ? "cloudinary" : isVercel ? "none" : "local-disk",
      isVercel,
      hasCloudinary,
      cloudName: cloudinaryConfig?.cloudName || null,
      message: hasCloudinary
        ? `Cloudinary media storage is connected and active (${cloudinaryConfig?.cloudName}).`
        : isVercel
        ? "Cloudinary is not configured yet. Filesystem on Vercel is read-only. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in environment variables."
        : "Local disk storage is active for local development.",
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Failed to check storage status";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
    const MAX_MEDIA_SIZE = 100 * 1024 * 1024; // 100MB

    // Prohibit SVG files to prevent stored XSS vulnerabilities
    const lowerName = file.name.toLowerCase();
    const mimeType = (file.type || "").toLowerCase();
    if (mimeType.includes("svg") || lowerName.endsWith(".svg")) {
      return NextResponse.json(
        { error: "SVG files are disabled for security reasons." },
        { status: 400 }
      );
    }

    // Validate mime type: images, videos, audio
    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/") || Boolean(lowerName.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/));
    const isAudio = mimeType.startsWith("audio/") || Boolean(lowerName.match(/\.(mp3|wav|ogg|m4a)$/));

    if (!isImage && !isVideo && !isAudio) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, AVIF), video files (MP4, MOV, WebM), or audio files (MP3, WAV, OGG) are allowed." },
        { status: 400 }
      );
    }

    // Enforce size limits before reading into memory
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds the 15MB maximum allowed size." },
        { status: 413 }
      );
    }

    if (file.size > MAX_MEDIA_SIZE) {
      return NextResponse.json(
        { error: "Media file exceeds the 100MB maximum allowed size." },
        { status: 413 }
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
      else if (mimeType.includes("mpeg") || mimeType.includes("mp3")) ext = ".mp3";
      else ext = isVideo ? ".mp4" : isAudio ? ".mp3" : ".jpg";
    }

    // A. If Cloudinary is configured, upload directly to Cloudinary
    const cloudinaryConfig = getCloudinaryConfig();
    if (cloudinaryConfig) {
      try {
        const uploadResult = await uploadBufferToCloudinary(
          buffer,
          file.name,
          mimeType || (isVideo ? "video/mp4" : isAudio ? "audio/mpeg" : "image/jpeg"),
          "wedding-media"
        );

        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          filename: uploadResult.public_id,
          size: file.size,
          mimeType: file.type,
          duration: uploadResult.duration,
        });
      } catch (cloudErr) {
        console.error("Cloudinary server upload error:", cloudErr);
        const errorMsg = cloudErr instanceof Error ? cloudErr.message : "Failed to upload to Cloudinary";
        return NextResponse.json(
          { error: errorMsg },
          { status: 500 }
        );
      }
    }

    // B. If running locally, attempt local filesystem write
    const mediaPrefix = isVideo ? "preshoot-video" : isAudio ? "audio" : "preshoot-photo";
    const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 20) || "media";
    const uniqueFilename = `${mediaPrefix}-${baseClean}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    try {
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
    } catch (fsErr) {
      // If filesystem is read-only (e.g. running on Vercel without Cloudinary)
      const isReadOnly =
        (typeof fsErr === "object" && fsErr !== null && "code" in fsErr && (fsErr as { code: string }).code === "EROFS") ||
        (fsErr instanceof Error && fsErr.message.includes("read-only")) ||
        Boolean(process.env.VERCEL);

      if (isReadOnly) {
        return NextResponse.json(
          {
            error:
              "Server filesystem is read-only. Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable media uploads, or paste an external media URL directly.",
          },
          { status: 507 }
        );
      }
      throw fsErr;
    }
  } catch (err) {
    console.error("Upload error:", err);
    const errorMsg = err instanceof Error ? err.message : "Failed to upload media file";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
