import type { GlobalConfig } from "payload";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      defaultValue: "Who we are",
    },
    {
      name: "heroDescription",
      type: "text",
      defaultValue:
        "A 360° motorsport agency built on 20 years of experience on and beyond the track",
    },
    {
      name: "heroBackgroundImage",
      type: "text",
      defaultValue: "/images/about/hero.webp",
    },
    {
      name: "coreIntroText",
      type: "textarea",
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
        },
        {
          name: "text",
          type: "textarea",
          required: true,
        },
        {
          name: "image",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "founderBio",
      type: "textarea",
      required: true,
    },
    {
      name: "accelereDescription",
      type: "textarea",
      required: true,
    },
    {
      name: "accelereQuote",
      type: "textarea",
    },
    {
      name: "accelereQuoteAuthor",
      type: "text",
      defaultValue: "Pierre Gasly",
    },
    {
      name: "accelereQuoteRole",
      type: "text",
      defaultValue: "BWT Alpine F1 Team Driver",
    },
    {
      name: "accelereQuoteTitle",
      type: "text",
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
      defaultValue: "https://instagram.com",
    },
    {
      name: "instagramImages",
      type: "array",
      fields: [
        {
          name: "image",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
