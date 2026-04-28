import type { CollectionConfig } from "payload";
import { after } from "next/server";
import { imageField } from "@/fields/imageField";
import { logoField } from "@/fields/logoField";
import { getSiteUrl } from "@/lib/siteUrl";
import { revalidateDriverDetail } from "@/lib/revalidate";

export const Drivers: CollectionConfig = {
  slug: "drivers",
  labels: {
    singular: "Pilote",
    plural: "Pilotes",
  },
  admin: {
    group: "Contenu",
    useAsTitle: "name",
    description: "Profils des pilotes affichés sur /drivers. Chaque profil inclut stats, galerie, biographie et actualités liées.",
    defaultColumns: ["name", "role", "order"],
    livePreview: {
      url: ({ data, locale }) => {
        const base = getSiteUrl();
        const l = locale?.code && locale.code !== "en" ? `/${locale.code}` : "";
        const slug = (data as { slug?: string } | undefined)?.slug || "";
        return slug ? `${base}${l}/drivers/${slug}` : `${base}${l}/drivers`;
      },
    },
    preview: (doc, options) => {
      const base = getSiteUrl();
      const raw = (options as { locale?: unknown } | undefined)?.locale;
      const code = typeof raw === "string" ? raw : "";
      const l = code && code !== "en" ? `/${code}` : "";
      const slug = (doc as { slug?: string } | undefined)?.slug || "";
      return slug ? `${base}${l}/drivers/${slug}` : `${base}${l}/drivers`;
    },
    components: {
      edit: {
        beforeDocumentControls: ["@/components/admin/TranslationStatus"],
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Informations Générales",
          fields: [
            {
              name: "name",
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
                  "Identifiant stable (ne pas traduire). Utilisé comme pivot hreflang : le même pilote partage ce slug sur /drivers/..., /fr/drivers/..., /es/drivers/..., etc.",
              },
            },
            {
              name: "role",
              type: "text",
              required: true,
              localized: true,
            },
            imageField({
              name: "image",
              label: "Grid card image",
              required: true,
              description: "Vignette pilote (grille /drivers/ et teaser homepage).",
            }),
            logoField({
              name: "teamLogo",
              label: "Logo écurie",
              description:
                "Logo de l'écurie affiché sous le nom du pilote. 💡 ASTUCE FORMAT : Utilisez des fichiers PNG ou SVG avec fond transparent. Pour équilibrer visuellement des logos de proportions différentes (ex: un logo Red Bull 'carré' paraîtra plus gros qu'un logo Alpine 'allongé'), n'hésitez pas à ajouter de la marge transparente autour des logos les plus massifs avant upload. Les couleurs d'origine sont conservées.",
            }),
            {
              name: "flags",
              type: "select",
              hasMany: true,
              required: true,
              options: [
                { label: "France", value: "FR" },
                { label: "India", value: "IN" },
                { label: "Great Britain", value: "GB" },
                { label: "United States", value: "US" },
                { label: "Poland", value: "PL" },
              ],
            },
            {
              name: "instagramUrl",
              type: "text",
              required: true,
              admin: {
                description:
                  "URL Instagram du pilote (ex. https://www.instagram.com/pierregasly/). Affichée sur la fiche pilote (page détail) sous forme de pastille.",
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
            {
              name: "gridRow",
              type: "number",
              required: true,
              admin: {
                position: "sidebar",
                description: "Which row the driver appears in on the grid (1-based)",
              },
            },
          ]
        },
        {
          label: "Contenu (Legacy)",
          fields: [
            {
              name: "detail",
              type: "group",
              label: "Detail Page",
              admin: {
                description: "Anciens champs fixes. Utilisés uniquement si le 'Page Layout' est vide.",
              },
              fields: [
                {
                  name: "profileTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "profileParagraphs",
                  type: "textarea",
                  localized: true,
                  admin: {
                    description: "One paragraph per line (separated by newlines)",
                  },
                },
                {
                  name: "careerTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "careerParagraphs",
                  type: "textarea",
                  localized: true,
                  admin: {
                    description: "One paragraph per line (separated by newlines)",
                  },
                },
                {
                  name: "transitionTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "transitionParagraph",
                  type: "textarea",
                  localized: true,
                },
                {
                  name: "agencyTitle",
                  type: "text",
                  localized: true,
                },
                {
                  name: "agencyParagraphs",
                  type: "textarea",
                  localized: true,
                  admin: {
                    description: "One paragraph per line (separated by newlines)",
                  },
                },
                {
                  name: "highestFinish",
                  type: "text",
                  admin: {
                    description:
                      "Compteur ‘Highest race finish’ (réservé Pierre Gasly & Isack Hadjar). Mise à jour manuelle — à rafraîchir après chaque week-end de course si besoin. Laissez vide pour masquer le bloc de stats.",
                  },
                },
                {
                  name: "careerPoints",
                  type: "text",
                  admin: {
                    description:
                      "Compteur ‘Career points’ (réservé Pierre Gasly & Isack Hadjar). Mise à jour manuelle.",
                  },
                },
                {
                  name: "grandPrixEntered",
                  type: "text",
                  admin: {
                    description:
                      "Compteur ‘Grand Prix entered’ (réservé Pierre Gasly & Isack Hadjar). Mise à jour manuelle.",
                  },
                },
                {
                  name: "careerPodiums",
                  type: "text",
                  admin: {
                    description:
                      "Compteur ‘Career podiums’ (réservé Pierre Gasly & Isack Hadjar). Mise à jour manuelle. Les 4 compteurs doivent être remplis pour que le bloc s'affiche.",
                  },
                },
                {
                  name: "statsCards",
                  type: "array",
                  label: "Career highlight cards",
                  maxRows: 4,
                  admin: {
                    description:
                      "Cartes stats / highlights affichées dans le bloc carrière sous forme de grille 2×2. Recommandé pour tous les pilotes hors Pierre Gasly / Isack Hadjar. Si rempli, ce bloc s'affiche automatiquement sur la page détail.",
                  },
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      required: true,
                      admin: {
                        description:
                          "Valeur courte et impactante (ex. 07, P03, F2, 2026). Idéalement 2 à 5 caractères pour garder un rendu premium.",
                      },
                    },
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      localized: true,
                      admin: {
                        description:
                          "Libellé affiché sous la valeur. Préférer 1 à 3 lignes max.",
                      },
                    },
                  ],
                },
                imageField({
                  name: "profileImage",
                  label: "Profile image",
                  description:
                    "Photo principale du bloc profil (page détail pilote). Si vide, la photo ‘Grid card image’ est utilisée — privilégiez un portrait haute résolution (≥ 1200 px de large) pour éviter l'effet flou.",
                }),
                imageField({
                  name: "careerImage",
                  label: "Career image",
                  description: "Photo verticale au centre du bloc carrière. Si vide, le bloc image est masqué.",
                }),
                imageField({
                  name: "agencyImage",
                  label: "Agency image",
                  description: "Photo large du bloc agence. Si vide, le bloc image est masqué.",
                }),
                imageField({
                  name: "galleryLeft",
                  label: "Gallery — left",
                  description:
                    "Mini galerie d'en-tête, visuel gauche. Réservé Pierre Gasly & Isack Hadjar — la mini-galerie ne s'affiche que si au moins une des 3 images de galerie est renseignée.",
                }),
                imageField({
                  name: "galleryCenter",
                  label: "Gallery — center",
                  description:
                    "Mini galerie d'en-tête, visuel central (le plus visible). Réservé Pierre Gasly & Isack Hadjar.",
                }),
                imageField({
                  name: "galleryRight",
                  label: "Gallery — right",
                  description:
                    "Mini galerie d'en-tête, visuel droit. Réservé Pierre Gasly & Isack Hadjar.",
                }),
              ],
            },
            {
              name: "detailNewsLinks",
              type: "relationship",
              relationTo: "news",
              hasMany: true,
              label: "Latest news (linked articles)",
              admin: {
                description:
                  "Articles affichés dans le bloc ‘Latest news’ en haut de la fiche pilote. Sélectionnez 3 à 4 articles existants dans la collection News — titre et vignette sont repris automatiquement, chaque carte cliquable renvoie vers l'article (/news/<slug>/).",
              },
            },
            {
              name: "detailNews",
              type: "array",
              label: "Related News (legacy)",
              admin: {
                description:
                  "⚠️ Champ historique — conservé pour compatibilité. Utilisez plutôt ‘Latest news (linked articles)’ ci-dessus pour lier de vrais articles cliquables. Les entrées ici ne sont pas cliquables.",
                hidden: true,
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  localized: true,
                },
                imageField({
                  name: "image",
                  label: "Related news image",
                  required: true,
                  description: "Vignette carrée de l'article lié (non cliquable).",
                }),
              ],
            },
          ]
        }
      ]
    }
  ],
  hooks: {
    afterChange: [
      ({ doc, req }: { doc: Record<string, unknown>; req: { locale?: string | null } }) => {
        revalidateDriverDetail((doc as { slug?: string }).slug);
        // Auto-translate all localized fields to every other locale when any locale is saved.
        const locale = req?.locale || "en";
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return;
        const secret = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET || "";
        const base = getSiteUrl();
        const url = `${base}/api/translate-payload?scope=collections&collection=drivers&id=${doc.id}&force=1&sourceLocale=${locale}&secret=${encodeURIComponent(secret)}`;
        after(() => fetch(url, { method: "POST" }).catch(() => {}));
      },
    ],
    afterDelete: [
      ({ doc }: { doc: unknown }) => { revalidateDriverDetail((doc as { slug?: string }).slug); },
    ],
  },
};
