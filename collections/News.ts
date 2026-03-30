import type { CollectionConfig } from "payload";

export const News: CollectionConfig = {
  slug: "news",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "date"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "listImage",
      type: "text",
      required: true,
      admin: {
        description: "Image shown in the news list grid",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Sporting", value: "sporting" },
        { label: "Commercial", value: "commercial" },
      ],
    },
    {
      name: "date",
      type: "text",
      admin: {
        description: "Display date (e.g. FEB 17, 2026)",
      },
    },
    {
      name: "heroImage",
      type: "text",
      admin: {
        description: "Hero image for the detail page",
      },
    },
    {
      name: "introParagraphs",
      type: "textarea",
      admin: {
        description: "Intro paragraphs (one per line)",
      },
    },
    {
      name: "bodyParagraphs",
      type: "textarea",
      admin: {
        description: "Body paragraphs (one per line)",
      },
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Gallery Images",
      fields: [
        {
          name: "image",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
