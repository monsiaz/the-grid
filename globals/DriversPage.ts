import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";

export const DriversPage: GlobalConfig = {
  slug: "drivers-page",
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/drivers/`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/drivers/`;
    },
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "Our drivers",
    },
    {
      name: "heroDescription",
      type: "text",
      localized: true,
      defaultValue: "The next generation of motorsport talent",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero background image",
      defaultValue: "/images/drivers/hero.webp",
      description: "Image plein écran au top de /drivers/.",
    }),
  ],
};
