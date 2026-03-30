import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";

import { Users } from "./collections/Users.ts";
import { Media } from "./collections/Media.ts";
import { Drivers } from "./collections/Drivers.ts";
import { News } from "./collections/News.ts";
import { TeamMembers } from "./collections/TeamMembers.ts";

import { Homepage } from "./globals/Homepage.ts";
import { AboutPage } from "./globals/AboutPage.ts";
import { ServicesPage } from "./globals/ServicesPage.ts";
import { ContactPage } from "./globals/ContactPage.ts";
import { DriversPage } from "./globals/DriversPage.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: import.meta.dirname,
    },
  },
  collections: [Users, Media, Drivers, News, TeamMembers],
  globals: [Homepage, AboutPage, ServicesPage, ContactPage, DriversPage, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "default-secret-change-me",
  typescript: {
    outputFile: "payload-types.ts",
  },
  db: sqliteAdapter({
    push: true,
    client: {
      url: process.env.DATABASE_URI || "",
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
});
