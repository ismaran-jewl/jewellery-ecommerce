// src/services/upload/imageUpload.js
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 5MB limit" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, WebP, and GIF images are allowed" };
  }

  return { valid: true };
};

export const uploadImage = async (file) => {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return {
      success: true,
      url: dataUrl,
      fileName: file.name,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  // For data URLs, no deletion needed
  if (imageUrl.startsWith("data:")) {
    return { success: true };
  }
  return { success: true };
};
