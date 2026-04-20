import type { Metadata, Viewport } from "next";
import { League_Spartan, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://the-grid-pi.vercel.app";
const SITE_NAME = "The Grid Agency";
const SITE_DESCRIPTION =
  "The Grid is a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "THE GRID — Motorsport Agency",
    template: "%s | THE GRID",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "motorsport agency",
    "driver management",
    "Formula 1",
    "Formula 2",
    "Formula 3",
    "karting",
    "sport marketing",
    "Pierre Gasly",
    "Isack Hadjar",
    "The Grid",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "THE GRID — Motorsport Agency",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "The Grid — Opening the gates to elite motorsport",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE GRID — Motorsport Agency",
    description: SITE_DESCRIPTION,
    images: ["/images/hero.webp"],
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f0f0f" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.orbs.cloud" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.orbs.cloud" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
