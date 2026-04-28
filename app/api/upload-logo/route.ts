import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES: Record<string, string> = {
  "image/svg+xml": ".svg",
  "image/png": ".png",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Format non supporté : ${file.type}. Utilisez SVG ou PNG.` },
        { status: 400 },
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: `Fichier trop lourd (${Math.round(file.size / 1024)} KB). Max 4 MB.` },
        { status: 400 },
      );
    }

    const { put } = await import("@vercel/blob");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.+$/, "");
    const pathname = `logos/${Date.now()}-${safeName}${safeName.endsWith(ext) ? "" : ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload-logo]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 },
    );
  }
}
