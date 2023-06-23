export default function now(): number {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return Date.now();
  }

  return performance.now();
}
