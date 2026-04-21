import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { createSectionOrderField } from "@/fields/sectionOrderField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateHomepage } from "@/lib/revalidate";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: {
    read: () => true,
  },
  label: "🏠 Page d'accueil",
  admin: {
    group: "🗂️ Pages",
    description: "Contenu de la page principale du site : hero, services, pilotes, actualités. Les modifications sont appliquées en temps réel.",
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
    createSectionOrderField("Page sections order", [
      { label: "Hero", value: "hero" },
      { label: "About", value: "about" },
      { label: "Experience", value: "experience" },
      { label: "Services", value: "services" },
      { label: "News", value: "news" },
      { label: "Drivers", value: "drivers" },
    ]),
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
    imageField({
      name: "aboutBackgroundImage",
      label: "About section background image",
      required: true,
      defaultValue: "/images/about.webp",
      description: "Image plein largeur derrière le pitch « About ».",
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
    imageField({
      name: "servicesBackgroundImage",
      label: "Services section background image",
      required: true,
      defaultValue: "/images/services.webp",
      description: "Image plein largeur derrière la liste des services.",
    }),
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
    imageField({
      name: "driversBackgroundImage",
      label: "Drivers section background image",
      required: true,
      defaultValue: "/images/drivers.webp",
      description: "Image plein largeur derrière le CTA « For deserving drivers ».",
    }),
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
  hooks: {
    afterChange: [() => { revalidateHomepage(); }],
  },
};
