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
  
  // Handle Google Drive Links
  if (url.includes("drive.google.com")) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1] || url.match(/\/file\/d\/([^/]+)/)?.[1];
    if (fileId) {
      // Using drive.google.com/thumbnail is often more reliable for <img> tags across different sharing settings
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }

  // Handle ImgBB viewer links (convert to i.ibb.co)
  if (url.includes("ibb.co") && !url.includes("i.ibb.co")) {
     // NOTE: ImgBB viewer links usually don't have the file extension in the URL, 
     // making it hard to guess. However, we'll try to help if the user pastes common ones.
     // Best practice is still direct link.
  }

  return url;
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
