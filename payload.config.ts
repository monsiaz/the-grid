import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
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
      url: process.env.DATABASE_URI || "file:./payload.db",
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
