import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}/`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}/`;
    },
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      defaultValue: "Opening the gates to elite motorsport",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero background image",
      required: true,
      defaultValue: "/images/hero.webp",
      description: "Visible plein écran en haut de la home.",
    }),
    {
      name: "aboutText",
      type: "textarea",
      required: true,
      localized: true,
      defaultValue:
        "We are a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.",
    },
    {
      name: "aboutButtonLabel",
      type: "text",
      localized: true,
      defaultValue: "Explore",
    },
    {
      name: "experienceText",
      type: "textarea",
      required: true,
      localized: true,
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
          localized: true,
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
      localized: true,
      defaultValue: "For deserving",
    },
    {
      name: "driversHeadingAccent",
      type: "text",
      localized: true,
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
          localized: true,
        },
        {
          name: "excerpt",
          type: "text",
          required: true,
          localized: true,
        },
        imageField({
          name: "image",
          label: "News card image",
          required: true,
          description: "Visible dans le carrousel d'actualités en page d'accueil.",
        }),
      ],
    },
  ],
};
