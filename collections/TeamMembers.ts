import type { CollectionConfig } from "payload";
import { imageField } from "@/fields/imageField";
import { revalidateAbout } from "@/lib/revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: {
    singular: "Membre de l'équipe",
    plural: "Équipe",
  },
  admin: {
    group: "📰 Contenu",
    useAsTitle: "name",
    description: "Membres de l'équipe The Grid affichés sur la page À propos. L'ordre d'affichage est contrôlé par le champ « Ordre ».",
    defaultColumns: ["name", "role", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      label: "Nom complet",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Prénom et nom du membre de l'équipe (ex : Guillaume Le Goff)." },
    },
    {
      name: "role",
      label: "Titre / Rôle",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Fonction affichée sous le nom sur la carte (ex : Founder, Driver Agent)." },
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
      label: "Ordre d'affichage",
      type: "number",
      required: true,
      admin: {
        position: "sidebar",
        description: "Ordre sur la page À propos (1 = premier). Guillaume Le Goff est toujours 1.",
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
