import type { GlobalConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateServices } from "@/lib/revalidate";

/**
 * Field order matches the rendered page order on /services/ for easier editing:
 *   1. Hero
 *   2. Commercial (Value) + Case Studies
 *   3. Hintsa Partnership (between commercial and talent)
 *   4. Talent
 */
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
    // ─── 1. HERO ────────────────────────────────────────────────
    {
      name: "heroTitle",
      type: "text",
      required: true,
      localized: true,
      label: "1. Hero — Title",
      defaultValue: "One-stop shop",
    },
    {
      name: "heroDescription",
      type: "text",
      localized: true,
      label: "1. Hero — Description",
      defaultValue:
        "On and beyond the track, we operate across the motorsport ecosystem — from elite talent management to high-impact brand strategy and commercial partnerships.",
    },
    imageField({
      name: "heroBackgroundImage",
      label: "1. Hero — Background image",
      defaultValue: "/assets/v2/services/hero.webp",
      description: "Image plein écran en haut de /services/.",
    }),

    // ─── 2. COMMERCIAL (Value) ──────────────────────────────────
    {
      name: "valueHeading",
      type: "text",
      localized: true,
      label: "2. Commercial — Heading (line 1)",
      defaultValue: "WHERE PERFORMANCE",
    },
    {
      name: "valueHeadingAccent",
      type: "text",
      localized: true,
      label: "2. Commercial — Heading accent (line 2, muted)",
      defaultValue: "CREATES VALUE",
    },
    {
      name: "valueDescription",
      type: "textarea",
      localized: true,
      label: "2. Commercial — Description",
    },
    {
      name: "valueIntroText",
      type: "textarea",
      localized: true,
      label: "2. Commercial — Intro card text (Strategy & Positioning)",
    },
    {
      name: "valueCards",
      type: "array",
      label: "2. Commercial — Cards (4 image cards, flip to reveal bio)",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        imageField({
          name: "image",
          label: "Card image",
          required: true,
          description: "Illustration de la card Commercial (flip card).",
        }),
        { name: "description", type: "textarea", localized: true },
      ],
    },
    {
      name: "caseStudies",
      type: "array",
      label: "2. Commercial — Case studies carousel",
      fields: [
        { name: "title", type: "text", localized: true },
        imageField({
          name: "image",
          label: "Case study image",
          required: true,
          description: "Photo principale du case study.",
        }),
        { name: "description", type: "textarea", localized: true },
        { name: "dimmed", type: "checkbox", defaultValue: false },
      ],
    },

    // ─── 3. HINTSA PARTNERSHIP ──────────────────────────────────
    imageField({
      name: "partnerBackgroundImage",
      label: "3. Hintsa — Background image",
      required: true,
      defaultValue: "/assets/v2/services/hintsa-partner-bg.webp",
      description: "Image plein largeur derrière la section Hintsa × The Grid.",
    }),
    {
      name: "partnerHeading",
      type: "text",
      localized: true,
      label: "3. Hintsa — Heading",
    },
    {
      name: "partnerDescription",
      type: "textarea",
      localized: true,
      label: "3. Hintsa — Description",
    },

    // ─── 4. TALENT (Sport) ──────────────────────────────────────
    {
      name: "talentHeading",
      type: "text",
      localized: true,
      label: "4. Talent — Heading (line 1)",
      defaultValue: "TALENT TAKES THE WHEEL",
    },
    {
      name: "talentHeadingAccent",
      type: "text",
      localized: true,
      label: "4. Talent — Heading accent (line 2, muted)",
      defaultValue: "WE PAVE THE WAY",
    },
    {
      name: "talentDescription",
      type: "textarea",
      localized: true,
      label: "4. Talent — Description",
      defaultValue:
        "From karting to the pinnacle of motorsport, the path is filled with challenges. It demands resilience, teamwork and trust. We stand with deserving drivers every step of the way.",
    },
    {
      name: "talentIntroTitle",
      type: "text",
      localized: true,
      label: "4. Talent — Intro card title (Performance)",
      defaultValue: "PERFORMANCE",
    },
    {
      name: "talentIntroText",
      type: "textarea",
      localized: true,
      label: "4. Talent — Intro card text (back of Performance flip card)",
      defaultValue:
        "We create the optimal environment for drivers to excel. By aligning their goals with team objectives and fostering collaboration, we empower them to perform at their peak level.",
    },
    imageField({
      name: "talentIntroImage",
      label: "4. Talent — Intro card image (Performance — front of flip card)",
      defaultValue: "/assets/v2/services/talent-performance.webp",
      description:
        "Photo used on the first card of the Talent grid. Leave empty to display the intro as a plain text card.",
    }),
    {
      name: "talentCards",
      type: "array",
      label: "4. Talent — Cards (5 image cards, flip to reveal bio)",
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        imageField({
          name: "image",
          label: "Card image",
          required: true,
          description: "Illustration de la card Talent (flip card).",
        }),
        { name: "description", type: "textarea", localized: true },
      ],
    },
  ],
  hooks: {
    afterChange: [() => { revalidateServices(); }],
  },
};
