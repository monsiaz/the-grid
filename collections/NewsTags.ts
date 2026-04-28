import type { CollectionConfig } from "payload";
import { revalidateNewsIndex } from "@/lib/revalidate";
import { authenticated, publicRead } from "@/lib/payloadAccess";

/**
 * News filters displayed on /news (and per-article badge).
 *
 * Editors can create/rename/delete tags from the admin at
 *   /admin/collections/news-tags
 * The "slug" is the stable filter pivot and also the URL parameter
 * (?filter=<slug>). Changing the slug breaks saved URLs — avoid it unless
 * you're renaming a tag before it has been indexed or shared.
 */
export const NewsTags: CollectionConfig = {
  slug: "news-tags",
  labels: {
    singular: "News tag",
    plural: "News tags",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "order"],
    description:
      "Tags used to filter the /news page. Each news article picks one tag in its sidebar. Add or rename tags here; the filter bar on /news updates automatically.",
    group: "Contenu",
    components: {
      edit: {
        beforeDocumentControls: ["@/components/admin/TranslationStatus"],
      },
    },
  },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description:
          "Display name of the tag (shown on the /news filter bar and on each article card). Localisable — translate in each locale.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "Stable identifier (lowercase, no accents, dashes only). Used in the URL: /news?filter=<slug>. Do not change once published.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 10,
      admin: {
        position: "sidebar",
        description:
          "Sort order in the /news filter bar (lower = shown first).",
      },
    },
    {
      name: "accent",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Highlight this tag with the brand red accent on article cards (otherwise monochrome). Use sparingly — reserved for a single \"primary\" tag, typically Commercial.",
      },
    },
  ],
  hooks: {
    afterChange: [() => revalidateNewsIndex()],
    afterDelete: [() => revalidateNewsIndex()],
  },
};
