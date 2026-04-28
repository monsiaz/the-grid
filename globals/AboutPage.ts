import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { createSectionOrderField } from "@/fields/sectionOrderField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateAbout } from "@/lib/revalidate";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "À propos",
  access: {
    read: () => true,
  },
  admin: {
    group: "Pages",
    description: "Contenu de la page À propos : équipe, cœur de métier, section ACCÉLÈRE, galerie Instagram.",
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/about`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/about`;
    },
  },
  fields: [
    createSectionOrderField("Page sections order", [
      { label: "Hero", value: "hero" },
      { label: "Core team", value: "coreTeam" },
      { label: "ACCÉLÈRE banner", value: "accelereBanner" },
      { label: "ACCÉLÈRE follow section", value: "accelereFollow" },
    ]),
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "Who we are",
    },
    {
      name: "heroDescription",
      type: "text",
      localized: true,
      defaultValue:
        "A 360° motorsport agency built on 20 years of experience on and beyond the track",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero background image",
      defaultValue: "/images/about/hero.webp",
      description: "Visible plein écran au top de la page À propos.",
    }),
    {
      name: "coreIntroText",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Use [highlight]text[/highlight] for muted text. The intro text above the core areas cards.",
      },
      defaultValue:
        "[highlight]Our expertise is structured around [/highlight]three core areas[highlight], designed to [/highlight]support performance[highlight] on track and [/highlight]create value[highlight] beyond it[/highlight]",
    },
    {
      name: "coreAreas",
      type: "array",
      required: true,
      fields: [
        {
          name: "number",
          type: "text",
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "text",
          type: "textarea",
          required: true,
          localized: true,
        },
        imageField({
          name: "image",
          label: "Core area image",
          required: true,
          description: "Illustration de la carte métier (Sport, Image, Commercial).",
        }),
      ],
    },
    {
      name: "founderBio",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "founderName",
      type: "text",
      defaultValue: "Guillaume Le Goff",
    },
    {
      name: "founderRole",
      type: "text",
      localized: true,
      defaultValue: "Founder",
    },
    {
      name: "founderLinkedinUrl",
      type: "text",
      defaultValue: "https://www.linkedin.com/in/glegoff/",
    },
    imageField({
      name: "accelereBannerImage",
      label: "ACCÉLÈRE banner background image",
      required: true,
      defaultValue: "/assets/v2/about/accelere.webp",
      description: "Bannière pleine largeur avec le logo ACCÉLÈRE et les F3.",
    }),
    {
      name: "accelereDescription",
      type: "textarea",
      required: true,
      localized: true,
    },
    imageField({
      name: "accelerePortraitImage",
      label: "ACCÉLÈRE portrait image",
      required: true,
      defaultValue: "/assets/v2/about/accelere-portrait.webp",
      description: "Portrait affiché à gauche de la citation (ex : Pierre Gasly).",
    }),
    {
      name: "accelereQuote",
      type: "textarea",
      localized: true,
    },
    {
      name: "accelereQuoteAuthor",
      type: "text",
      defaultValue: "Pierre Gasly",
    },
    {
      name: "accelereQuoteRole",
      type: "text",
      localized: true,
      defaultValue: "BWT Alpine F1 Team Driver",
    },
    {
      name: "accelereQuoteTitle",
      type: "text",
      localized: true,
      defaultValue: "Program Sponsor",
    },
    {
      name: "instagramHandle",
      type: "text",
      defaultValue: "@THEGRID.AGENCY",
    },
    {
      name: "instagramUrl",
      type: "text",
      defaultValue: "https://www.instagram.com/thegrid.agency",
    },
    {
      name: "instagramImages",
      type: "array",
      fields: [
        imageField({
          name: "image",
          label: "Instagram tile",
          required: true,
          description: "Vignette du carrousel Instagram.",
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [() => { revalidateAbout(); }],
  },
};
