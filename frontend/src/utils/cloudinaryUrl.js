/**
 * Optimizes Cloudinary URLs by inserting dynamic transformation parameters.
 * Useful for reducing file size significantly (especially on mobile networks).
 * 
 * @param {string} url - The original Cloudinary secure URL
 * @param {number|string} width - The target width (e.g. 500, 800, 'auto')
 * @param {string} quality - Cloudinary quality setting (defaults to 'auto')
 * @param {string} format - Cloudinary format setting (defaults to 'auto')
 * @returns {string} The optimized Cloudinary URL
 */
export const getOptimizedCloudinaryUrl = (url, width = 600, quality = "auto", format = "auto") => {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;

  const match = "/image/upload";
  const index = url.indexOf(match);

  if (index === -1) return url;

  const insertIndex = index + match.length;
  const transformation = `/q_${quality},f_${format},w_${width}`;
  
  return url.slice(0, insertIndex) + transformation + url.slice(insertIndex);
};
