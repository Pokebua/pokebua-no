import "server-only";

import { isIP } from "node:net";

export function getBuyerIp(request) {
  // Only trust this platform header when running on Vercel.
  if (process.env.VERCEL !== "1") {
    return undefined;
  }

  const ip = request.headers.get("x-vercel-forwarded-for")?.trim();

  if (!ip || isIP(ip) === 0) {
    return undefined;
  }

  return ip;
}
