import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Drivers } from "./collections/Drivers";
import { News } from "./collections/News";
import { TeamMembers } from "./collections/TeamMembers";

import { Homepage } from "./globals/Homepage";
import { AboutPage } from "./globals/AboutPage";
import { ServicesPage } from "./globals/ServicesPage";
import { ContactPage } from "./globals/ContactPage";
import { DriversPage } from "./globals/DriversPage";
import { SiteSettings } from "./globals/SiteSettings";

const postgresUrl = process.env.DATABASE_URL || "";
const sqliteUrl = process.env.DATABASE_URI || "";
const usePostgres = postgresUrl.startsWith("postgres");

const db = usePostgres
  ? postgresAdapter({
      push: true,
      pool: {
        connectionString: postgresUrl,
        // Limit concurrent connections — Neon free tier has a low cap.
        // During Next.js builds multiple pages are generated in parallel;
        // without a cap this saturates the serverless DB and causes OOM errors.
        max: 5,
        idleTimeoutMillis: 10_000,
      },
    })
  : sqliteAdapter({
      push: true,
      client: {
        url: sqliteUrl || "file:./dev.db",
        authToken: process.env.TURSO_AUTH_TOKEN,
      },
    });

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: import.meta.dirname,
    },
    livePreview: {
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 1024, height: 768 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Drivers, News, TeamMembers],
  globals: [Homepage, AboutPage, ServicesPage, ContactPage, DriversPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "default-secret-change-me",
  typescript: {
    outputFile: "payload-types.ts",
  },
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Français", code: "fr" },
      { label: "Español", code: "es" },
      { label: "Deutsch", code: "de" },
      { label: "Italiano", code: "it" },
      { label: "Nederlands", code: "nl" },
      { label: "中文", code: "zh" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  db,
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
