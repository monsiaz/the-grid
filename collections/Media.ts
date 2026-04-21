import type { CollectionConfig } from "payload";

export const MEDIA_CATEGORIES = [
  { label: "Homepage", value: "homepage" },
  { label: "About", value: "about" },
  { label: "Services", value: "services" },
  { label: "Drivers (grid)", value: "drivers-grid" },
  { label: "Drivers (detail)", value: "drivers-detail" },
  { label: "Drivers (articles)", value: "drivers-articles" },
  { label: "News", value: "news" },
  { label: "Contact", value: "contact" },
  { label: "Team", value: "team" },
  { label: "Logos & brand", value: "brand" },
  { label: "Other", value: "other" },
] as const;

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "category", "driverSlug", "updatedAt"],
    group: "Library",
    description:
      "Bibliothèque média centralisée. Toutes les images sont automatiquement converties en webP puis servies via le CDN Vercel Blob.",
    listSearchableFields: ["alt", "category", "driverSlug", "tags.tag", "filename"],
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ["image/*"],
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: "webp",
      options: {
        quality: 82,
        effort: 4,
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 78 } },
      },
      {
        name: "card",
        width: 900,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "hero",
        width: 1920,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 82 } },
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Texte alternatif (accessibilité + SEO).",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "other",
      options: MEDIA_CATEGORIES as unknown as { label: string; value: string }[],
      admin: {
        description: "Regroupement utilisé dans la bibliothèque pour filtrer.",
      },
    },
    {
      name: "driverSlug",
      type: "text",
      admin: {
        description:
          "Slug du pilote associé (ex: pierre-gasly), utile pour filtrer les articles drivers.",
      },
    },
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description: "Mots-clés libres pour filtrer dans la bibliothèque.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      admin: {
        description: "Légende / crédit optionnel.",
      },
    },
    {
      name: "source",
      type: "text",
      admin: {
        description: "Chemin ou URL d'origine (pour traçabilité).",
      },
    },
  ],
};
