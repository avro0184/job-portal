// utils/media.js
export function mediaUrl(path) {
  if (!path) return null;
  // Absolute URLs (e.g. YouTube) pass through
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  // Ensure exactly one slash between base and path
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
