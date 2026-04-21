import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // Never redirect based on cookie/Accept-Language — the URL is the single
  // source of truth. EN lives at `/`, other locales at `/<code>/`.
  localeDetection: false,
});
