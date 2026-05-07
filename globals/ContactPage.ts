import type { GlobalConfig } from "payload";
import { focalPointField } from "@/fields/focalPointField";
import { imageField } from "@/fields/imageField";
import { seoField } from "@/fields/seoField";
import { createSectionOrderField } from "@/fields/sectionOrderField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateContact } from "@/lib/revalidate";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact",
  access: {
    read: () => true,
  },
  admin: {
    group: "Pages",
    description: "Contenu de la page Contact : hero, formulaire de contact et newsletter.",
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/contact`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/contact`;
    },
  },
  fields: [
    seoField(),
    createSectionOrderField("Page sections order", [
      { label: "Hero / forms", value: "hero" },
    ]),
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
    focalPointField({
      name: "heroBackgroundImageFocalPoint",
      label: "Hero background image — cadrage",
    }),
  ],
  hooks: {
    afterChange: [() => { revalidateContact(); }],
  },
};
