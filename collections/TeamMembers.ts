import type { CollectionConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { revalidateAbout } from "@/lib/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
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
      localized: true,
    },
    {
      name: "role",
      type: "text",
      required: true,
      localized: true,
    },
    imageField({
      name: "image",
      label: "Portrait",
      required: true,
      description: "Photo de profil affichée sur la page À propos.",
    }),
    {
      name: "linkedinUrl",
      type: "text",
      admin: {
        description: "Full LinkedIn profile URL (rendered as the LinkedIn icon on the card).",
      },
    },
    {
      name: "bio",
      type: "textarea",
      localized: true,
      admin: {
        description: "Internal bio (not displayed on the public About page for now).",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }: { doc: unknown }) => { revalidateAbout(); },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateAbout(); },
    ],
  },
};
