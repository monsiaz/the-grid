import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/services/`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/services/`;
    },
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "One-stop shop for motorsport",
    },
    {
      name: "heroDescription",
      type: "text",
      localized: true,
      defaultValue:
        "Combining driver management and strategic marketing to build careers and develop high-impact partnerships",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero background image",
      defaultValue: "/images/services/hero.webp",
      description: "Image plein écran en haut de /services/.",
    }),
    {
      name: "talentHeading",
      type: "text",
      localized: true,
      defaultValue: "TALENT TAKES THE WHEEL",
    },
    {
      name: "talentHeadingAccent",
      type: "text",
      localized: true,
      defaultValue: "WE PAVE THE WAY",
    },
    {
      name: "talentDescription",
      type: "textarea",
      localized: true,
      defaultValue:
        "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way.",
    },
    {
      name: "talentIntroText",
      type: "textarea",
      localized: true,
      defaultValue:
        "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
    },
    {
      name: "talentCards",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        imageField({
          name: "image",
          label: "Talent card image",
          required: true,
          description: "Illustration de la flip-card Talent.",
        }),
        {
          name: "description",
          type: "textarea",
          localized: true,
        },
      ],
    },
    {
      name: "partnerHeading",
      type: "text",
      localized: true,
    },
    {
      name: "partnerDescription",
      type: "textarea",
      localized: true,
    },
    {
      name: "valueHeading",
      type: "text",
      localized: true,
      defaultValue: "WHERE PERFORMANCE",
    },
    {
      name: "valueHeadingAccent",
      type: "text",
      localized: true,
      defaultValue: "VALUE",
    },
    {
      name: "valueDescription",
      type: "textarea",
      localized: true,
    },
    {
      name: "valueIntroText",
      type: "textarea",
      localized: true,
    },
    {
      name: "valueCards",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        imageField({
          name: "image",
          label: "Value card image",
          required: true,
          description: "Illustration de la flip-card Value.",
        }),
        {
          name: "description",
          type: "textarea",
          localized: true,
        },
      ],
    },
    {
      name: "caseStudies",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          localized: true,
        },
        imageField({
          name: "image",
          label: "Case study image",
          required: true,
          description: "Photo principale du case study.",
        }),
        {
          name: "description",
          type: "textarea",
          localized: true,
        },
        {
          name: "dimmed",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};
