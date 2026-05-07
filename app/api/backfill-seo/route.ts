import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getPayloadClient } from "@/lib/payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const LOCALES = ["en", "fr", "es", "de", "it", "nl", "zh"] as const;

const GLOBAL_TO_NAMESPACE: Record<string, string> = {
  homepage: "home",
  "about-page": "about",
  "services-page": "services",
  "drivers-page": "drivers",
  "contact-page": "contact",
};

type Messages = {
  meta?: {
    keywords?: string;
    [k: string]: { title?: string; description?: string } | string | undefined;
  };
};

async function loadMessages(locale: string): Promise<Messages> {
  const fp = path.join(process.cwd(), "messages", `${locale}.json`);
  const raw = await fs.readFile(fp, "utf8");
  return JSON.parse(raw) as Messages;
}

const isEmpty = (v: unknown) =>
  typeof v !== "string" || v.trim().length === 0;

export async function POST(req: Request) {
  const url = new URL(req.url);
  const provided = url.searchParams.get("secret") || req.headers.get("x-secret") || "";
  const expected = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET || "";
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dryRun = url.searchParams.get("dry") === "1";
  const force = url.searchParams.get("force") === "1";

  const payload = await getPayloadClient();
  const messagesByLocale: Record<string, Messages> = {};
  for (const l of LOCALES) {
    messagesByLocale[l] = await loadMessages(l);
  }

  const log: string[] = [];
  let written = 0;
  let skipped = 0;

  for (const [slug, namespace] of Object.entries(GLOBAL_TO_NAMESPACE)) {
    log.push(`\n• ${slug} (${namespace})`);
    for (const locale of LOCALES) {
      const current = await payload
        .findGlobal({
          slug: slug as never,
          locale: locale as never,
          fallbackLocale: false,
          depth: 0,
        })
        .catch(() => null);
      if (!current) {
        log.push(`  [${locale}] not found, skip`);
        continue;
      }
      const seo =
        ((current as { seo?: Record<string, unknown> }).seo ?? {}) as {
          metaTitle?: string;
          metaDescription?: string;
          keywords?: string;
          ogImage?: string;
        };
      const ns = (messagesByLocale[locale]?.meta ?? {}) as Record<
        string,
        { title?: string; description?: string } | string | undefined
      >;
      const nsBlock = ns[namespace];
      const defaults = {
        title:
          typeof nsBlock === "object" && nsBlock !== null
            ? (nsBlock as { title?: string }).title ?? ""
            : "",
        description:
          typeof nsBlock === "object" && nsBlock !== null
            ? (nsBlock as { description?: string }).description ?? ""
            : "",
        keywords:
          typeof messagesByLocale[locale]?.meta?.keywords === "string"
            ? (messagesByLocale[locale]!.meta!.keywords as string)
            : "",
      };

      const next: Record<string, unknown> = { ...seo };
      const writes: string[] = [];
      if ((force || isEmpty(seo.metaTitle)) && defaults.title) {
        next.metaTitle = defaults.title;
        writes.push(`title`);
      }
      if ((force || isEmpty(seo.metaDescription)) && defaults.description) {
        next.metaDescription = defaults.description;
        writes.push(`desc`);
      }
      if ((force || isEmpty(seo.keywords)) && defaults.keywords) {
        next.keywords = defaults.keywords;
        writes.push(`keywords`);
      }
      if (writes.length === 0) {
        log.push(`  [${locale}] already filled, skip`);
        skipped += 1;
        continue;
      }
      if (dryRun) {
        log.push(`  [${locale}] DRY ${writes.join(", ")}`);
        written += 1;
        continue;
      }
      const fullData = { ...(current as Record<string, unknown>), seo: next };
      delete (fullData as { id?: unknown }).id;
      delete (fullData as { _status?: unknown })._status;
      delete (fullData as { createdAt?: unknown }).createdAt;
      delete (fullData as { updatedAt?: unknown }).updatedAt;
      delete (fullData as { globalType?: unknown }).globalType;
      try {
        await payload.updateGlobal({
          slug: slug as never,
          locale: locale as never,
          data: fullData as never,
          depth: 0,
          overrideAccess: true,
        });
        log.push(`  [${locale}] ✓ ${writes.join(", ")}`);
        written += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.push(`  [${locale}] ✗ validation: ${msg.slice(0, 120)}`);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    written,
    skipped,
    dryRun,
    log: log.join("\n"),
  });
}
