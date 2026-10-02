import { publicEnv } from "@/lib/env";

export const dynamic = "force-static";

/**
 * Serves /ads.txt from NEXT_PUBLIC_ADSENSE_CLIENT_ID so the publisher ID only
 * lives in one place. f08c47fec0942fa0 is Google's published certification
 * authority ID for ads.txt. Returns 404 until a client ID is configured.
 */
export function GET() {
  const clientId = publicEnv.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return new Response("Not found", { status: 404 });

  const publisherId = clientId.replace(/^ca-/, "");
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
