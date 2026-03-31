'use client';

/**
 * GA4 is loaded directly in layout.tsx via next/script beforeInteractive.
 * This component is kept as a no-op for backward compatibility.
 */
export function GoogleAnalytics() {
  return null;
}
