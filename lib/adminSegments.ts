/**
 * Next.js optional catch-all dynamic segments may be `string[]`, a single `string`
 * (path joined), or `undefined` — see dynamic route docs. Payload admin resolves
 * globals/collections from `segments[n]` and treats non-arrays as empty → 404.
 */
export function normalizeAdminRouteSegments(
  value: string | string[] | undefined,
): string[] {
  if (Array.isArray(value)) {
    if (value.length === 1 && typeof value[0] === "string" && value[0].includes("/")) {
      return value[0].split("/").filter(Boolean);
    }
    return value;
  }
  if (typeof value === "string" && value.length > 0) {
    return value.split("/").filter(Boolean);
  }
  return [];
}
