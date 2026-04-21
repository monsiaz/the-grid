import type { CollectionConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateNewsDetail } from "@/lib/revalidate";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date"],
    livePreview: {
      url: ({ data, locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        const slug = (data as { slug?: string } | undefined)?.slug || "";
        return slug ? `${base}${l}/news/${slug}/` : `${base}${l}/news/`;
      },
    },
    preview: (doc, options) => {
      const base = getSiteUrl();
      const raw = (options as { locale?: unknown } | undefined)?.locale;
      const code = typeof raw === "string" ? raw : "";
      const l = code && code !== "en" ? `/${code}` : "";
      const slug = (doc as { slug?: string } | undefined)?.slug || "";
      return slug ? `${base}${l}/news/${slug}/` : `${base}${l}/news/`;
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
      name: "title",
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
          "Identifiant stable (ne pas traduire). Utilisé comme pivot hreflang : la même news partage ce slug sur /news/..., /fr/news/..., /es/news/..., etc. Les hreflang et le sélecteur de langue s'appuient dessus pour relier les traductions.",
      },
    },
    imageField({
      name: "listImage",
      label: "List image",
      required: true,
      description: "Vignette affichée dans la grille /news/.",
    }),
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Sporting", value: "sporting" },
        { label: "Commercial", value: "commercial" },
      ],
      admin: {
        description:
          "Choose the filter that will highlight this news item on the /news page. 'Sporting' appears when visitors click the SPORTING NEWS filter; 'Commercial' when they click COMMERCIAL NEWS. You can change the filter at any time and republish.",
      },
    },
    {
      name: "date",
      type: "text",
      localized: true,
      admin: {
        description: "Display date (e.g. FEB 17, 2026)",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Short teaser (1–2 sentences, ~160 characters) shown under the title on the /news list cards. Leave empty to hide the teaser on that card.",
      },
    },
    imageField({
      name: "heroImage",
      label: "Hero image",
      description: "Visuel principal en haut de l'article.",
    }),
    {
      name: "introParagraphs",
      type: "textarea",
      localized: true,
      admin: {
        description: "Intro paragraphs (one per line)",
      },
    },
    {
      name: "bodyParagraphs",
      type: "textarea",
      localized: true,
      admin: {
        description: "Body paragraphs (one per line)",
      },
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Gallery Images",
      fields: [
        imageField({
          name: "image",
          label: "Gallery image",
          required: true,
          description: "Photo affichée dans la galerie de l'article.",
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }: { doc: unknown }) => { revalidateNewsDetail((doc as { slug?: string }).slug); },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateNewsDetail((doc as { slug?: string }).slug); },
    ],
  },
};
