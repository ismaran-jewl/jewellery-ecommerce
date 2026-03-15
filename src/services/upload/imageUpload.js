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
  try {
    // If it's a File/Blob, we might need to convert it or handle it differently
    // In Next.js API routes, we usually get a base64 or buffer
    
    const options = {
      folder: folder,
      resource_type: "auto",
    };

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileData, options, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
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
