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
  const scope = url.searchParams.get("scope") || "all";
  const onlyLocale = url.searchParams.get("locale");
  const localesToRun: readonly string[] = onlyLocale
    ? LOCALES.filter((l) => l === onlyLocale)
    : LOCALES;

  const payload = await getPayloadClient();
  const messagesByLocale: Record<string, Messages> = {};
  for (const l of LOCALES) {
    messagesByLocale[l] = await loadMessages(l);
  }

  const log: string[] = [];
  let written = 0;
  let skipped = 0;

  if (scope !== "all" && scope !== "globals") {
    log.push("(skipping globals)");
  } else for (const [slug, namespace] of Object.entries(GLOBAL_TO_NAMESPACE)) {
    log.push(`\n• ${slug} (${namespace})`);
    for (const locale of localesToRun) {
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

  // ─── News collection — per-doc per-locale ─────────────────────────────
  if (scope !== "all" && scope !== "news") {
    log.push("\n(skipping news)");
  } else { log.push(`\n• news (per article)`);
  const allNews = await payload
    .find({ collection: "news", limit: 1000, depth: 0, locale: "all" as never })
    .catch(() => ({ docs: [] as unknown[] }));
  for (const doc of allNews.docs as Array<Record<string, unknown>>) {
    const id = doc.id as number | string;
    const slug = (doc.slug as string) ?? `#${id}`;
    for (const locale of localesToRun) {
      const localized = await payload
        .findByID({
          collection: "news",
          id,
          locale: locale as never,
          fallbackLocale: false,
          depth: 0,
        })
        .catch(() => null);
      if (!localized) continue;
      const seo =
        ((localized as { seo?: Record<string, unknown> }).seo ?? {}) as {
          metaTitle?: string;
          metaDescription?: string;
          keywords?: string;
          ogImage?: string;
        };
      const titleVal = (localized as { title?: string }).title ?? "";
      if (!titleVal.trim()) continue;
      const excerpt = (localized as { excerpt?: string }).excerpt;
      const intro = (localized as { introParagraphs?: string }).introParagraphs;
      let descFallback = "";
      if (excerpt && excerpt.trim()) {
        descFallback = excerpt.trim();
      } else if (intro) {
        const first = intro.split("\n").map((s) => s.trim()).find(Boolean) || "";
        descFallback = first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
      }
      const kw = messagesByLocale[locale]?.meta?.keywords;
      const keywordsFallback = typeof kw === "string" ? kw : "";

      const next: Record<string, unknown> = { ...seo };
      const writes: string[] = [];
      if ((force || isEmpty(seo.metaTitle)) && titleVal) {
        next.metaTitle = titleVal;
        writes.push("title");
      }
      if ((force || isEmpty(seo.metaDescription)) && descFallback) {
        next.metaDescription = descFallback;
        writes.push("desc");
      }
      if ((force || isEmpty(seo.keywords)) && keywordsFallback) {
        next.keywords = keywordsFallback;
        writes.push("keywords");
      }
      if (writes.length === 0) {
        skipped += 1;
        continue;
      }
      if (dryRun) {
        log.push(`  [${locale}] ${slug}: DRY ${writes.join(", ")}`);
        written += 1;
        continue;
      }
      try {
        await payload.update({
          collection: "news",
          id,
          locale: locale as never,
          data: { seo: next } as never,
          depth: 0,
          overrideAccess: true,
          context: { fromAutoTranslate: true } as never,
        });
        log.push(`  [${locale}] ${slug}: ✓ ${writes.join(", ")}`);
        written += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.push(`  [${locale}] ${slug}: ✗ ${msg.slice(0, 100)}`);
      }
    }
  }

  } // end news scope block

  // ─── Drivers collection — per-doc per-locale ──────────────────────────
  if (scope !== "all" && scope !== "drivers") {
    log.push("\n(skipping drivers)");
  } else { log.push(`\n• drivers (per profile)`);
  const allDrivers = await payload
    .find({ collection: "drivers", limit: 200, depth: 0, locale: "all" as never })
    .catch(() => ({ docs: [] as unknown[] }));
  for (const doc of allDrivers.docs as Array<Record<string, unknown>>) {
    const id = doc.id as number | string;
    const slug = (doc.slug as string) ?? `#${id}`;
    for (const locale of localesToRun) {
      const localized = await payload
        .findByID({
          collection: "drivers",
          id,
          locale: locale as never,
          fallbackLocale: false,
          depth: 0,
        })
        .catch(() => null);
      if (!localized) continue;
      const seo =
        ((localized as { seo?: Record<string, unknown> }).seo ?? {}) as {
          metaTitle?: string;
          metaDescription?: string;
          keywords?: string;
          ogImage?: string;
        };
      const driverName = (localized as { name?: string }).name ?? "";
      const role = (localized as { role?: string }).role ?? "";
      if (!driverName.trim()) continue;
      const meta = messagesByLocale[locale]?.meta as Record<string, unknown> | undefined;
      const driversNs = meta?.drivers as { detailTitle?: string; detailDescription?: string } | undefined;
      const titleTpl = driversNs?.detailTitle ?? "{name}";
      const descTpl = driversNs?.detailDescription ?? "{name}";
      const titleFallback = titleTpl.replace("{name}", driverName).replace("{role}", role);
      const descFallback = role
        ? descTpl.replace("{name}", driverName).replace("{role}", role)
        : "";
      const kw = (meta?.keywords as string | undefined) ?? "";

      const next: Record<string, unknown> = { ...seo };
      const writes: string[] = [];
      if ((force || isEmpty(seo.metaTitle)) && titleFallback) {
        next.metaTitle = titleFallback;
        writes.push("title");
      }
      if ((force || isEmpty(seo.metaDescription)) && descFallback) {
        next.metaDescription = descFallback;
        writes.push("desc");
      }
      if ((force || isEmpty(seo.keywords)) && kw) {
        next.keywords = kw;
        writes.push("keywords");
      }
      if (writes.length === 0) {
        skipped += 1;
        continue;
      }
      if (dryRun) {
        log.push(`  [${locale}] ${slug}: DRY ${writes.join(", ")}`);
        written += 1;
        continue;
      }
      try {
        await payload.update({
          collection: "drivers",
          id,
          locale: locale as never,
          data: { seo: next } as never,
          depth: 0,
          overrideAccess: true,
          context: { fromAutoTranslate: true } as never,
        });
        log.push(`  [${locale}] ${slug}: ✓ ${writes.join(", ")}`);
        written += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.push(`  [${locale}] ${slug}: ✗ ${msg.slice(0, 100)}`);
      }
    }
  }

  } // end drivers scope block

  return NextResponse.json({
    ok: true,
    scope,
    written,
    skipped,
    dryRun,
    log: log.join("\n"),
  });
}
