"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDocumentInfo } from "@payloadcms/ui";
import { locales, localeLabels, defaultLocale, type Locale } from "@/i18n/config";
import "./TranslationStatus.scss";

type Status = "idle" | "loading" | "ready" | "error";

const PROBES: Record<string, string[]> = {
  news: ["title", "introParagraphs", "bodyParagraphs", "excerpt"],
  "news-tags": ["name"],
  drivers: [
    "name",
    "role",
    "detail.profileParagraphs",
    "detail.careerParagraphs",
    "detail.agencyParagraphs",
    "detail.profileTitle",
  ],
};

function getAtPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let v: unknown = obj;
  for (const p of parts) {
    if (v && typeof v === "object" && p in (v as Record<string, unknown>)) {
      v = (v as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return v;
}

function hasValue(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

export default function TranslationStatus() {
  const info = useDocumentInfo();
  const docId = (info as { id?: string | number }).id;
  const slug = (info as { collectionSlug?: string }).collectionSlug;

  const probeFields = useMemo(() => (slug ? PROBES[slug] : null), [slug]);

  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const [translated, setTranslated] = useState<Record<Locale, boolean>>({
    en: false, fr: false, es: false, de: false, it: false, nl: false, zh: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId || !slug || !probeFields) return;
    let cancelled = false;
    queueMicrotask(() => {
      setStatus("loading");
      setError(null);
    });

    const probe = async () => {
      const results: Record<Locale, boolean> = {
        en: false, fr: false, es: false, de: false, it: false, nl: false, zh: false,
      };
      await Promise.all(
        locales.map(async (loc) => {
          if (loc === defaultLocale) { results[loc] = true; return; }
          const res = await fetch(
            `/api/${slug}/${docId}?locale=${loc}&fallback-locale=null&depth=0`,
            { credentials: "include", cache: "no-store" },
          );
          if (!res.ok) { results[loc] = false; return; }
          const doc = (await res.json()) as Record<string, unknown>;
          results[loc] = probeFields.some((f) => hasValue(getAtPath(doc, f)));
        }),
      );
      return results;
    };

    let pollHandle: ReturnType<typeof setTimeout> | null = null;
    const tick = async (attempt: number) => {
      try {
        const results = await probe();
        if (cancelled) return;
        setTranslated(results);
        setStatus("ready");
        const allDone = locales.every((l) => results[l]);
        // Poll while not all locales are translated yet — handles the async
        // auto-translate that runs in the background after a save (typically
        // 30-90s on Vercel). Stop after ~3 min to avoid a forever-poll.
        if (!allDone && attempt < 18) {
          pollHandle = setTimeout(() => tick(attempt + 1), 10_000);
        }
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setStatus("error"); }
      }
    };
    tick(0);

    return () => {
      cancelled = true;
      if (pollHandle) clearTimeout(pollHandle);
    };
  }, [docId, slug, probeFields]);

  if (!docId || !slug || !probeFields) return null;

  const doneCount = locales.filter((l) => translated[l]).length;
  const totalCount = locales.length;
  const allDone = doneCount === totalCount;
  const isLoading = status === "loading";

  // Compact summary badges (just locale codes)
  const badges = locales.map((loc) => ({
    loc,
    ok: translated[loc],
    code: loc === "zh" ? "中" : loc.toUpperCase(),
  }));

  return (
    <div className={`grid-ts ${open ? "grid-ts--open" : ""}`}>
      {/* ── Trigger bar ── */}
      <button
        type="button"
        className="grid-ts__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Left: icon + label */}
        <span className="grid-ts__trigger-left">
          <span className="grid-ts__globe" aria-hidden>🌐</span>
          <span className="grid-ts__label">Traductions</span>
          {!isLoading && (
            <span className={`grid-ts__score ${allDone ? "grid-ts__score--ok" : "grid-ts__score--warn"}`}>
              {doneCount}/{totalCount}
            </span>
          )}
          {isLoading && <span className="grid-ts__spinner" aria-hidden />}
        </span>

        {/* Right: compact locale pills + chevron */}
        <span className="grid-ts__trigger-right">
          {!isLoading && badges.map(({ loc, ok, code }) => (
            <span
              key={loc}
              className={`grid-ts__dot ${ok ? "grid-ts__dot--ok" : "grid-ts__dot--todo"}`}
              title={`${localeLabels[loc]}: ${ok ? "traduit" : "à traduire"}`}
            >
              {code}
            </span>
          ))}
          <span className={`grid-ts__chevron ${open ? "grid-ts__chevron--up" : ""}`} aria-hidden>
            ▾
          </span>
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="grid-ts__panel">
          <p className="grid-ts__hint">
            Le <code>slug</code> reste identique dans toutes les langues (pivot hreflang). Seuls les champs textuels sont traduits.
          </p>
          <ul className="grid-ts__list">
            {locales.map((loc) => {
              const isDefault = loc === defaultLocale;
              const ok = translated[loc];
              return (
                <li key={loc} className="grid-ts__row">
                  <span className="grid-ts__lang">
                    {localeLabels[loc]} <code>{loc}</code>
                    {isDefault && <span className="grid-ts__default"> (source)</span>}
                  </span>
                  <span className={`grid-ts__pill grid-ts__pill--${isLoading ? "loading" : ok ? "ok" : "todo"}`}>
                    {isLoading ? "…" : ok ? "✓ TRADUIT" : "À TRADUIRE"}
                  </span>
                </li>
              );
            })}
          </ul>
          {error && <p className="grid-ts__error">Erreur : {error}</p>}
        </div>
      )}
    </div>
  );
}
