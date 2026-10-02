import { isProduction, publicEnv } from "@/lib/env";

export type AdPlacement = "in-article" | "sidebar" | "below-article" | "listing";

export interface AdsConfig {
  /** True only when ads should actually be requested from Google. */
  enabled: boolean;
  clientId?: string;
  /** Development aid: render labeled boxes where ads would appear. */
  showPlaceholders: boolean;
  slots: Partial<Record<AdPlacement, string>>;
}

/**
 * Ads are requested only when ALL of the following are true:
 *  - production build (`next build` / Vercel)
 *  - NEXT_PUBLIC_ADS_ENABLED=true
 *  - a valid NEXT_PUBLIC_ADSENSE_CLIENT_ID (ca-pub-…)
 * Individual placements additionally need their slot ID.
 */
export function getAdsConfig(): AdsConfig {
  const clientId = publicEnv.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return {
    enabled: isProduction && publicEnv.NEXT_PUBLIC_ADS_ENABLED && Boolean(clientId),
    clientId,
    showPlaceholders: !isProduction && publicEnv.NEXT_PUBLIC_ADS_SHOW_PLACEHOLDERS,
    slots: {
      "in-article": publicEnv.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
      sidebar: publicEnv.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
      "below-article": publicEnv.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_ARTICLE,
      listing: publicEnv.NEXT_PUBLIC_ADSENSE_SLOT_LISTING,
    },
  };
}

/** Reserved heights (px) prevent layout shift while ads load. */
export const adPlacementStyles: Record<AdPlacement, { minHeight: string; format: string; layout?: string }> = {
  "in-article": { minHeight: "min-h-[280px]", format: "fluid", layout: "in-article" },
  sidebar: { minHeight: "min-h-[600px]", format: "auto" },
  "below-article": { minHeight: "min-h-[280px]", format: "auto" },
  listing: { minHeight: "min-h-[250px]", format: "auto" },
};
