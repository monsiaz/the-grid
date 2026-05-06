import type { CollectionConfig } from "payload";
import { after } from "next/server";
import { focalPointField } from "@/fields/focalPointField";
import { imageField } from "@/fields/imageField";
import { getSiteUrl } from "@/lib/siteUrl";
import { hasLocalizedTextChange } from "@/lib/localizedChange";
import { revalidateNewsDetail } from "@/lib/revalidate";
import { newsContentBlocks } from "@/blocks/newsBlocks";
import { authenticated, publicRead } from "@/lib/payloadAccess";

const NEWS_LOCALIZED_TEXT_PATHS = [
  "title",
  "date",
  "excerpt",
  "introParagraphs",
  "bodyParagraphs",
  "content.[].text",
  "content.[].caption",
  "content.[].heading",
  "content.[].images.[].alt",
  "content.[].items.[].label",
  "content.[].author",
  "content.[].role",
  "content.[].label",
];

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Article",
    plural: "Actualités",
  },
  admin: {
    group: "Contenu",
    useAsTitle: "title",
    description: "Gérez les articles publiés sur /news. Chaque article peut avoir des blocs de contenu riches (texte, images, stats, galeries).",
    defaultColumns: ["title", "tag", "date"],
    livePreview: {
      url: ({ data, locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        const slug = (data as { slug?: string } | undefined)?.slug || "";
        return slug ? `${base}${l}/news/${slug}` : `${base}${l}/news`;
      },
    },
    preview: (doc, options) => {
      const base = getSiteUrl();
      const raw = (options as { locale?: unknown } | undefined)?.locale;
      const code = typeof raw === "string" ? raw : "";
      const l = code && code !== "en" ? `/${code}` : "";
      const slug = (doc as { slug?: string } | undefined)?.slug || "";
      return slug ? `${base}${l}/news/${slug}` : `${base}${l}/news`;
    },
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
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "Identifiant stable (ne pas traduire). Utilisé comme pivot hreflang : la même news partage ce slug sur /news/..., /fr/news/..., /es/news/..., etc. Les hreflang et le sélecteur de langue s'appuient dessus pour relier les traductions.",
      },
    },
    imageField({
      name: "listImage",
      label: "List image",
      required: true,
      description: "Vignette affichée dans la grille /news/.",
    }),
    focalPointField({
      name: "listImageFocalPoint",
      label: "List image — cadrage",
    }),
    {
      name: "tag",
      type: "relationship",
      relationTo: "news-tags",
      hasMany: false,
      required: false,
      admin: {
        position: "sidebar",
        description:
          "Choose the tag/filter for this news article. It drives the /news filter bar (?filter=<tag-slug>) and the badge shown on each card. Create or rename tags in the News → News tags collection.",
      },
    },
    {
      name: "category",
      type: "select",
      required: false,
      options: [
        { label: "Sporting", value: "sporting" },
        { label: "Commercial", value: "commercial" },
      ],
      admin: {
        position: "sidebar",
        hidden: true,
        description:
          "Legacy filter kept only as a fallback for articles not yet migrated to the new Tags system. Leave empty — use the Tag field above instead.",
      },
    },
    {
      name: "date",
      type: "text",
      localized: true,
      admin: {
        description: "Display date (e.g. FEB 17, 2026)",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Short teaser (1–2 sentences, ~160 characters) shown under the title on the /news list cards. Leave empty to hide the teaser on that card.",
      },
    },
    imageField({
      name: "heroImage",
      label: "Hero image",
      description: "Visuel principal en haut de l'article.",
    }),
    focalPointField({
      name: "heroImageFocalPoint",
      label: "Hero image — cadrage",
    }),
    {
      name: "heroImageCredit",
      type: "text",
      localized: true,
      admin: {
        description: "Crédit photo de l'image hero (ex: ©Grégoire Truchet). Affiché discrètement sous l'image. Optionnel.",
      },
    },
    {
      name: "introParagraphs",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "Paragraphes d'accroche affichés à droite de l'image hero (un par ligne). Facultatifs — si vous remplissez directement 'Content blocks' ci-dessous, ce champ peut rester vide.",
      },
    },
    {
      name: "content",
      type: "blocks",
      label: "Content blocks",
      blocks: newsContentBlocks,
      admin: {
        description:
          "Contenu modulaire de l'article. Empilez librement des blocs (paragraphes, titres, images, citations, chiffres clés, galeries, CTA…) dans l'ordre que vous voulez — chaque bloc est déplaçable par glisser-déposer. Remplace les anciens champs 'Body paragraphs' et 'Gallery images' quand il contient au moins un bloc ; sinon l'article retombe automatiquement sur ces champs historiques.",
      },
    },
    {
      name: "bodyParagraphs",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "⚠️ Legacy — conservé comme filet de sécurité pour les anciens articles. Préférez 'Content blocks' ci-dessus. Utilisé uniquement si aucun bloc n'est défini. Un paragraphe par ligne.",
      },
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Gallery Images (legacy)",
      admin: {
        description:
          "⚠️ Legacy — préférez un bloc 'Galerie d'images' dans 'Content blocks'. Utilisé uniquement si 'Content blocks' est vide.",
      },
      fields: [
        imageField({
          name: "image",
          label: "Gallery image",
          required: true,
          description: "Photo affichée dans la galerie de l'article.",
        }),
        focalPointField(),
        {
          name: "credit",
          type: "text",
          localized: true,
          admin: {
            description: "Crédit photo affiché discrètement sous l'image (ex: ©Grégoire Truchet). Optionnel.",
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({
        doc,
        previousDoc,
        req,
      }: {
        doc: Record<string, unknown>;
        previousDoc?: Record<string, unknown>;
        req: { locale?: string | null };
      }) => {
        revalidateNewsDetail((doc as { slug?: string }).slug);
        const locale = req?.locale || "en";
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return;
        if (!hasLocalizedTextChange({ doc, previousDoc, paths: NEWS_LOCALIZED_TEXT_PATHS })) return;
        const secret = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET || "";
        const base = getSiteUrl();
        const url = `${base}/api/translate-payload?scope=collections&collection=news&id=${doc.id}&force=1&sourceLocale=${locale}&secret=${encodeURIComponent(secret)}`;
        after(() => fetch(url, { method: "POST" }).catch(() => {}));
      },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateNewsDetail((doc as { slug?: string }).slug); },
    ],
  },
};
