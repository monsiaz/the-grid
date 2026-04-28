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
  label: "Page d'accueil",
  admin: {
    group: "Pages",
    description: "Contenu de la page principale du site : hero, services, pilotes, actualités. Les modifications sont appliquées en temps réel.",
    livePreview: {
      url: ({ locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        return `${base}${l}`;
      },
    },
    preview: ({ locale }: { locale?: { code?: string } } = {}) => {
      const base = getSiteUrl();
      const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
      return `${base}${l}`;
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
    {
      type: "group",
      name: "heroTitleLayout",
      label: "Réglages du titre hero (taille & position)",
      admin: {
        description:
          "Ajuste la position verticale du bloc titre, la taille du texte sur desktop / mobile, l’espace entre les deux lignes, et le centre du dégradé sombre derrière le texte. Laisser les champs vides = valeurs par défaut du site.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "marginTopMinPx",
              type: "number",
              label: "Marge haut — min (px)",
              min: 0,
              max: 400,
              defaultValue: 88,
              admin: { width: "50%", description: "Partie min du clamp (desktop > 900px)." },
            },
            {
              name: "marginTopMidVh",
              type: "number",
              label: "Marge haut — milieu (vh)",
              min: 0,
              max: 45,
              defaultValue: 17.5,
              admin: { width: "50%", step: 0.5, description: "Partie fluide (viewport)." },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "marginTopMaxPx",
              type: "number",
              label: "Marge haut — max (px)",
              min: 0,
              max: 400,
              defaultValue: 168,
              admin: { width: "50%", description: "Plafond du clamp desktop." },
            },
            {
              name: "backdropXPercent",
              type: "number",
              label: "Voile derrière le texte — position X (%)",
              min: 0,
              max: 100,
              defaultValue: 21,
              admin: { width: "50%", description: "Horizontale du dégradé (0 = gauche)." },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "backdropYPercent",
              type: "number",
              label: "Voile derrière le texte — position Y (%)",
              min: 0,
              max: 100,
              defaultValue: 54,
              admin: { width: "50%", description: "Verticale du dégradé (plus bas = valeur plus grande)." },
            },
            {
              name: "lineHeight",
              type: "number",
              label: "Interligne",
              min: 0.75,
              max: 1.2,
              defaultValue: 0.93,
              admin: { width: "50%", step: 0.01 },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "lineGapEm",
              type: "number",
              label: "Écart entre les 2 lignes (em)",
              min: 0,
              max: 0.25,
              defaultValue: 0.08,
              admin: { width: "50%", step: 0.01 },
            },
            {
              name: "trackingEm",
              type: "number",
              label: "Letter-spacing (em)",
              min: -0.1,
              max: 0.05,
              defaultValue: -0.028,
              admin: { width: "50%", step: 0.001, description: "Typiquement négatif pour les titres caps." },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "fontSizeMinPx",
              type: "number",
              label: "Taille titre — min (px)",
              min: 12,
              max: 80,
              defaultValue: 26,
              admin: {
                width: "33%",
                description: "Desktop (> 600px) : clamp min / milieu / max.",
              },
            },
            {
              name: "fontSizeMidVw",
              type: "number",
              label: "Milieu (vw)",
              min: 2,
              max: 12,
              defaultValue: 4.1,
              admin: { width: "33%", step: 0.1 },
            },
            {
              name: "fontSizeMaxPx",
              type: "number",
              label: "Max (px)",
              min: 24,
              max: 120,
              defaultValue: 76,
              admin: { width: "33%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "marginTopMobileMinPx",
              type: "number",
              label: "Marge haut mobile — min (px)",
              min: 0,
              max: 300,
              defaultValue: 72,
              admin: {
                width: "33%",
                description: "Tablette / mobile (≤ 900px) : marge au-dessus du titre.",
              },
            },
            {
              name: "marginTopMobileMidVh",
              type: "number",
              label: "Milieu (vh)",
              min: 0,
              max: 40,
              defaultValue: 15,
              admin: { width: "33%", step: 0.5 },
            },
            {
              name: "marginTopMobileMaxPx",
              type: "number",
              label: "Max (px)",
              min: 0,
              max: 300,
              defaultValue: 132,
              admin: { width: "33%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "fontSizeMobileMinPx",
              type: "number",
              label: "Taille titre mobile — min (px)",
              min: 12,
              max: 60,
              defaultValue: 24,
              admin: {
                width: "33%",
                description: "Petit écran (≤ 600px) : taille du titre.",
              },
            },
            {
              name: "fontSizeMobileMidVw",
              type: "number",
              label: "Milieu (vw)",
              min: 4,
              max: 15,
              defaultValue: 7.5,
              admin: { width: "33%", step: 0.1 },
            },
            {
              name: "fontSizeMobileMaxPx",
              type: "number",
              label: "Max (px)",
              min: 20,
              max: 80,
              defaultValue: 38,
              admin: { width: "33%" },
            },
          ],
        },
      ],
    },
    imageField({
      name: "aboutBackgroundImage",
      label: "About strip background (home block 2)",
      required: true,
      defaultValue: "/assets/v2/home/services.webp",
      description:
        "Bandeau sous le hero : visuel F1 + gradient (sans texte sur la home).",
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
      label: "Services section background (home block 4)",
      required: true,
      defaultValue: "/assets/v2/home/about.webp",
      description:
        "Photo plein bloc derrière Sport management / Image & media / Commercial development.",
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
