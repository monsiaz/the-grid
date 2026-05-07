import type { Block } from "payload";
import { focalPointField } from "@/fields/focalPointField";
import { imageField } from "@/fields/imageField";

/**
 * Modular content blocks for the News collection.
 *
 * Each block maps 1:1 to a component in `components/news/detail/NewsContentBlocks.tsx`.
 * All user-facing text fields are `localized: true` so translations stay in sync
 * with the existing `next-intl` locale system; image URLs stay shared (one asset
 * per block, any locale).
 *
 * Adding a new block:
 *   1. Add a `Block` export below with a unique `slug`.
 *   2. Add the slug to the `newsContentBlocks` array at the bottom.
 *   3. Add a matching case in `NewsContentBlocks.tsx`.
 *   4. Add locale tables to `scripts/ensure-schema.mjs` if the block has
 *      localized fields and Payload's auto-push proves flaky on deploy.
 */

export const LeadBlock: Block = {
  slug: "lead",
  labels: { singular: "Lead / Intro", plural: "Leads / Intros" },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description:
          "Paragraphe d'accroche mis en valeur (plus grand, légèrement plus clair). Une à deux phrases maximum. Idéal juste après l'image hero.",
      },
    },
  ],
};

export const ParagraphBlock: Block = {
  slug: "paragraph",
  labels: { singular: "Paragraphe", plural: "Paragraphes" },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description:
          "Un ou plusieurs paragraphes. Sautez une ligne vide dans la saisie pour créer un nouveau paragraphe.",
      },
    },
  ],
};

export const HeadingBlock: Block = {
  slug: "heading",
  labels: { singular: "Titre de section", plural: "Titres de section" },
  fields: [
    {
      name: "text",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "size",
      type: "select",
      required: true,
      defaultValue: "h2",
      options: [
        { label: "Grand (H2)", value: "h2" },
        { label: "Moyen (H3)", value: "h3" },
      ],
      admin: {
        position: "sidebar",
        description: "Taille du titre. H2 pour un grand titre de section, H3 pour un sous-titre.",
      },
    },
  ],
};

export const ImageBlock: Block = {
  slug: "image",
  labels: { singular: "Image pleine largeur", plural: "Images pleine largeur" },
  fields: [
    imageField({
      name: "image",
      label: "Image",
      required: true,
      description: "Visuel large au milieu de l'article.",
    }),
    focalPointField(),
    {
      name: "caption",
      type: "text",
      localized: true,
      admin: {
        description: "Légende optionnelle sous l'image (italique).",
      },
    },
    {
      name: "credit",
      type: "text",
      localized: true,
      admin: {
        description: "Crédit photo affiché discrètement sous l'image (ex: ©Grégoire Truchet). Optionnel.",
      },
    },
    {
      name: "ratio",
      type: "select",
      required: true,
      defaultValue: "16:9",
      options: [
        { label: "21:9 (cinéma / très large)", value: "21:9" },
        { label: "16:9 (paysage standard)", value: "16:9" },
        { label: "4:3 (classique)", value: "4:3" },
        { label: "3:2 (photo)", value: "3:2" },
        { label: "1:1 (carré)", value: "1:1" },
        { label: "4:5 (portrait)", value: "4:5" },
      ],
      admin: {
        position: "sidebar",
        description: "Rapport d'affichage. Le cadrage automatique garde le sujet centré.",
      },
    },
    {
      name: "rounded",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Coins arrondis (conseillé, raccord avec le reste du site).",
      },
    },
  ],
};

export const TwoColumnBlock: Block = {
  slug: "twoColumn",
  labels: { singular: "Texte + Image (2 colonnes)", plural: "Textes + Images (2 colonnes)" },
  fields: [
    {
      name: "layout",
      type: "select",
      required: true,
      defaultValue: "text-image",
      options: [
        { label: "Texte à gauche · Image à droite", value: "text-image" },
        { label: "Image à gauche · Texte à droite", value: "image-text" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    imageField({ name: "image", label: "Image", required: true }),
    focalPointField(),
    {
      name: "text",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description: "Texte de la colonne (sautez une ligne vide pour paragraphe).",
      },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      admin: {
        description: "Légende optionnelle sous l'image.",
      },
    },
    {
      name: "credit",
      type: "text",
      localized: true,
      admin: {
        description: "Crédit photo affiché discrètement sous l'image (ex: ©Grégoire Truchet). Optionnel.",
      },
    },
  ],
};

export const GalleryBlock: Block = {
  slug: "gallery",
  labels: { singular: "Galerie d'images", plural: "Galeries d'images" },
  fields: [
    {
      name: "columns",
      type: "select",
      required: true,
      defaultValue: "3",
      options: [
        { label: "2 colonnes", value: "2" },
        { label: "3 colonnes", value: "3" },
        { label: "4 colonnes", value: "4" },
        { label: "5 colonnes", value: "5" },
      ],
      admin: {
        position: "sidebar",
        description: "Nombre de colonnes sur desktop (mobile = 2 automatiquement).",
      },
    },
    {
      name: "images",
      type: "array",
      required: true,
      minRows: 2,
      fields: [
        imageField({ name: "image", label: "Image", required: true }),
        focalPointField(),
        {
          name: "alt",
          type: "text",
          localized: true,
          admin: { description: "Texte alternatif (accessibilité + SEO)." },
        },
        {
          name: "credit",
          type: "text",
          localized: true,
          admin: { description: "Crédit photo affiché discrètement sous l'image (ex: ©Grégoire Truchet). Optionnel." },
        },
      ],
    },
  ],
};

export const StatsBlock: Block = {
  slug: "stats",
  labels: { singular: "Chiffres clés", plural: "Blocs chiffres clés" },
  fields: [
    {
      name: "heading",
      type: "text",
      label: "Titre du bloc",
      localized: true,
      admin: {
        placeholder: "EN QUELQUES CHIFFRES",
        description: "Optionnel. Affiché au-dessus des cartes.",
      },
    },
    {
      name: "columns",
      type: "select",
      label: "Nombre de cartes par ligne",
      required: true,
      defaultValue: "3",
      options: [
        { label: "2 cartes", value: "2" },
        { label: "3 cartes", value: "3" },
        { label: "4 cartes", value: "4" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "items",
      type: "array",
      label: "Cartes",
      required: true,
      minRows: 2,
      maxRows: 4,
      labels: { singular: "Carte", plural: "Cartes" },
      defaultValue: [
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
      ],
      admin: {
        description:
          "Une carte = un chiffre clé (entre 2 et 4 au total). Le grand nombre est en rouge, le libellé en blanc en-dessous.",
      },
      fields: [
        {
          name: "value",
          type: "text",
          label: "Chiffre",
          required: true,
          admin: {
            placeholder: "03",
            description: "Le grand nombre affiché. Format libre (ex: 03, 51, 1er, 2026).",
          },
        },
        {
          name: "label",
          type: "text",
          label: "Libellé",
          required: true,
          localized: true,
          admin: {
            placeholder: "Career points",
            description: "Texte court affiché sous le chiffre.",
          },
        },
      ],
    },
  ],
};

export const QuoteBlock: Block = {
  slug: "quote",
  labels: { singular: "Citation", plural: "Citations" },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description: "Le texte de la citation (sans guillemets — ajoutés automatiquement).",
      },
    },
    {
      name: "author",
      type: "text",
      localized: true,
    },
    {
      name: "role",
      type: "text",
      localized: true,
      admin: {
        description: "Rôle ou entité de l'auteur (ex. 'BWT Alpine F1 Team Driver').",
      },
    },
  ],
};

export const VideoBlock: Block = {
  slug: "video",
  labels: { singular: "Vidéo", plural: "Vidéos" },
  fields: [
    {
      name: "url",
      type: "text",
      required: true,
      admin: {
        description:
          "URL YouTube, Vimeo, ou fichier .mp4 hébergé. Ex. https://www.youtube.com/watch?v=XXXX ou https://…/video.mp4",
      },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      admin: {
        description: "Légende optionnelle sous la vidéo.",
      },
    },
  ],
};

export const DividerBlock: Block = {
  slug: "divider",
  labels: { singular: "Séparateur", plural: "Séparateurs" },
  fields: [
    {
      name: "style",
      type: "select",
      required: true,
      defaultValue: "line",
      options: [
        { label: "Ligne fine", value: "line" },
        { label: "Espace seul", value: "space" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};

export const CtaBlock: Block = {
  slug: "cta",
  labels: { singular: "Bouton / Call-to-action", plural: "Boutons / Call-to-actions" },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "href",
      type: "text",
      required: true,
      admin: {
        description:
          "URL complète (https://…) ou chemin interne du site (/drivers, /services/…).",
      },
    },
    {
      name: "style",
      type: "select",
      defaultValue: "primary",
      options: [
        { label: "Rouge plein", value: "primary" },
        { label: "Contour rouge", value: "outline" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};

export const newsContentBlocks: Block[] = [
  LeadBlock,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  TwoColumnBlock,
  GalleryBlock,
  StatsBlock,
  QuoteBlock,
  VideoBlock,
  DividerBlock,
  CtaBlock,
];
