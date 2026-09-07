/**
 * Cloudinary Server Utilities
 * Handles server-side uploads and configuration inspection
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  return { cloudName, uploadPreset };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  duration?: number;
  is_audio?: boolean;
}

/**
 * Upload an in-memory buffer to Cloudinary using the unsigned upload preset
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folder: string = "wedding-media"
): Promise<CloudinaryUploadResult> {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error(
      "Cloudinary is not configured. Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`;

  // Create form data using standard Node.js Blob
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("upload_preset", config.uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `Upload failed with status ${response.status}`;
    throw new Error(`Cloudinary upload failed: ${errorMsg}`);
  }

  return {
    url: data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    resource_type: data.resource_type,
    format: data.format,
    bytes: data.bytes,
    duration: data.duration,
    is_audio: data.is_audio,
  };
}
