import type { GlobalConfig } from "payload";
import { revalidateAll } from "@/lib/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "⚙️ Réglages du site",
  admin: {
    group: "⚙️ Paramètres",
    description: "URLs des réseaux sociaux, email de contact, lien Privacy Policy et copyright du footer.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "footerCopyright",
      label: "Copyright (footer)",
      type: "text",
      localized: true,
      defaultValue: "(C) 2026 THE GRID AGENCY, ALL RIGHTS RESERVED",
      admin: {
        description: "Texte affiché en bas du footer. Modifiable par langue.",
      },
    },
    {
      name: "instagramUrl",
      label: "URL Instagram",
      type: "text",
      defaultValue: "https://www.instagram.com/thegrid.agency",
      admin: {
        description: "Lien vers le profil Instagram officiel. Affiché dans le footer.",
      },
    },
    {
      name: "linkedinUrl",
      label: "URL LinkedIn",
      type: "text",
      defaultValue: "https://www.linkedin.com/company/the-grid-agency/",
      admin: {
        description: "Lien vers la page LinkedIn de The Grid Agency. Affiché dans le footer.",
      },
    },
    {
      name: "email",
      label: "Email de contact",
      type: "text",
      defaultValue: "contact@thegrid.agency",
      admin: {
        description: "Adresse email utilisée pour les formulaires de contact.",
      },
    },
    {
      name: "privacyPolicyUrl",
      label: "URL Politique de confidentialité",
      type: "text",
      defaultValue: "/privacy-policy",
      admin: {
        description: "Chemin ou URL de la page Privacy Policy. Ex : /privacy-policy",
      },
    },
  ],
  hooks: {
    afterChange: [() => revalidateAll()],
  },
};
