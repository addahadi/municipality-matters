/**
 * landingAssets.ts
 * ------------------------------------------------------------------
 * Every image used by the landing page lives here so it can be swapped
 * for official municipality photography in ONE line each.
 *
 * ⚠️  REPLACE BEFORE PRODUCTION
 * These are Unsplash CDN URLs used as tasteful defaults so the page
 * looks finished immediately. For a real government deployment, replace
 * each URL with owned / properly-licensed imagery (licensing + local
 * authenticity). Prefer photos of the actual commune / wilaya.
 * ------------------------------------------------------------------
 */

export const landingAssets = {
  /** Static fallback shown instead of the 3D scene on mobile / reduced-motion. */
  heroFallback:
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=70",

  /** Security & data-protection section visual. */
  security:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=70",

  /** Announcement preview thumbnails. */
  announcement1:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=70",
  announcement2:
    "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=70",
  announcement3:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70",
} as const;

export type LandingAssetKey = keyof typeof landingAssets;
