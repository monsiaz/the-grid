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
      admin: {
        description: "Titre principal du hero, affiché en grand sur la photo de fond. Actuellement : \"Opening the gates to elite motorsport\".",
      },
    },
    imageField({
      name: "heroBackgroundImage",
      label: "Hero — Image de fond",
      required: true,
      defaultValue: "/images/hero.webp",
      description: "Photo plein écran en haut de la home. Visible en arrière-plan du titre. Valeur par défaut : /images/hero.webp",
    }),
    {
      type: "group",
      name: "heroTitleLayout",
      label: "Hero — Position & typographie du titre",
      admin: {
        description:
          "Réglages fins du titre \"Opening the gates to elite motorsport\". " +
          "Chaque ligne utilise la formule CSS clamp(min, milieu, max) : la valeur s'adapte fluidement entre le min et le max selon la taille de l'écran. " +
          "Les valeurs actuelles (prod) sont pré-remplies. Modifiez, sauvegardez, puis rechargez la home pour voir l'effet.",
      },
      fields: [
        // ── Position verticale — Desktop ──────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "marginTopMinPx",
              type: "number",
              label: "Position verticale desktop — Min (px)",
              min: 0,
              max: 400,
              defaultValue: 88,
              admin: {
                width: "33%",
                description:
                  "Défaut : 88 px\n" +
                  "Plancher de la marge au-dessus du titre (écrans > 900 px). " +
                  "Formule live : clamp(88px, 17.5vh, 168px). Augmenter = titre plus bas.",
              },
            },
            {
              name: "marginTopMidVh",
              type: "number",
              label: "Milieu (vh)",
              min: 0,
              max: 45,
              defaultValue: 17.5,
              admin: {
                width: "33%",
                step: 0.5,
                description:
                  "Défaut : 17.5 vh\n" +
                  "Partie fluide (% hauteur écran). 17.5 vh ≈ 189 px sur un écran 1080 px de haut.",
              },
            },
            {
              name: "marginTopMaxPx",
              type: "number",
              label: "Max (px)",
              min: 0,
              max: 400,
              defaultValue: 168,
              admin: {
                width: "33%",
                description:
                  "Défaut : 168 px\n" +
                  "Plafond — même sur très grand écran, la marge ne dépassera jamais cette valeur.",
              },
            },
          ],
        },

        // ── Position verticale — Mobile ───────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "marginTopMobileMinPx",
              type: "number",
              label: "Position verticale mobile — Min (px)",
              min: 0,
              max: 300,
              defaultValue: 72,
              admin: {
                width: "33%",
                description:
                  "Défaut : 72 px\n" +
                  "Plancher de la marge sur tablette / mobile (≤ 900 px). " +
                  "Formule live : clamp(72px, 15vh, 132px).",
              },
            },
            {
              name: "marginTopMobileMidVh",
              type: "number",
              label: "Milieu (vh)",
              min: 0,
              max: 40,
              defaultValue: 15,
              admin: {
                width: "33%",
                step: 0.5,
                description:
                  "Défaut : 15 vh\n" +
                  "15 vh ≈ 123 px sur iPhone 14 (844 px de haut).",
              },
            },
            {
              name: "marginTopMobileMaxPx",
              type: "number",
              label: "Max (px)",
              min: 0,
              max: 300,
              defaultValue: 132,
              admin: {
                width: "33%",
                description: "Défaut : 132 px",
              },
            },
          ],
        },

        // ── Taille de police — Desktop ────────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "fontSizeMinPx",
              type: "number",
              label: "Taille titre desktop — Min (px)",
              min: 12,
              max: 80,
              defaultValue: 26,
              admin: {
                width: "33%",
                description:
                  "Défaut : 26 px\n" +
                  "Taille minimale du titre sur écrans >= 600 px. " +
                  "Formule live : clamp(26px, 4.1vw, 76px).",
              },
            },
            {
              name: "fontSizeMidVw",
              type: "number",
              label: "Milieu (vw)",
              min: 2,
              max: 12,
              defaultValue: 4.1,
              admin: {
                width: "33%",
                step: 0.1,
                description:
                  "Défaut : 4.1 vw\n" +
                  "Taille fluide (% de la largeur écran). 4.1 vw ≈ 59 px sur un écran 1440 px de large.",
              },
            },
            {
              name: "fontSizeMaxPx",
              type: "number",
              label: "Max (px)",
              min: 24,
              max: 120,
              defaultValue: 76,
              admin: {
                width: "33%",
                description:
                  "Défaut : 76 px\n" +
                  "Plafond absolu — le titre ne sera jamais plus grand que cette valeur, même sur grand écran.",
              },
            },
          ],
        },

        // ── Taille de police — Mobile ─────────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "fontSizeMobileMinPx",
              type: "number",
              label: "Taille titre mobile — Min (px)",
              min: 12,
              max: 60,
              defaultValue: 24,
              admin: {
                width: "33%",
                description:
                  "Défaut : 24 px\n" +
                  "Taille minimale sur petit écran (< 600 px). " +
                  "Formule live : clamp(24px, 7.5vw, 38px).",
              },
            },
            {
              name: "fontSizeMobileMidVw",
              type: "number",
              label: "Milieu (vw)",
              min: 4,
              max: 15,
              defaultValue: 7.5,
              admin: {
                width: "33%",
                step: 0.1,
                description:
                  "Défaut : 7.5 vw\n" +
                  "7.5 vw ≈ 29 px sur iPhone 14 (390 px de large).",
              },
            },
            {
              name: "fontSizeMobileMaxPx",
              type: "number",
              label: "Max (px)",
              min: 20,
              max: 80,
              defaultValue: 38,
              admin: {
                width: "33%",
                description: "Défaut : 38 px",
              },
            },
          ],
        },

        // ── Typographie ───────────────────────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "lineHeight",
              type: "number",
              label: "Interligne (line-height)",
              min: 0.75,
              max: 1.2,
              defaultValue: 0.93,
              admin: {
                width: "33%",
                step: 0.01,
                description:
                  "Défaut : 0.93\n" +
                  "Espacement vertical entre les deux lignes du titre. " +
                  "< 1 = serré (adapté aux titres caps), > 1 = aéré. Ex : 0.9 tres serré, 1.1 aéré.",
              },
            },
            {
              name: "lineGapEm",
              type: "number",
              label: "Écart entre les 2 lignes (em)",
              min: 0,
              max: 0.25,
              defaultValue: 0.08,
              admin: {
                width: "33%",
                step: 0.01,
                description:
                  "Défaut : 0.08 em\n" +
                  "Espace supplémentaire inséré entre la ligne 1 et la ligne 2 du titre (s'ajoute à l'interligne). " +
                  "0 = aucun écart, 0.1 = léger souffle.",
              },
            },
            {
              name: "trackingEm",
              type: "number",
              label: "Letter-spacing (em)",
              min: -0.1,
              max: 0.05,
              defaultValue: -0.028,
              admin: {
                width: "33%",
                step: 0.001,
                description:
                  "Défaut : -0.028 em\n" +
                  "Espacement entre les lettres. Valeur négative = lettres resserrées (recommandé pour titres caps). " +
                  "-0.028 = léger resserrement prod, 0 = normal, +0.05 = aéré.",
              },
            },
          ],
        },

        // ── Voile sombre derrière le texte ────────────────────────────
        {
          type: "row",
          fields: [
            {
              name: "backdropXPercent",
              type: "number",
              label: "Voile derrière le texte — Position X (%)",
              min: 0,
              max: 100,
              defaultValue: 21,
              admin: {
                width: "50%",
                description:
                  "Défaut : 21 %\n" +
                  "Centre horizontal du dégradé sombre placé derrière le titre pour le rendre lisible sur la photo. " +
                  "0 % = bord gauche, 50 % = centre, 100 % = bord droit. " +
                  "A ajuster si l'image de fond change.",
              },
            },
            {
              name: "backdropYPercent",
              type: "number",
              label: "Voile derrière le texte — Position Y (%)",
              min: 0,
              max: 100,
              defaultValue: 54,
              admin: {
                width: "50%",
                description:
                  "Défaut : 54 %\n" +
                  "Centre vertical du dégradé. 0 % = haut, 100 % = bas. " +
                  "54 % = légèrement sous le centre de l'image, suit le titre.",
              },
            },
          ],
        },
      ],
    },
    imageField({
      name: "aboutBackgroundImage",
      label: "About strip — Image de fond (bloc 2)",
      required: true,
      defaultValue: "/assets/v2/home/services.webp",
      description:
        "Bandeau sous le hero : visuel F1 + gradient (sans texte sur la home). Valeur par défaut : /assets/v2/home/services.webp",
    }),
    {
      name: "aboutText",
      type: "textarea",
      required: true,
      localized: true,
      defaultValue:
        "We are a 360° motorsport agency combining driver management and strategic marketing to build careers and develop high-impact partnerships across the ecosystem.",
      admin: {
        description: "Texte du bloc « About » (section 2). Actuellement : \"We are a 360° motorsport agency…\".",
      },
    },
    {
      name: "aboutButtonLabel",
      type: "text",
      localized: true,
      defaultValue: "Explore",
      admin: {
        description: "Label du bouton CTA sous le texte About. Défaut : \"Explore\".",
      },
    },
    {
      name: "experienceText",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description:
          "Texte de la section Experience (bloc 3). Utilisez [highlight]texte[/highlight] pour les segments en style atténué/accentué. " +
          "Ex : [highlight]20 years of experience[/highlight].",
      },
      defaultValue:
        "We leverage over [highlight]20 years of experience[/highlight], operating globally [highlight]on and beyond the track[/highlight] - connecting talent, teams, brands and investors [highlight]AT every level[/highlight] of the sport.",
    },
    imageField({
      name: "servicesBackgroundImage",
      label: "Services section — Image de fond (bloc 4)",
      required: true,
      defaultValue: "/assets/v2/home/about.webp",
      description:
        "Photo plein bloc derrière Sport management / Image & media / Commercial development. Valeur par défaut : /assets/v2/home/about.webp",
    }),
    {
      name: "serviceLabels",
      type: "array",
      required: true,
      admin: {
        description: "Les 3 libellés affichés dans la section Services de la home (Sport management, Image & media, Commercial development).",
      },
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
      label: "Drivers section — Image de fond",
      required: true,
      defaultValue: "/images/drivers.webp",
      description: "Image plein largeur derrière le CTA « For deserving drivers ». Valeur par défaut : /images/drivers.webp",
    }),
    {
      name: "driversHeading",
      type: "text",
      localized: true,
      defaultValue: "For deserving",
      admin: {
        description: "Première ligne du titre Drivers (en blanc). Défaut : \"For deserving\".",
      },
    },
    {
      name: "driversHeadingAccent",
      type: "text",
      localized: true,
      defaultValue: "drivers",
      admin: {
        description: "Deuxième ligne du titre Drivers (en rouge/accentuée). Défaut : \"drivers\".",
      },
    },
    {
      name: "homepageNewsItems",
      type: "array",
      label: "Featured News (carrousel home)",
      admin: {
        description: "Articles mis en avant dans le carrousel d'actualités de la home. Chaque entrée = une carte avec image, titre et extrait.",
      },
      fields: [
        {
          name: "newsSlug",
          type: "text",
          required: true,
          admin: {
            description: "Slug de l'article (ex : enzo-deligny-podium). Doit correspondre exactement au slug dans Actualités.",
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: "Titre affiché sur la carte du carrousel (peut différer du titre de l'article).",
          },
        },
        {
          name: "excerpt",
          type: "text",
          required: true,
          localized: true,
          admin: {
            description: "Texte court sous le titre (1 ligne). Visible sur la carte.",
          },
        },
        imageField({
          name: "image",
          label: "Image de la carte",
          required: true,
          description: "Vignette visible dans le carrousel d'actualités de la home.",
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [() => { revalidateHomepage(); }],
  },
};
