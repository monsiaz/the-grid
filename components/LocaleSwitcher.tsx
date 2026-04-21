"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { locales, localeLabels, localeFlags, type Locale } from "@/i18n/config";
import { LOCALE_ALTERNATES_ELEMENT_ID } from "@/components/LocaleAlternatesData";

function flagEmoji(iso2: string): string {
  const base = 0x1f1e6;
  return iso2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(base + (c.charCodeAt(0) - 65)))
    .join("");
}

type SwitcherEntry = { url: string; translated: boolean };
type AlternatesPayload = {
  canonical: string;
  xDefault: string;
  switcher: Record<Locale, SwitcherEntry>;
};

function readAlternatesFromDom(): AlternatesPayload | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(LOCALE_ALTERNATES_ELEMENT_ID);
  if (!el?.textContent) return null;
  try {
    const parsed = JSON.parse(el.textContent) as AlternatesPayload;
    if (parsed && parsed.switcher) return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function LocaleSwitcher() {
  const t = useTranslations("footer.language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [alternates, setAlternates] = useState<AlternatesPayload | null>(null);

  useEffect(() => {
    setAlternates(readAlternatesFromDom());
  }, [pathname]);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    if (nextLocale === locale) return;

    // Use the pre-computed sister-page URL embedded in the page (accurate for
    // dynamic routes like /news/[slug] or /drivers/[name]). Fall back to
    // next-intl router only if the data element is missing.
    // localeDetection:false means the URL is the sole locale signal — no need
    // to also write a NEXT_LOCALE cookie, but we keep it as a harmless hint.
    if (typeof document !== "undefined") {
      const oneYear = 60 * 60 * 24 * 365;
      document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=${oneYear}; SameSite=Lax`;
    }

    const explicit = alternates?.switcher?.[nextLocale]?.url;
    startTransition(() => {
      if (explicit) {
        // Hard-navigate so the full page reloads with the correct locale HTML.
        window.location.assign(explicit);
      } else {
        // Fallback: next-intl generates the prefixed (or un-prefixed for EN)
        // URL automatically thanks to localePrefix:"as-needed".
        router.replace(pathname, { locale: nextLocale });
      }
    });
  };

  return (
    <label className="relative inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-secondary/80">
      <span className="sr-only">{t("srOnly")}</span>
      <select
        aria-label={t("srOnly")}
        value={locale}
        onChange={onChange}
        disabled={isPending}
        className="h-11 cursor-pointer appearance-none rounded-full border border-secondary/40 bg-transparent py-1 pl-3 pr-8 text-[12px] leading-none uppercase tracking-[0.1em] text-secondary hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {locales.map((l) => {
          const entry = alternates?.switcher?.[l];
          const untranslated = entry ? !entry.translated : false;
          return (
            <option key={l} value={l} className="bg-primary text-secondary">
              {flagEmoji(localeFlags[l])}  {localeLabels[l]}
              {untranslated ? "  •" : ""}
            </option>
          );
        })}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-2 h-2 w-3 text-secondary/70"
      >
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </label>
  );
}
