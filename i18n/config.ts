export const locales = ["en", "fr", "es", "de", "it", "nl", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  nl: "Nederlands",
  zh: "中文",
};

export const localeFlags: Record<Locale, string> = {
  en: "GB",
  fr: "FR",
  es: "ES",
  de: "DE",
  it: "IT",
  nl: "NL",
  zh: "CN",
};

export const htmlLangAttribute: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  it: "it",
  nl: "nl",
  zh: "zh",
};

export const hreflangTag: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  it: "it",
  nl: "nl",
  zh: "zh",
};

export const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
  it: "it_IT",
  nl: "nl_NL",
  zh: "zh_CN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
