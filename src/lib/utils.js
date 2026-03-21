import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes image URLs from various sources (Google Drive, ImgBB, etc.)
 * to ensure they are direct image assets that can be rendered in <img> tags.
 */
export function getImageUrl(url) {
  if (!url) return "";
  
  // Normalize string/trimmed url
  const u = url.trim();

  // Handle Google Drive Links
  if (u.includes("drive.google.com") || u.includes("docs.google.com")) {
    const fileId = u.match(/\/d\/([^/]+)/)?.[1] || 
                   u.match(/id=([^&]+)/)?.[1] || 
                   u.match(/\/file\/d\/([^/]+)/)?.[1];
    if (fileId) {
      // thumbnail?id is excellent for <img> tags as it handles larger images by resizing them
      // and typically doesn't trigger the "too large to scan" virus warning page
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  // Handle ImgBB viewer links (convert to i.ibb.co)
  if (u.includes("ibb.co") && !u.includes("i.ibb.co")) {
     const parts = u.split("/");
     const id = parts[parts.length - 1];
     if (id && id.length > 5) {
        // Fallback or guess format
     }
  }

  return u;
}

/**
 * Generates a Cloudinary transformation URL
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 */
export function getCloudinaryUrl(url, { width, height, crop = "fill", quality = "auto" } = {}) {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  
  let transformations = `q_${quality},f_auto`;
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (crop) transformations += `,c_${crop}`;
  
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
