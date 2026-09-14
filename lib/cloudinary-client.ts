/**
 * Cloudinary Client-side Direct Upload Utility
 * Uploads media files directly from the user's browser to Cloudinary.
 * Bypasses Vercel's 4.5MB Serverless Function payload limit, enabling large video and audio uploads.
 */

export interface CloudinaryClientUploadOptions {
  folder?: string;
  cloudName?: string;
  uploadPreset?: string;
  onProgress?: (percent: number) => void;
}

export interface CloudinaryClientUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  duration?: number;
  is_audio?: boolean;
}

let runtimeCloudinaryConfig: { cloudName: string | null; uploadPreset: string | null } | null = null;

export function setRuntimeCloudinaryConfig(config: {
  cloudName?: string | null;
  uploadPreset?: string | null;
}) {
  runtimeCloudinaryConfig = {
    cloudName: config.cloudName || null,
    uploadPreset: config.uploadPreset || null,
  };
}

export function isCloudinaryClientConfigured(customConfig?: {
  cloudName?: string | null;
  uploadPreset?: string | null;
}): boolean {
  const cloudName =
    customConfig?.cloudName ||
    runtimeCloudinaryConfig?.cloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    customConfig?.uploadPreset ||
    runtimeCloudinaryConfig?.uploadPreset ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  return Boolean(cloudName && uploadPreset);
}

export function getCloudinaryCloudName(): string | null {
  return (
    runtimeCloudinaryConfig?.cloudName ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    null
  );
}

/**
 * Compresses an image client-side before upload to avoid payload limits (e.g. 4.5MB Vercel limit)
 * and ensure fast mobile delivery. Retains high fidelity with 2048px max bounds and JPEG 0.85 quality.
 */
export async function compressImageForUpload(
  file: File,
  maxDimension = 2048,
  quality = 0.85
): Promise<File> {
  // Only compress images, skip SVG and GIF (preserve animations / vectors)
  if (
    !file.type.startsWith("image/") ||
    file.type.includes("svg") ||
    file.type.includes("gif")
  ) {
    return file;
  }

  // If already lightweight (under 1.5MB), no downscaling strictly required
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let { width, height } = img;
        if (width <= 0 || height <= 0) {
          resolve(file);
          return;
        }

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't save space, return original file
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], cleanName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      } catch (err) {
        console.warn("Client image compression error, using original file:", err);
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a File directly to Cloudinary with real-time progress callbacks
 */
export function uploadToCloudinary(
  file: File,
  options: CloudinaryClientUploadOptions = {}
): Promise<CloudinaryClientUploadResponse> {
  return new Promise((resolve, reject) => {
    const cloudName =
      options.cloudName ||
      runtimeCloudinaryConfig?.cloudName ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      options.uploadPreset ||
      runtimeCloudinaryConfig?.uploadPreset ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return reject(
        new Error(
          "Cloudinary is not configured. Please verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables."
        )
      );
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);

    if (options.onProgress && xhr.upload) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress!(percent);
        }
      });
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && !data.error) {
          resolve({
            url: data.url,
            secure_url: data.secure_url,
            public_id: data.public_id,
            resource_type: data.resource_type,
            format: data.format,
            bytes: data.bytes,
            duration: data.duration,
            is_audio: data.is_audio,
          });
        } else {
          const errMsg =
            data.error?.message || `Cloudinary upload failed with status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        reject(new Error(`Failed to parse Cloudinary response: ${message}`));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Network error during Cloudinary upload. Please check your internet connection."
        )
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Cloudinary upload request timed out."));
    };

    xhr.send(formData);
  });
}
