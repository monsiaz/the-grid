import type { CollectionConfig, CollectionAfterChangeHook } from "payload";

async function describeBufferWithVision(buf: Buffer, filename: string): Promise<{
  description: string;
  subject: string;
  tags: string[];
} | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const b64 = buf.toString("base64");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        max_tokens: 220,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You describe a motorsport image for a digital asset library. Return strict JSON: { description: (<=30 words, English, factual: who if identifiable, action, brand/partner, setting), subject: (short subject label), tags: [string] }. Focus on precision: drivers, teams, circuits, brand partnerships when visible.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `File: ${filename}` },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${b64}`, detail: "low" } },
            ],
          },
        ],
      }),
    });
    if (!r.ok) return null;
    const j: any = await r.json();
    const content = j?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    return {
      description: parsed.description || "",
      subject: parsed.subject || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    return null;
  }
}

const autoDescribeHook: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== "create") return doc;
  if (doc?.description && String(doc.description).trim().length > 0) return doc;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return doc;

  // IMPORTANT: offload Vision description to `after()` so the upload
  // response returns fast. Vercel keeps the function alive long enough
  // for `after` callbacks to run; the ImagePicker shows the image
  // immediately and the description lands on the next list refresh.
  const runDescribe = async () => {
    try {
      const url: string | undefined = doc?.url || doc?.sizes?.thumbnail?.url;
      if (!url) return;
      const fullUrl = url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_SITE_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3000"}${url}`;
      const r = await fetch(fullUrl);
      if (!r.ok) return;
      const buf = Buffer.from(await r.arrayBuffer());
      const result = await describeBufferWithVision(buf, doc.filename || "asset");
      if (!result) return;
      await req.payload.update({
        collection: "media",
        id: doc.id,
        data: {
          description: result.description,
          subject: result.subject || doc.subject,
          tags: result.tags.length
            ? result.tags.map((t: string) => ({ tag: t }))
            : doc.tags,
        },
        overrideAccess: true,
      });
    } catch {
      // swallow — non-critical
    }
  };

  // Try to use Next.js `after()` when available so Vercel keeps the
  // function alive for the background work. Dynamic import so this
  // collection file stays compatible with Payload's client bundle.
  try {
    const mod = await import("next/server").catch(() => null);
    if (mod && typeof mod.after === "function") {
      mod.after(runDescribe);
    } else {
      void runDescribe();
    }
  } catch {
    void runDescribe();
  }

  return doc;
};

export const MEDIA_CATEGORIES = [
  { label: "Homepage", value: "homepage" },
  { label: "About", value: "about" },
  { label: "Services", value: "services" },
  { label: "Drivers (grid)", value: "drivers-grid" },
  { label: "Drivers (detail)", value: "drivers-detail" },
  { label: "Drivers (articles)", value: "drivers-articles" },
  { label: "News", value: "news" },
  { label: "Contact", value: "contact" },
  { label: "Team", value: "team" },
  { label: "Logos & brand", value: "brand" },
  { label: "Other", value: "other" },
] as const;

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "category", "driverSlug", "updatedAt"],
    group: "Library",
    description:
      "Bibliothèque média centralisée. Toutes les images sont automatiquement converties en webP puis servies via le CDN Vercel Blob.",
    listSearchableFields: ["alt", "category", "driverSlug", "tags.tag", "filename"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [autoDescribeHook],
  },
  upload: {
    mimeTypes: ["image/*"],
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: "webp",
      options: {
        quality: 82,
        effort: 4,
      },
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 78 } },
      },
      {
        name: "card",
        width: 900,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "hero",
        width: 1920,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 82 } },
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Texte alternatif (accessibilité + SEO).",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description:
          "Description détaillée du visuel (auto-générée via Vision). Sert à reconnaître l'image dans la bibliothèque et à matcher précisément une demande client du PDF.",
      },
    },
    {
      name: "subject",
      type: "text",
      admin: {
        description: "Sujet principal de la photo (ex: 'Isack Hadjar portrait Red Bull').",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "other",
      options: MEDIA_CATEGORIES as unknown as { label: string; value: string }[],
      admin: {
        description: "Regroupement utilisé dans la bibliothèque pour filtrer.",
      },
    },
    {
      name: "driverSlug",
      type: "text",
      admin: {
        description:
          "Slug du pilote associé (ex: pierre-gasly), utile pour filtrer les articles drivers.",
      },
    },
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
      admin: {
        description: "Mots-clés libres pour filtrer dans la bibliothèque.",
      },
    },
    {
      name: "caption",
      type: "textarea",
      admin: {
        description: "Légende / crédit optionnel.",
      },
    },
    {
      name: "source",
      type: "text",
      admin: {
        description: "Chemin ou URL d'origine (pour traçabilité).",
      },
    },
  ],
};
