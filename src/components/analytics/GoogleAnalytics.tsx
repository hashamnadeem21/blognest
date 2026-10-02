import Script from "next/script";
import { isProduction, publicEnv } from "@/lib/env";

/**
 * GA4 with Google Consent Mode v2 defaults.
 * Analytics/ads storage defaults to "denied" in the EEA, UK and Switzerland
 * until a Google-certified CMP (e.g. AdSense "Privacy & messaging") updates
 * consent. Elsewhere it defaults to granted. Adjust to your legal advice.
 */
const CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IS", "IE", "IT", "LV",
  "LI", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
];

export function GoogleAnalytics() {
  const id = publicEnv.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!isProduction || !id) return null;

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)},wait_for_update:500});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${id}');`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
