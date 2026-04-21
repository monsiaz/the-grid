import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateContact } from "@/lib/revalidate";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/contact/`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/contact/`;
    },
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "Get in touch",
    },
    {
      name: "heroDescription",
      type: "text",
      localized: true,
      defaultValue: "We would love to hear from you",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero background image",
      defaultValue: "/images/contact/hero.webp",
      description: "Image plein écran en haut de /contact/.",
    }),
  ],
  hooks: {
    afterChange: [() => { revalidateContact(); }],
  },
};
