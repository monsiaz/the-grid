import type { Field } from "payload";
import { imageField } from "@/fields/imageField";

type Options = {
  /** Override the group name. Default: "seo". */
  name?: string;
  /** Override the admin label. Default: "SEO (titre + meta)". */
  label?: string;
  /** Hint text shown above the group in the admin. */
  description?: string;
};

/**
 * Localized SEO group: metaTitle / metaDescription / keywords / ogImage.
 * Drop into any global or collection to expose editable <title> + meta tags
 * to admins. Pages read these via `generateMetadata` and fall back to i18n
 * defaults when empty.
 *
 * Persistence (Postgres): localized text fields land in `<table>_locales` as
 * snake_cased columns prefixed with the group name (`seo_meta_title`,
 * `seo_meta_description`, `seo_keywords`). The non-localized ogImage lives
 * directly on `<table>` as `seo_og_image`.
 */
export function seoField({
  name = "seo",
  label = "SEO (titre + meta)",
  description = "Titre <title> et meta description affichés dans Google et sur les partages sociaux. Laisser vide pour utiliser les valeurs par défaut traduites.",
}: Options = {}): Field {
  return {
    name,
    type: "group",
    label,
    admin: { description },
    fields: [
      {
        name: "metaTitle",
        type: "text",
        localized: true,
        admin: {
          description:
            "<title> de la page (50–60 caractères recommandés). Si vide, le titre par défaut s'applique.",
        },
      },
      {
        name: "metaDescription",
        type: "textarea",
        localized: true,
        admin: {
          description:
            "Meta description (140–160 caractères recommandés). Affichée dans les résultats Google.",
        },
      },
      {
        name: "keywords",
        type: "text",
        localized: true,
        admin: {
          description:
            "Mots-clés additionnels, séparés par des virgules. Optionnel.",
        },
      },
      imageField({
        name: "ogImage",
        label: "Image Open Graph (partage social)",
        description:
          "Image affichée lors d'un partage Facebook / LinkedIn / Twitter. 1200×630 recommandé. Si vide, l'image par défaut du site est utilisée.",
      }),
    ],
  };
}
