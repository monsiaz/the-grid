import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "footerCopyright",
      type: "text",
      defaultValue: "(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED",
    },
    {
      name: "instagramUrl",
      type: "text",
      defaultValue: "#",
    },
    {
      name: "linkedinUrl",
      type: "text",
      defaultValue: "#",
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
};
