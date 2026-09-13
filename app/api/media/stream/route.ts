import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// 2MB chunk size for smooth progressive video streaming without buffering huge files upfront
const CHUNK_SIZE = 2 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || searchParams.get("file");

  if (!src) {
    return NextResponse.json({ error: "Missing 'src' parameter" }, { status: 400 });
  }

  // If src is an absolute HTTP/HTTPS URL, only redirect if it matches trusted media CDN hosts
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const parsedUrl = new URL(src);
      const allowedHosts = [
        "res.cloudinary.com",
        "public.blob.vercel-storage.com",
      ];
      const isAllowed = allowedHosts.some(
        (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
      );

      if (!isAllowed) {
        return NextResponse.json(
          { error: "Access denied: External media host not permitted" },
          { status: 403 }
        );
      }

      return NextResponse.redirect(src, { status: 307 });
    } catch {
      return NextResponse.json({ error: "Invalid media URL" }, { status: 400 });
    }
  }

  // Clean relative path and prevent directory traversal
  const cleanPath = src.replace(/^\/+/, "").replace(/\.\./g, "");
  const publicDir = path.resolve(process.cwd(), "public");
  const filePath = path.resolve(publicDir, cleanPath);

  // Security check: ensure path is within public/uploads or public/audio
  if (
    !filePath.startsWith(publicDir) ||
    (!filePath.includes(path.join(publicDir, "uploads")) &&
      !filePath.includes(path.join(publicDir, "audio")))
  ) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    if (cleanPath.includes("preshoot-video-0903")) {
      return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(
      { error: "File not found", file: cleanPath },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const range = request.headers.get("range");

  if (range) {
    // Parse Range header: e.g. "bytes=0-" or "bytes=1048576-2097151"
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);

    if (isNaN(start) || start >= fileSize || start < 0) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    // If client requested a specific end, respect it; otherwise stream up to CHUNK_SIZE
    let end = parts[1] ? parseInt(parts[1], 10) : start + CHUNK_SIZE - 1;
    if (isNaN(end) || end >= fileSize) {
      end = fileSize - 1;
    }

    const contentLength = end - start + 1;
    const nodeStream = fs.createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength.toString(),
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  // Non-range request: stream file with Accept-Ranges support
  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": fileSize.toString(),
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
