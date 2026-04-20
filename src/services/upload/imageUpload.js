// src/services/upload/imageUpload.js
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for Cloudinary
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 10MB limit" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }

  return { valid: true };
};

/**
 * Uploads an image to Cloudinary
 * @param {string|Buffer|File} fileData - Base64 string, Buffer, or File object
 * @param {string} folder - Cloudinary folder name
 */
export const uploadImage = async (fileData, folder = "jewellery") => {
  const upload = async (timestamp) => {
    const options = {
      folder: folder,
      resource_type: "auto",
      timestamp: timestamp || Math.floor(Date.now() / 1000),
    };

    return await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileData, options, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };

  try {
    const result = await upload();
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    // If the failure is due to a stale request (system clock out of sync)
    if (error.message && (error.message.includes("Stale request") || error.message.includes("timestamp"))) {
      console.warn("Detected clock drift. Attempting to sync with Cloudinary server time...");
      try {
        // Fetch current time from a reliable source (using Cloudinary's own response headers)
        const timeRes = await fetch("https://res.cloudinary.com", { method: "HEAD" });
        const serverDate = timeRes.headers.get("date");
        if (serverDate) {
          const serverTimestamp = Math.floor(new Date(serverDate).getTime() / 1000);
          const result = await upload(serverTimestamp);
          return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          };
        }
      } catch (syncError) {
        console.error("Clock sync failed:", syncError);
      }
    }

    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "Failed to upload image to Cloudinary");
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return { success: true };
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === "ok" };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Lists resources from Cloudinary
 */
export const listImages = async (folder = "jewellery", maxResults = 50) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
    });
    return { success: true, images: result.resources };
  } catch (error) {
    console.error("Cloudinary list error:", error);
    return { success: false, error: error.message };
  }
};
