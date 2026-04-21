import type { GlobalConfig } from "payload";
import { revalidateAll } from "@/lib/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "footerCopyright",
      type: "text",
      localized: true,
      defaultValue: "(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED",
    },
    {
      name: "instagramUrl",
      type: "text",
      defaultValue: "https://www.instagram.com/thegrid.agency",
    },
    {
      name: "linkedinUrl",
      type: "text",
      defaultValue: "https://www.linkedin.com/company/the-grid-agency/",
    },
    {
      name: "email",
      type: "text",
      defaultValue: "contact@thegrid.agency",
    },
    {
      name: "privacyPolicyUrl",
      type: "text",
      defaultValue: "/privacy-policy",
    },
  ],
  hooks: {
    afterChange: [() => revalidateAll()],
  },
};
