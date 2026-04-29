import type { CollectionConfig } from "payload";
import { authenticated } from "@/lib/payloadAccess";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  labels: {
    singular: "Utilisateur",
    plural: "Utilisateurs",
  },
  admin: {
    group: "Paramètres",
    useAsTitle: "email",
    description: "Comptes administrateurs du back-office. Chaque utilisateur peut se connecter avec son email et mot de passe.",
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [],
};
