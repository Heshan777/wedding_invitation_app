import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { put } from "@vercel/blob";
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
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

    return NextResponse.json({
      configured: hasBlobToken || !isVercel,
      provider: hasBlobToken ? "vercel-blob" : isVercel ? "none" : "local-disk",
      isVercel,
      hasBlobToken,
      message: hasBlobToken
        ? "Vercel Blob cloud storage is connected and active."
        : isVercel
        ? "Vercel Blob is not connected yet. Filesystem on Vercel is read-only. Please create a Blob Store in Vercel Dashboard (Storage -> Create Database -> Blob)."
        : "Local disk storage is active for local development.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to check storage status" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    // 1. Direct Client Upload handshake via @vercel/blob/client (bypasses 4.5MB Serverless limit)
    if (contentType.includes("application/json")) {
      const body = (await req.json()) as HandleUploadBody;

      try {
        const jsonResponse = await handleUpload({
          body,
          request: req,
          onBeforeGenerateToken: async (pathname) => {
            return {
              allowedContentTypes: [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/avif",
                "video/mp4",
                "video/webm",
                "video/quicktime",
                "video/x-matroska",
                "video/x-msvideo",
                "audio/mpeg",
                "audio/wav",
                "audio/ogg",
                "audio/mp4",
              ],
              maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB (supports large pre-shoot videos)
              tokenPayload: JSON.stringify({ pathname }),
            };
          },
          onUploadCompleted: async ({ blob, tokenPayload }) => {
            console.log("Vercel Blob client upload completed:", blob.url);
          },
        });

        return NextResponse.json(jsonResponse);
      } catch (blobErr: any) {
        console.error("Vercel Blob handleUpload error:", blobErr);
        const isMissingToken =
          !process.env.BLOB_READ_WRITE_TOKEN ||
          blobErr.message?.includes("No token found") ||
          blobErr.message?.includes("BLOB_READ_WRITE_TOKEN");

        return NextResponse.json(
          {
            error: isMissingToken
              ? "Vercel Blob is not connected. In your Vercel Dashboard, go to Storage -> Create Database -> Blob and connect it to this project."
              : (blobErr.message || "Failed to generate client upload token"),
          },
          { status: 400 }
        );
      }
    }

    // 2. Standard Multipart / FormData Upload (Server-side)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type: images, videos, audio
    const mimeType = file.type || "";
    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/") || Boolean(file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i));
    const isAudio = mimeType.startsWith("audio/") || Boolean(file.name.match(/\.(mp3|wav|ogg|m4a)$/i));

    if (!isImage && !isVideo && !isAudio) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP), video files (MP4, MOV, WebM), or audio files are allowed" },
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
      else if (mimeType.includes("mpeg") || mimeType.includes("mp3")) ext = ".mp3";
      else ext = isVideo ? ".mp4" : isAudio ? ".mp3" : ".jpg";
    }

    // Clean original name prefix
    const mediaPrefix = isVideo ? "preshoot-video" : isAudio ? "audio" : "preshoot-photo";
    const baseClean = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 20) || "media";
    const uniqueFilename = `${mediaPrefix}-${baseClean}-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;

    // A. If Vercel Blob token is configured, upload directly to Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(uniqueFilename, buffer, {
        access: "public",
        contentType: mimeType || undefined,
      });

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: uniqueFilename,
        size: file.size,
        mimeType: file.type,
      });
    }

    // B. If running locally, attempt local filesystem write
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
    } catch (fsErr: any) {
      // If filesystem is read-only (e.g. running on Vercel without Blob Store)
      if (fsErr.code === "EROFS" || fsErr.message?.includes("read-only") || process.env.VERCEL) {
        return NextResponse.json(
          {
            error:
              "Vercel file system is read-only. Please connect Vercel Blob in your Vercel Dashboard (Storage -> Create -> Blob) to enable persistent media uploads, or paste an external image/video URL directly.",
          },
          { status: 507 }
        );
      }
      throw fsErr;
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload media file" }, { status: 500 });
  }
}
