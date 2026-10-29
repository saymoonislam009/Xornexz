"use client";

/**
 * Non-blocking PreloaderWrapper:
 * Previously rendered a full-screen solid black overlay during SSR hydration,
 * delaying First Contentful Paint / Largest Contentful Paint and making the
 * site feel slow to appear even on fast connections. Now renders zero blocking
 * overlays so server-rendered Hero content paints immediately on frame 1.
 */
export default function PreloaderWrapper() {
  return null;
}
