import type { CollectionConfig } from "payload";

export const Drivers: CollectionConfig = {
  slug: "drivers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
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
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "image",
      type: "text",
      required: true,
      admin: {
        description: "Path to the driver image (e.g. /images/drivers/driver-01-gasly.webp)",
      },
    },
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
        },
        {
          name: "profileParagraphs",
          type: "textarea",
          admin: {
            description: "One paragraph per line (separated by newlines)",
          },
        },
        {
          name: "careerTitle",
          type: "text",
        },
        {
          name: "careerParagraphs",
          type: "textarea",
          admin: {
            description: "One paragraph per line (separated by newlines)",
          },
        },
        {
          name: "transitionTitle",
          type: "text",
        },
        {
          name: "transitionParagraph",
          type: "textarea",
        },
        {
          name: "agencyTitle",
          type: "text",
        },
        {
          name: "agencyParagraphs",
          type: "textarea",
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
        {
          name: "profileImage",
          type: "text",
          admin: {
            description: "Path to profile image",
          },
        },
        {
          name: "careerImage",
          type: "text",
          admin: {
            description: "Path to career image",
          },
        },
        {
          name: "agencyImage",
          type: "text",
          admin: {
            description: "Path to agency image",
          },
        },
        {
          name: "galleryLeft",
          type: "text",
        },
        {
          name: "galleryCenter",
          type: "text",
        },
        {
          name: "galleryRight",
          type: "text",
        },
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
