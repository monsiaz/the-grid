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
  const [translated, setTranslated] = useState<Record<Locale, boolean>>({
    en: false,
    fr: false,
    es: false,
    de: false,
    it: false,
    nl: false,
    zh: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId || !slug || !probeFields) return;

    let cancelled = false;
    setStatus("loading");
    setError(null);

    (async () => {
      try {
        const results: Record<Locale, boolean> = {
          en: false,
          fr: false,
          es: false,
          de: false,
          it: false,
          nl: false,
          zh: false,
        };
        await Promise.all(
          locales.map(async (loc) => {
            if (loc === defaultLocale) {
              results[loc] = true;
              return;
            }
            const res = await fetch(
              `/api/${slug}/${docId}?locale=${loc}&fallback-locale=null&depth=0`,
              { credentials: "include", cache: "no-store" },
            );
            if (!res.ok) {
              results[loc] = false;
              return;
            }
            const doc = (await res.json()) as Record<string, unknown>;
            const hasAny = probeFields.some((f) => hasValue(getAtPath(doc, f)));
            results[loc] = hasAny;
          }),
        );
        if (!cancelled) {
          setTranslated(results);
          setStatus("ready");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [docId, slug, probeFields]);

  if (!docId || !slug || !probeFields) {
    return (
      <div className="grid-translation-status grid-translation-status--empty">
        <h4>Statut des traductions</h4>
        <p>Les traductions apparaîtront ici après la première sauvegarde.</p>
      </div>
    );
  }

  return (
    <div className="grid-translation-status">
      <h4>Statut des traductions</h4>
      <p className="grid-translation-status__hint">
        Le <code>slug</code> reste identique dans toutes les langues (pivot hreflang). Seuls les
        champs textuels sont traduits.
      </p>
      <ul className="grid-translation-status__list">
        {locales.map((loc) => {
          const isDefault = loc === defaultLocale;
          const ok = translated[loc];
          return (
            <li key={loc} className="grid-translation-status__row">
              <span className="grid-translation-status__lang">
                {localeLabels[loc]} <code>{loc}</code>
                {isDefault ? <span className="grid-translation-status__default"> (source)</span> : null}
              </span>
              <span
                className={`grid-translation-status__pill grid-translation-status__pill--${
                  status === "loading" ? "loading" : ok ? "ok" : "todo"
                }`}
              >
                {status === "loading" ? "…" : ok ? "✓ traduit" : "à traduire"}
              </span>
            </li>
          );
        })}
      </ul>
      {error ? <p className="grid-translation-status__error">Erreur: {error}</p> : null}
    </div>
  );
}
