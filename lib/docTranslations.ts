import type { Payload } from "payload";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

/**
 * Detect which locales a document has been *really* translated to.
 *
 * A locale is considered "translated" when at least one of the provided
 * probe fields has a non-empty value when queried with `fallbackLocale: false`.
 *
 * The default locale is always considered translated (source of truth).
 */
export async function detectTranslatedLocales<TCollection extends "news" | "drivers">(args: {
  payload: Payload;
  collection: TCollection;
  docId: number | string;
  probeFields: string[];
}): Promise<{
  translated: Record<Locale, boolean>;
  translatedLocales: Locale[];
}> {
  const { payload, collection, docId, probeFields } = args;

  const translated: Record<Locale, boolean> = {
    en: false,
    fr: false,
    es: false,
    de: false,
    it: false,
    nl: false,
    zh: false,
  };

  await Promise.all(
    locales.map(async (loc) => {
      if (loc === defaultLocale) {
        translated[loc] = true;
        return;
      }
      try {
        const doc = (await payload.findByID({
          collection,
          id: docId as number,
          locale: loc,
          fallbackLocale: false,
          depth: 0,
        })) as unknown as Record<string, unknown>;
        const hasAny = probeFields.some((f) => {
          const parts = f.split(".");
          let v: unknown = doc;
          for (const p of parts) {
            if (v && typeof v === "object" && p in (v as Record<string, unknown>)) {
              v = (v as Record<string, unknown>)[p];
            } else {
              v = undefined;
              break;
            }
          }
          if (v == null) return false;
          if (typeof v === "string") return v.trim().length > 0;
          if (Array.isArray(v)) return v.length > 0;
          return true;
        });
        translated[loc] = hasAny;
      } catch {
        translated[loc] = false;
      }
    }),
  );

  return {
    translated,
    translatedLocales: locales.filter((l) => translated[l]),
  };
}
