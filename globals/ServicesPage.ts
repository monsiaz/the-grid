import type { GlobalConfig } from "payload";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      defaultValue: "One-stop shop for motorsport",
    },
    {
      name: "heroDescription",
      type: "text",
      defaultValue:
        "Combining driver management and strategic marketing to build careers and develop high-impact partnerships",
    },
    {
      name: "heroBackgroundImage",
      type: "text",
      defaultValue: "/images/services/hero.webp",
    },
    {
      name: "talentHeading",
      type: "text",
      defaultValue: "TALENT TAKES THE WHEEL",
    },
    {
      name: "talentHeadingAccent",
      type: "text",
      defaultValue: "WE PAVE THE WAY",
    },
    {
      name: "talentDescription",
      type: "textarea",
      defaultValue:
        "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way.",
    },
    {
      name: "talentIntroText",
      type: "textarea",
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
        },
        {
          name: "image",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "partnerHeading",
      type: "text",
    },
    {
      name: "partnerDescription",
      type: "textarea",
    },
    {
      name: "valueHeading",
      type: "text",
      defaultValue: "WHERE PERFORMANCE",
    },
    {
      name: "valueHeadingAccent",
      type: "text",
      defaultValue: "VALUE",
    },
    {
      name: "valueDescription",
      type: "textarea",
    },
    {
      name: "valueIntroText",
      type: "textarea",
    },
    {
      name: "valueCards",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
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
      name: "caseStudies",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "image",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
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
