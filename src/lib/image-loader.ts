/**
 * Custom image loader for Next.js Image component
 * This allows images from any external domain to be loaded
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path, return it as-is (Next.js will handle it)
  return src;
}
