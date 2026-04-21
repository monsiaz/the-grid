import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getPayloadClient } from "@/lib/payload";
import config from "@/payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const TARGET_LOCALES: Record<string, string> = {
  fr: "French (France)",
  es: "Spanish (Spain)",
  de: "German (Germany)",
  it: "Italian (Italy)",
  nl: "Dutch (Netherlands)",
  zh: "Simplified Chinese (China)",
};

const SOURCE_LOCALE = "en";
const MODEL = process.env.OPENAI_TRANSLATOR_MODEL || "gpt-5.4-nano";

const SYSTEM_PROMPT = `You are a senior marketing translator for a premium 360° motorsport agency called "The Grid".
You translate short UI strings, SEO metadata, marketing copy and accessibility labels.
Hard rules:
- Preserve ICU placeholders like {name}, {title}, {index} exactly as-is.
- Preserve inline HTML, bracket tags like [highlight]...[/highlight], newline characters and paragraph breaks.
- Preserve brand names: The Grid, The Grid Agency, ACCÉLÈRE, Pierre Gasly, Isack Hadjar, Hintsa, BWT Alpine F1 Team, COMe Maison Financière, Formula 1, Formula 2, Formula 3.
- Do not translate URLs, emails, file paths, slugs, enum values.
- Preserve CASING intent (UPPERCASE stays UPPERCASE).
- Natural idiomatic tone, premium & editorial. Keep copy crisp.
- French: keep non-breaking spaces before : ; ! ? where idiomatic. Chinese: Simplified, no latin spaces around CJK.`;

type AnyRecord = Record<string, unknown>;

type FieldDef = {
  name?: string;
  type?: string;
  localized?: boolean;
  fields?: FieldDef[];
  blocks?: { slug: string; fields: FieldDef[] }[];
};

type PathSegment = string;

function walkLocalizedFields(
  fields: FieldDef[] | undefined,
  pathStack: PathSegment[],
  onField: (path: PathSegment[], field: FieldDef) => void,
) {
  if (!Array.isArray(fields)) return;
  for (const field of fields) {
    if (!field || typeof field !== "object") continue;
    const { type, name } = field;
    if (!type) continue;

    if (type === "group" && Array.isArray(field.fields)) {
      walkLocalizedFields(field.fields, [...pathStack, name as string], onField);
      continue;
    }
    if (type === "array" && Array.isArray(field.fields)) {
      walkLocalizedFields(field.fields, [...pathStack, name as string, "[]"], onField);
      continue;
    }
    if (type === "blocks" && Array.isArray(field.blocks)) {
      for (const block of field.blocks) {
        if (Array.isArray(block.fields)) {
          walkLocalizedFields(block.fields, [...pathStack, name as string, "[]", block.slug], onField);
        }
      }
      continue;
    }
    if ((type === "text" || type === "textarea" || type === "richText") && field.localized && name) {
      onField([...pathStack, name], field);
    }
  }
}

function extractValues(doc: unknown, pathStack: PathSegment[]) {
  const results: { idxPath: (string | number)[]; value: string }[] = [];
  function recurse(node: unknown, idxPath: (string | number)[], jsonPath: PathSegment[]) {
    if (jsonPath.length === 0) {
      if (typeof node === "string") {
        results.push({ idxPath, value: node });
      }
      return;
    }
    const [head, ...rest] = jsonPath;
    if (head === "[]") {
      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          recurse(node[i], [...idxPath, i], rest);
        }
      }
      return;
    }
    if (node && typeof node === "object") {
      recurse((node as AnyRecord)[head], [...idxPath, head], rest);
    }
  }
  recurse(doc, [], pathStack);
  return results;
}

function setValue(doc: AnyRecord, idxPath: (string | number)[], value: string) {
  let node: AnyRecord | unknown[] = doc;
  for (let i = 0; i < idxPath.length - 1; i++) {
    const key = idxPath[i];
    const next = idxPath[i + 1];
    if (typeof key === "number") {
      if (!Array.isArray(node)) return;
    } else if (!node || typeof node !== "object") {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const current = (node as any)[key];
    if (current === undefined || current === null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (node as any)[key] = typeof next === "number" ? [] : {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node = (node as any)[key];
  }
  const last = idxPath[idxPath.length - 1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (node as any)[last] = value;
}

async function translateBatch(
  openai: OpenAI,
  entries: { value: string }[],
  localeLabel: string,
): Promise<string[]> {
  const payload: Record<string, string> = {};
  entries.forEach((entry, idx) => {
    payload[`k${idx}`] = entry.value;
  });
  const user = `Translate each value from English to ${localeLabel}.
Return a STRICT JSON object with the same keys (k0, k1, …) and translated strings only.

INPUT:
${JSON.stringify(payload, null, 2)}`;

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });
  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");
  const parsed = JSON.parse(content) as Record<string, string>;
  return entries.map((_, i) => parsed[`k${i}`]);
}

function collectLocalizedPaths(fields?: FieldDef[]): PathSegment[][] {
  const paths: PathSegment[][] = [];
  walkLocalizedFields(fields, [], (p) => paths.push(p));
  return paths;
}

function pruneForUpdate<T>(doc: T): T {
  if (!doc || typeof doc !== "object") return doc;
  const clone = JSON.parse(JSON.stringify(doc));
  delete clone.id;
  delete clone.createdAt;
  delete clone.updatedAt;
  delete clone._status;
  return clone;
}

async function translateDoc(
  openai: OpenAI,
  sourceDoc: unknown,
  targetDoc: AnyRecord,
  localizedPaths: PathSegment[][],
  localeLabel: string,
  existingLocaleDoc: unknown,
  force: boolean,
) {
  const updates: { idxPath: (string | number)[]; value: string }[] = [];
  for (const pathStack of localizedPaths) {
    const values = extractValues(sourceDoc, pathStack);
    for (const { idxPath, value } of values) {
      if (typeof value !== "string" || value.trim().length === 0) continue;
      const existingValues = extractValues(existingLocaleDoc, pathStack);
      const existingAtPath = existingValues.find(
        (e) => JSON.stringify(e.idxPath) === JSON.stringify(idxPath),
      );
      const existingStr = existingAtPath?.value;
      if (!force && existingStr && existingStr !== value && existingStr.trim().length > 0) {
        continue;
      }
      updates.push({ idxPath, value });
    }
  }
  if (updates.length === 0) return 0;
  const translated = await translateBatch(openai, updates, localeLabel);
  updates.forEach((u, i) => {
    const t = translated[i];
    if (typeof t === "string") setValue(targetDoc, u.idxPath, t);
  });
  return updates.length;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TRANSLATE_SECRET || process.env.PAYLOAD_SECRET;
  const provided =
    request.headers.get("x-translate-secret") ||
    new URL(request.url).searchParams.get("secret") ||
    "";
  if (process.env.NODE_ENV === "production" && (!expectedSecret || provided !== expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "1" || searchParams.get("force") === "true";
  const onlyLocale = searchParams.get("locale") || "";
  const scope = searchParams.get("scope") || "all";

  const openai = new OpenAI({ apiKey });
  const payload = await getPayloadClient();

  const cfg = typeof config === "function" ? await (config as () => Promise<typeof config>)() : await config;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolved = cfg as any;
  const globals = (resolved.globals || []) as { slug: string; fields: FieldDef[] }[];
  const collections = (resolved.collections || []) as { slug: string; fields: FieldDef[] }[];

  const locales = Object.entries(TARGET_LOCALES).filter(
    ([code]) => !onlyLocale || code === onlyLocale,
  );

  const log: string[] = [];

  if (scope === "all" || scope === "globals") {
  for (const g of globals) {
    const paths = collectLocalizedPaths(g.fields);
    if (paths.length === 0) continue;
    log.push(`global ${g.slug} (${paths.length} paths)`);
    const source = await payload.findGlobal({
      slug: g.slug as never,
      locale: SOURCE_LOCALE,
      fallbackLocale: false,
      depth: 0,
    });
    for (const [locale, label] of locales) {
      const existing = await payload
        .findGlobal({
          slug: g.slug as never,
          locale: locale as never,
          fallbackLocale: false,
          depth: 0,
        })
        .catch(() => ({}));
      const target = pruneForUpdate(source) as AnyRecord;
      const count = await translateDoc(openai, source, target, paths, label, existing, force);
      if (count > 0) {
        await payload.updateGlobal({
          slug: g.slug as never,
          locale: locale as never,
          data: target as never,
          depth: 0,
        });
        log.push(`  ${g.slug} ${locale}: ${count} updated`);
      }
    }
  }
  }

  if (scope === "all" || scope === "collections") {
  for (const c of collections) {
    if (["users", "media"].includes(c.slug)) continue;
    const paths = collectLocalizedPaths(c.fields);
    if (paths.length === 0) continue;
    log.push(`collection ${c.slug} (${paths.length} paths)`);
    const all = await payload.find({
      collection: c.slug as never,
      limit: 1000,
      locale: SOURCE_LOCALE,
      fallbackLocale: false,
      depth: 0,
    });
    for (const sourceDoc of all.docs as AnyRecord[]) {
      for (const [locale, label] of locales) {
        const existing = await payload
          .findByID({
            collection: c.slug as never,
            id: sourceDoc.id as never,
            locale: locale as never,
            fallbackLocale: false,
            depth: 0,
          })
          .catch(() => ({}));
        const target = pruneForUpdate(sourceDoc) as AnyRecord;
        const count = await translateDoc(openai, sourceDoc, target, paths, label, existing, force);
        if (count > 0) {
          await payload.update({
            collection: c.slug as never,
            id: sourceDoc.id as never,
            locale: locale as never,
            data: target as never,
            depth: 0,
          });
          log.push(`  ${c.slug}/${sourceDoc.id} ${locale}: ${count} updated`);
        }
      }
    }
  }
  }

  return NextResponse.json({ success: true, log });
}
