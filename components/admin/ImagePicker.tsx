"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";
import { MEDIA_CATEGORIES } from "@/collections/Media";
import "./ImagePicker.scss";

type ImagePickerProps = {
  path: string;
  field?: {
    label?: string | Record<string, string>;
    required?: boolean;
    admin?: { description?: string | Record<string, string> };
  };
  label?: string | Record<string, string>;
  required?: boolean;
};

type MediaDoc = {
  id: number | string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  alt?: string | null;
  category?: string | null;
  driverSlug?: string | null;
  tags?: { tag?: string }[] | null;
  sizes?: Record<string, { url?: string | null; width?: number; height?: number }>;
  width?: number;
  height?: number;
};

function resolveLabel(value: string | Record<string, string> | undefined, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.en || value.fr || Object.values(value)[0] || fallback;
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `/${url}`;
}

function pickBestUrl(doc: MediaDoc): string {
  return doc.url || doc.sizes?.hero?.url || doc.sizes?.card?.url || doc.sizes?.thumbnail?.url || "";
}

function pickThumbUrl(doc: MediaDoc): string {
  return (
    doc.thumbnailURL ||
    doc.sizes?.thumbnail?.url ||
    doc.sizes?.card?.url ||
    doc.url ||
    ""
  );
}

/**
 * Tiny in-module cache so re-opening the modal within a short window (or
 * switching between ImagePicker instances on the same page) doesn't re-hit
 * the network. Keyed by `${search}|${filter}`.
 */
const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { at: number; docs: MediaDoc[]; total: number }>();
const PAGE_SIZE = 60;

export default function ImagePicker(props: ImagePickerProps) {
  const { path, field, label: labelProp, required: requiredProp } = props;
  const { value, setValue } = useField<string>({ path });
  const raw = (value ?? "") as string;

  const label =
    resolveLabel(labelProp) || resolveLabel(field?.label) || path.split(".").slice(-1)[0];
  const description = resolveLabel(field?.admin?.description);
  const required = requiredProp ?? field?.required;

  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<MediaDoc[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Debounce search → 300ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const cacheKey = `${search}|${filter}|${page}`;

  const loadDocs = useCallback(
    async (opts: { fresh?: boolean } = {}) => {
      const cached = cache.get(cacheKey);
      if (!opts.fresh && cached && Date.now() - cached.at < CACHE_TTL_MS) {
        setDocs(cached.docs);
        setTotal(cached.total);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", String(PAGE_SIZE));
        params.set("page", String(page));
        params.set("depth", "0");
        params.set("sort", "-updatedAt");
        if (search) {
          params.set("where[or][0][alt][like]", search);
          params.set("where[or][1][filename][like]", search);
          params.set("where[or][2][subject][like]", search);
          params.set("where[or][3][tags.tag][like]", search);
        }
        if (filter) params.set("where[category][equals]", filter);
        const res = await fetch(`/api/media?${params.toString()}`, {
          credentials: "include",
        });
        const data = await res.json();
        const list = (data?.docs as MediaDoc[]) || [];
        const totalDocs: number = data?.totalDocs ?? list.length;
        setDocs(list);
        setTotal(totalDocs);
        cache.set(cacheKey, { at: Date.now(), docs: list, total: totalDocs });
      } catch (e) {
        console.error("MediaPicker load failed", e);
        setDocs([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, filter, page, search],
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  useEffect(() => {
    if (!open) return;
    loadDocs();
  }, [open, loadDocs]);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(`${Math.round(file.size / 1024)} KB → conversion WebP…`);
      try {
        // 8MB hard limit: Vercel serverless caps body to ~4.5MB; Payload
        // receives multipart so real headroom is a bit lower. Friendly error
        // before we fire the request.
        if (file.size > 8 * 1024 * 1024) {
          throw new Error(
            `Fichier trop volumineux (${Math.round(file.size / 1024 / 1024)} MB). Max ~8 MB. Compresse le fichier ou réduit sa taille avant upload.`,
          );
        }

        const form = new FormData();
        const payload = {
          alt: file.name.replace(/\.[^.]+$/, ""),
          category: filter || "other",
        };
        form.append("file", file);
        form.append("_payload", JSON.stringify(payload));
        const res = await fetch("/api/media", {
          method: "POST",
          credentials: "include",
          body: form,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text.slice(0, 300) || `HTTP ${res.status}`);
        }
        const data = await res.json();
        const newDoc: MediaDoc | undefined = data?.doc || data;
        // Invalidate all cached pages — a new asset just appeared.
        cache.clear();
        if (newDoc?.url) {
          setValue(newDoc.url);
          setOpen(false);
        } else {
          await loadDocs({ fresh: true });
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [filter, loadDocs, setValue],
  );

  const onFileSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      handleUpload(file);
    },
    [handleUpload],
  );

  const previewUrl = useMemo(() => (raw ? normalizeUrl(raw) : ""), [raw]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="grid-image-picker">
      <div className="grid-image-picker__label-row">
        <label htmlFor={path} className="grid-image-picker__label">
          {label}
          {required ? <span className="grid-image-picker__required"> *</span> : null}
        </label>
        <div className="grid-image-picker__toolbar">
          <button
            type="button"
            className="grid-image-picker__btn grid-image-picker__btn--primary"
            onClick={() => setOpen(true)}
          >
            Parcourir la bibliothèque
          </button>
          <button
            type="button"
            className="grid-image-picker__btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Upload…" : "Uploader"}
          </button>
          {raw ? (
            <button
              type="button"
              className="grid-image-picker__btn grid-image-picker__btn--ghost"
              onClick={() => setValue("")}
            >
              Effacer
            </button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            style={{ display: "none" }}
            onChange={(e) => {
              onFileSelect(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="grid-image-picker__body">
        <div
          className="grid-image-picker__preview"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("is-dragover");
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove("is-dragover")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("is-dragover");
            onFileSelect(e.dataTransfer.files?.[0]);
          }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="grid-image-picker__preview-img"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
              }}
            />
          ) : (
            <div className="grid-image-picker__preview-empty">
              Aucune image
              <span className="grid-image-picker__preview-hint">Glisse ici pour uploader</span>
            </div>
          )}
        </div>
        <div className="grid-image-picker__input-group">
          <input
            id={path}
            type="text"
            className="grid-image-picker__input"
            value={raw}
            placeholder="/images/...  ou  https://...blob.vercel-storage.com/..."
            onChange={(e) => setValue(e.target.value)}
          />
          {description ? (
            <div className="grid-image-picker__desc">{description}</div>
          ) : null}
          <div className="grid-image-picker__hint">
            Formats acceptés&nbsp;: JPG · PNG · WebP · AVIF · GIF. Conversion automatique
            en WebP (qualité 82) + génération de 3 tailles (400 · 900 · 1920). Poids max
            upload&nbsp;~8 MB — au-delà, compresse avant.
          </div>
          {uploadProgress ? (
            <div className="grid-image-picker__progress">{uploadProgress}</div>
          ) : null}
          {uploadError ? (
            <div className="grid-image-picker__error">{uploadError}</div>
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          className="grid-image-picker__modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.currentTarget === e.target) setOpen(false);
          }}
        >
          <div className="grid-image-picker__modal-inner">
            <header className="grid-image-picker__modal-header">
              <h3>
                Bibliothèque média{" "}
                {total ? (
                  <span className="grid-image-picker__modal-count">
                    · {docs.length} / {total}
                  </span>
                ) : null}
              </h3>
              <div className="grid-image-picker__modal-filters">
                <input
                  type="search"
                  placeholder="Rechercher (alt, filename, sujet, tag)…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="grid-image-picker__search"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="grid-image-picker__select"
                >
                  <option value="">Toutes les catégories</option>
                  {MEDIA_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="grid-image-picker__btn"
                  onClick={() => loadDocs({ fresh: true })}
                >
                  Rafraîchir
                </button>
                <button
                  type="button"
                  className="grid-image-picker__btn grid-image-picker__btn--ghost"
                  onClick={() => setOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </header>
            <div className="grid-image-picker__modal-grid">
              {loading && docs.length === 0 ? (
                <div className="grid-image-picker__modal-empty">Chargement…</div>
              ) : docs.length === 0 ? (
                <div className="grid-image-picker__modal-empty">
                  Aucune image trouvée.
                  {uploading ? " Upload en cours…" : ""}
                </div>
              ) : (
                docs.map((doc) => {
                  const url = pickBestUrl(doc);
                  const thumb = pickThumbUrl(doc);
                  if (!url) return null;
                  // Use thumbnail dims if available for correct aspect-ratio.
                  const thumbDims =
                    doc.sizes?.thumbnail && doc.sizes.thumbnail.width && doc.sizes.thumbnail.height
                      ? { w: doc.sizes.thumbnail.width, h: doc.sizes.thumbnail.height }
                      : { w: 400, h: 300 };
                  return (
                    <button
                      key={String(doc.id)}
                      type="button"
                      className="grid-image-picker__tile"
                      onClick={() => {
                        setValue(url);
                        setOpen(false);
                      }}
                      title={doc.alt || doc.filename || url}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb || url}
                        alt={doc.alt || ""}
                        width={thumbDims.w}
                        height={thumbDims.h}
                        loading="lazy"
                        decoding="async"
                        // Low priority: the browser defers these until the
                        // user scrolls them into view. Non-standard on Safari
                        // but harmless.
                        {...({ fetchpriority: "low" } as Record<string, string>)}
                      />
                      <div className="grid-image-picker__tile-meta">
                        <span className="grid-image-picker__tile-alt">
                          {doc.alt || doc.filename}
                        </span>
                        {doc.category ? (
                          <span className="grid-image-picker__tile-cat">
                            {doc.category}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            {total > PAGE_SIZE ? (
              <footer className="grid-image-picker__modal-footer">
                <button
                  type="button"
                  className="grid-image-picker__btn"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Précédent
                </button>
                <span className="grid-image-picker__modal-page">
                  Page {page} / {pageCount}
                </span>
                <button
                  type="button"
                  className="grid-image-picker__btn"
                  disabled={page >= pageCount || loading}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Suivant →
                </button>
              </footer>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
