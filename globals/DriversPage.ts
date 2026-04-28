import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { createSectionOrderField } from "@/fields/sectionOrderField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateDriversIndex } from "@/lib/revalidate";

export const DriversPage: GlobalConfig = {
  slug: "drivers-page",
  label: "Page Pilotes",
  access: {
    read: () => true,
  },
  admin: {
    group: "Pages",
    description: "Contenu de la page listing des pilotes : hero et grille. Les fiches individuelles se gèrent dans la collection Pilotes.",
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/drivers`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/drivers`;
    },
  },
  fields: [
    createSectionOrderField("Page sections order", [
      { label: "Hero", value: "hero" },
      { label: "Drivers grid", value: "grid" },
    ]),
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
  hooks: {
    afterChange: [() => { revalidateDriversIndex(); }],
  },
};
