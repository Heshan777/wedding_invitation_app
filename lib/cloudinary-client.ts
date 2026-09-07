/**
 * Cloudinary Client-side Direct Upload Utility
 * Uploads media files directly from the user's browser to Cloudinary.
 * Bypasses Vercel's 4.5MB Serverless Function payload limit, enabling large video and audio uploads.
 */

export interface CloudinaryClientUploadOptions {
  folder?: string;
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

export function isCloudinaryClientConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  return Boolean(cloudName && uploadPreset);
}

export function getCloudinaryCloudName(): string | null {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null;
}

/**
 * Uploads a File directly to Cloudinary with real-time progress callbacks
 */
export function uploadToCloudinary(
  file: File,
  options: CloudinaryClientUploadOptions = {}
): Promise<CloudinaryClientUploadResponse> {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return reject(
        new Error(
          "Cloudinary is not configured. Please verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment."
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
          const errMsg = data.error?.message || `Cloudinary upload failed with status ${xhr.status}`;
          reject(new Error(errMsg));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        reject(new Error(`Failed to parse Cloudinary response: ${message}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload. Please check your internet connection."));
    };

    xhr.ontimeout = () => {
      reject(new Error("Cloudinary upload request timed out."));
    };

    xhr.send(formData);
  });
}
