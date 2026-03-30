import type { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      defaultValue: "Opening the gates to elite motorsport",
    },
    {
      name: "heroBackgroundImage",
      type: "text",
      required: true,
      defaultValue: "/images/hero.webp",
    },
    {
      name: "aboutText",
      type: "textarea",
      required: true,
      defaultValue:
        "We are a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.",
    },
    {
      name: "aboutButtonLabel",
      type: "text",
      defaultValue: "Explore",
    },
    {
      name: "experienceText",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Use [highlight]text[/highlight] to mark muted/highlighted text segments",
      },
      defaultValue:
        "We leverage over [highlight]20 years of experience[/highlight], operating globally [highlight]on and beyond the track[/highlight] - connecting talent, teams, brands and investors [highlight]AT every level[/highlight] of the sport.",
    },
    {
      name: "serviceLabels",
      type: "array",
      required: true,
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
      ],
      defaultValue: [
        { label: "Sport management" },
        { label: "Image & media" },
        { label: "Commercial development" },
      ],
    },
    {
      name: "driversHeading",
      type: "text",
      defaultValue: "For deserving",
    },
    {
      name: "driversHeadingAccent",
      type: "text",
      defaultValue: "drivers",
    },
    {
      name: "homepageNewsItems",
      type: "array",
      label: "Featured News (Homepage Carousel)",
      fields: [
        {
          name: "newsSlug",
          type: "text",
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "excerpt",
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
  ],
};
