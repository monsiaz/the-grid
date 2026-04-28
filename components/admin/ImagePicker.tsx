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

const BROKEN_IMG_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3Cline x1='2' y1='2' x2='22' y2='22'/%3E%3C/svg%3E";

/**
 * Tiny in-module cache so re-opening the modal within a short window (or
 * switching between ImagePicker instances on the same page) doesn't re-hit
 * the network. Keyed by `${search}|${filter}|${page}`.
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

  // Inline upload (from field toolbar)
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal upload (from inside the library)
  const [modalUploading, setModalUploading] = useState(false);
  const [modalUploadError, setModalUploadError] = useState<string | null>(null);
  const [modalUploadProgress, setModalUploadProgress] = useState<string | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);

  // Track tiles that failed to load their image
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  // Reset broken-tile tracking whenever the docs list refreshes
  useEffect(() => {
    setImgErrors(new Set());
  }, [docs]);

  const handleImgError = useCallback((id: string) => {
    setImgErrors((prev) => new Set([...prev, id]));
  }, []);

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

  // ── Inline upload (from field toolbar) ──────────────────────────────────────
  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadError(null);
      setUploadProgress(`${Math.round(file.size / 1024)} KB → conversion WebP…`);
      try {
        if (file.size > 8 * 1024 * 1024) {
          throw new Error(
            `Fichier trop volumineux (${Math.round(file.size / 1024 / 1024)} MB). Max ~8 MB. Compresse le fichier ou réduit sa taille avant upload.`,
          );
        }
        const form = new FormData();
        form.append("file", file);
        form.append(
          "_payload",
          JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, ""), category: filter || "other" }),
        );
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

  // ── Modal upload (from inside the library) ──────────────────────────────────
  const handleModalUpload = useCallback(
    async (file: File) => {
      setModalUploading(true);
      setModalUploadError(null);
      setModalUploadProgress(`${Math.round(file.size / 1024)} KB → upload & conversion WebP…`);
      try {
        if (file.size > 8 * 1024 * 1024) {
          throw new Error(
            `Fichier trop volumineux (${Math.round(file.size / 1024 / 1024)} MB). Max ~8 MB.`,
          );
        }
        const form = new FormData();
        form.append("file", file);
        form.append(
          "_payload",
          JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, ""), category: filter || "other" }),
        );
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
        // Invalidate all cache pages so the new image appears immediately.
        cache.clear();
        // Jump to page 1 so the freshly uploaded image (sorted by -updatedAt) is visible first.
        setPage(1);
        await loadDocs({ fresh: true });
        // Auto-select the new image
        if (newDoc?.url) {
          setValue(newDoc.url);
          setOpen(false);
        }
      } catch (err) {
        setModalUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        setModalUploading(false);
        setModalUploadProgress(null);
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

  const onModalFileSelect = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      handleModalUpload(file);
    },
    [handleModalUpload],
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
                {/* ── Upload button inside the modal ── */}
                <button
                  type="button"
                  className="grid-image-picker__btn grid-image-picker__btn--upload"
                  onClick={() => modalFileInputRef.current?.click()}
                  disabled={modalUploading}
                  title="Uploader une nouvelle image"
                >
                  {modalUploading ? (
                    <span className="grid-image-picker__upload-spinner" aria-hidden />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  )}
                  {modalUploading ? "Upload…" : "Uploader"}
                </button>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    onModalFileSelect(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  className="grid-image-picker__btn"
                  onClick={() => loadDocs({ fresh: true })}
                  disabled={loading}
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
              {/* Upload feedback row */}
              {(modalUploadProgress || modalUploadError) ? (
                <div className="grid-image-picker__modal-upload-status">
                  {modalUploadProgress ? (
                    <span className="grid-image-picker__progress">{modalUploadProgress}</span>
                  ) : null}
                  {modalUploadError ? (
                    <span className="grid-image-picker__error">{modalUploadError}</span>
                  ) : null}
                </div>
              ) : null}
            </header>
            <div className="grid-image-picker__modal-grid">
              {loading && docs.length === 0 ? (
                <div className="grid-image-picker__modal-empty">Chargement…</div>
              ) : docs.length === 0 ? (
                <div className="grid-image-picker__modal-empty">
                  Aucune image trouvée.
                  {modalUploading ? " Upload en cours…" : ""}
                </div>
              ) : (
                docs.map((doc) => {
                  const url = pickBestUrl(doc);
                  const thumb = pickThumbUrl(doc);
                  if (!url) return null;
                  const thumbDims =
                    doc.sizes?.thumbnail && doc.sizes.thumbnail.width && doc.sizes.thumbnail.height
                      ? { w: doc.sizes.thumbnail.width, h: doc.sizes.thumbnail.height }
                      : { w: 400, h: 300 };
                  const docIdStr = String(doc.id);
                  const isBroken = imgErrors.has(docIdStr);
                  return (
                    <button
                      key={docIdStr}
                      type="button"
                      className={`grid-image-picker__tile${isBroken ? " is-broken" : ""}`}
                      onClick={() => {
                        setValue(url);
                        setOpen(false);
                      }}
                      title={doc.alt || doc.filename || url}
                    >
                      {isBroken ? (
                        <div className="grid-image-picker__tile-broken">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={BROKEN_IMG_SVG}
                            alt=""
                            width={40}
                            height={40}
                            aria-hidden
                          />
                          <span className="grid-image-picker__tile-broken-label">
                            {doc.filename || "image cassée"}
                          </span>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={normalizeUrl(thumb || url)}
                          alt={doc.alt || ""}
                          width={thumbDims.w}
                          height={thumbDims.h}
                          loading="lazy"
                          decoding="async"
                          onError={() => handleImgError(docIdStr)}
                          {...({ fetchpriority: "low" } as Record<string, string>)}
                        />
                      )}
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
