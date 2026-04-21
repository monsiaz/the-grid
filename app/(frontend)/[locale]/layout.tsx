import type { Metadata, Viewport } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { htmlLangAttribute, type Locale } from "@/i18n/config";
import { getSiteUrl } from "@/lib/siteUrl";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: true,
  fallback: ["Impact", "Arial Black", "Helvetica", "sans-serif"],
});

const SITE_URL = getSiteUrl();
const SITE_NAME = "The Grid Agency";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ locale: routing.defaultLocale }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("home.title"),
      template: t("default.template"),
    },
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
    },
    category: "sports",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f0f0f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const lang = htmlLangAttribute[locale as Locale];
  const t = await getTranslations({ locale, namespace: "skip" });

  return (
    <html
      lang={lang}
      className={`${poppins.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.orbs.cloud" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.orbs.cloud" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          {t("toContent")}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
