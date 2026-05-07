import type { CollectionConfig } from "payload";
import { after } from "next/server";
import { focalPointField } from "@/fields/focalPointField";
import { imageField } from "@/fields/imageField";
import { seoField } from "@/fields/seoField";
import { getSiteUrl } from "@/lib/siteUrl";
import { hasLocalizedTextChange } from "@/lib/localizedChange";
import { revalidateNewsDetail } from "@/lib/revalidate";
import { newsContentBlocks } from "@/blocks/newsBlocks";
import { authenticated, publicRead } from "@/lib/payloadAccess";
import { locales as ALL_LOCALES, defaultLocale } from "@/i18n/config";

const NEWS_LOCALIZED_TEXT_PATHS = [
  "title",
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
    defaultColumns: ["title", "tag", "publishedAt", "displayDate"],
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
        beforeDocumentControls: [
          "@/components/admin/NewsLocaleWarning",
          "@/components/admin/TranslationStatus",
        ],
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
    seoField(),
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
          "Ancien filtre, conservé uniquement comme filet de sécurité pour les articles pas encore migrés. Laisser vide — utiliser le champ Tag ci-dessus.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd MMM yyyy HH:mm",
        },
        description:
          "Date et heure de publication. Utilisée pour le tri (plus récent en premier) et l'affichage par défaut sur le site. Pré-remplie à 'maintenant'.",
      },
    },
    {
      name: "displayDate",
      type: "date",
      label: "Date d'affichage personnalisée",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd MMM yyyy",
        },
        description:
          "Optionnel — pour antédater un article ou utiliser une date différente de la date de publication. Si vide, on affiche 'Date de publication' formatée dans la langue active.",
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
      label: "Crédit photo (image hero)",
      localized: true,
      admin: {
        description:
          "Crédit photo affiché sous l'image hero (ex: ©Grégoire Truchet). Visible publiquement. Laissez vide si l'image n'a pas de crédit.",
        placeholder: "©Nom du photographe",
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
      label: "Contenu de l'article",
      blocks: newsContentBlocks,
      admin: {
        description:
          "Empilez les blocs dans l'ordre que vous voulez (paragraphes, titres, images, citations, chiffres clés, galeries, CTA). Glisser-déposer pour réordonner. C'est ici que vous écrivez le corps de l'article.",
      },
    },
    {
      name: "bodyParagraphs",
      type: "textarea",
      label: "Paragraphes (ancien format)",
      localized: true,
      admin: {
        condition: (data, siblingData) => {
          const v = (siblingData as { bodyParagraphs?: string } | undefined)?.bodyParagraphs;
          return typeof v === "string" && v.trim().length > 0;
        },
        description:
          "Champ conservé pour les anciens articles. Pour un nouvel article, utilisez 'Contenu de l'article' ci-dessus à la place.",
      },
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Galerie (ancien format)",
      admin: {
        condition: (data, siblingData) => {
          const v = (siblingData as { galleryImages?: unknown[] } | undefined)?.galleryImages;
          return Array.isArray(v) && v.length > 0;
        },
        description:
          "Champ conservé pour les anciens articles. Pour un nouvel article, utilisez le bloc 'Galerie d'images' dans 'Contenu de l'article' ci-dessus.",
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
          label: "Crédit photo",
          localized: true,
          admin: {
            description: "Crédit affiché sous l'image (ex: ©Grégoire Truchet). Optionnel.",
            placeholder: "©Nom du photographe",
          },
        },
      ],
    },
    {
      name: "lockedLocales",
      type: "select",
      hasMany: true,
      options: ALL_LOCALES.filter((l) => l !== defaultLocale).map((l) => ({ label: l.toUpperCase(), value: l })),
      admin: {
        position: "sidebar",
        description:
          "Langues verrouillées : la regénération automatique des traductions IA NE TOUCHERA PAS ces langues. Une langue est ajoutée automatiquement dès que vous éditez manuellement l'article dans cette langue. Décochez pour autoriser à nouveau l'écrasement par traduction IA.",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({
        data,
        originalDoc,
        req,
        operation,
      }: {
        data: Record<string, unknown>;
        originalDoc?: Record<string, unknown>;
        req: { locale?: string | null; payloadAPI?: string; context?: { fromAutoTranslate?: boolean } };
        operation: "create" | "update";
      }) => {
        if (operation !== "update") return data;
        if (req?.context?.fromAutoTranslate) return data;
        const locale = req?.locale;
        if (!locale || locale === defaultLocale) return data;
        if (!hasLocalizedTextChange({ doc: data, previousDoc: originalDoc, paths: NEWS_LOCALIZED_TEXT_PATHS })) {
          return data;
        }
        const current = Array.isArray((data as { lockedLocales?: unknown[] }).lockedLocales)
          ? ((data as { lockedLocales?: unknown[] }).lockedLocales as string[])
          : Array.isArray((originalDoc as { lockedLocales?: unknown[] } | undefined)?.lockedLocales)
            ? ((originalDoc as { lockedLocales?: unknown[] }).lockedLocales as string[])
            : [];
        if (!current.includes(locale)) {
          (data as Record<string, unknown>).lockedLocales = [...current, locale];
        }
        return data;
      },
    ],
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
        const editLocale = req?.locale || defaultLocale;
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return;
        // Skip auto-translate when the edit is happening in a non-EN locale —
        // EN is canonical, manual edits in FR/ES/etc. must NOT propagate back
        // to other locales (would overwrite or corrupt EN with re-translated content).
        if (editLocale !== defaultLocale) return;
        if (!hasLocalizedTextChange({ doc, previousDoc, paths: NEWS_LOCALIZED_TEXT_PATHS })) return;
        const secret = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET || "";
        const base = getSiteUrl();
        const url = `${base}/api/translate-payload?scope=collections&collection=news&id=${doc.id}&force=1&sourceLocale=${defaultLocale}&secret=${encodeURIComponent(secret)}`;
        after(() => fetch(url, { method: "POST" }).catch(() => {}));
      },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateNewsDetail((doc as { slug?: string }).slug); },
    ],
  },
};
