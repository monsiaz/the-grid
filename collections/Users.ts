import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Utilisateur",
    plural: "Utilisateurs",
  },
  admin: {
    group: "⚙️ Paramètres",
    useAsTitle: "email",
    description: "Comptes administrateurs du back-office. Chaque utilisateur peut se connecter avec son email et mot de passe.",
  },
  access: {
    read: () => true,
  },
  fields: [],
};
