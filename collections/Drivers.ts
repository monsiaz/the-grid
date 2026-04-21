import type { CollectionConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateDriverDetail } from "@/lib/revalidate";

export const Drivers: CollectionConfig = {
  slug: "drivers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    livePreview: {
      url: ({ data, locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        const slug = (data as { slug?: string } | undefined)?.slug || "";
        return slug ? `${base}${l}/drivers/${slug}/` : `${base}${l}/drivers/`;
      },
    },
    preview: (doc, options) => {
      const base = getSiteUrl();
      const raw = (options as { locale?: unknown } | undefined)?.locale;
      const code = typeof raw === "string" ? raw : "";
      const l = code && code !== "en" ? `/${code}` : "";
      const slug = (doc as { slug?: string } | undefined)?.slug || "";
      return slug ? `${base}${l}/drivers/${slug}/` : `${base}${l}/drivers/`;
    },
    components: {
      edit: {
        beforeDocumentControls: ["@/components/admin/TranslationStatus"],
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "Identifiant stable (ne pas traduire). Utilisé comme pivot hreflang : le même pilote partage ce slug sur /drivers/..., /fr/drivers/..., /es/drivers/..., etc.",
      },
    },
    {
      name: "role",
      type: "text",
      required: true,
      localized: true,
    },
    imageField({
      name: "image",
      label: "Grid card image",
      required: true,
      description: "Vignette pilote (grille /drivers/ et teaser homepage).",
    }),
    {
      name: "flags",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "France", value: "FR" },
        { label: "India", value: "IN" },
        { label: "Great Britain", value: "GB" },
        { label: "United States", value: "US" },
        { label: "Poland", value: "PL" },
      ],
    },
    {
      name: "instagramUrl",
      type: "text",
      required: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "gridRow",
      type: "number",
      required: true,
      admin: {
        position: "sidebar",
        description: "Which row the driver appears in on the grid (1-based)",
      },
    },
    {
      name: "detail",
      type: "group",
      label: "Detail Page",
      fields: [
        {
          name: "profileTitle",
          type: "text",
          localized: true,
        },
        {
          name: "profileParagraphs",
          type: "textarea",
          localized: true,
          admin: {
            description: "One paragraph per line (separated by newlines)",
          },
        },
        {
          name: "careerTitle",
          type: "text",
          localized: true,
        },
        {
          name: "careerParagraphs",
          type: "textarea",
          localized: true,
          admin: {
            description: "One paragraph per line (separated by newlines)",
          },
        },
        {
          name: "transitionTitle",
          type: "text",
          localized: true,
        },
        {
          name: "transitionParagraph",
          type: "textarea",
          localized: true,
        },
        {
          name: "agencyTitle",
          type: "text",
          localized: true,
        },
        {
          name: "agencyParagraphs",
          type: "textarea",
          localized: true,
          admin: {
            description: "One paragraph per line (separated by newlines)",
          },
        },
        {
          name: "highestFinish",
          type: "text",
        },
        {
          name: "careerPoints",
          type: "text",
        },
        {
          name: "grandPrixEntered",
          type: "text",
        },
        {
          name: "careerPodiums",
          type: "text",
        },
        imageField({
          name: "profileImage",
          label: "Profile image",
          description: "Photo du bloc profil (page détail pilote).",
        }),
        imageField({
          name: "careerImage",
          label: "Career image",
          description: "Photo du bloc carrière (page détail pilote).",
        }),
        imageField({
          name: "agencyImage",
          label: "Agency image",
          description: "Photo du bloc agence (page détail pilote).",
        }),
        imageField({
          name: "galleryLeft",
          label: "Gallery — left",
          description: "Mini galerie d'en-tête, visuel gauche.",
        }),
        imageField({
          name: "galleryCenter",
          label: "Gallery — center",
          description: "Mini galerie d'en-tête, visuel central.",
        }),
        imageField({
          name: "galleryRight",
          label: "Gallery — right",
          description: "Mini galerie d'en-tête, visuel droit.",
        }),
      ],
    },
    {
      name: "detailNews",
      type: "array",
      label: "Related News",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
        },
        imageField({
          name: "image",
          label: "Related news image",
          required: true,
          description: "Vignette carrée de l'article lié.",
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }: { doc: unknown }) => { revalidateDriverDetail((doc as { slug?: string }).slug); },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateDriverDetail((doc as { slug?: string }).slug); },
    ],
  },
};
