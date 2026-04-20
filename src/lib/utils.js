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
  
  // Normalize string/trimmed url and remove potential quotes
  const u = url.trim().replace(/^["']|["']$/g, "");

  // 1. Handle Google Drive Links
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

  // 2. Handle Dropbox Links
  if (u.includes("dropbox.com")) {
    if (u.includes("dl=0")) return u.replace("dl=0", "raw=1");
    if (!u.includes("raw=1") && !u.includes("dl=1")) {
      return u + (u.includes("?") ? "&" : "?") + "raw=1";
    }
    return u;
  }

  // 3. Handle Pinterest Image Links (upgrade resolution)
  if (u.includes("i.pinimg.com")) {
    // Replace low-res sizes like /236x/, /564x/, /736x/ with /originals/ for best quality
    return u.replace(/\/\d+x\//, "/originals/");
  }

  // 4. Handle Imgur Links
  if (u.includes("imgur.com") && !u.includes("i.imgur.com") && !u.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    const id = u.split("/").pop();
    if (id && id.length >= 5) {
      return `https://i.imgur.com/${id}.jpg`;
    }
  }

  // 5. Handle ImgBB viewer links (try to clean if they are partially direct)
  if (u.includes("ibb.co") && !u.includes("i.ibb.co")) {
     // User likely pasted a viewer link; we can't reliably convert it without scraping
     // But we return as is; Phase 3 will handle this by downloading the page and extracting image
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
