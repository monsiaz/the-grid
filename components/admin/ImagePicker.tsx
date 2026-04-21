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
  sizes?: Record<string, { url?: string | null }>;
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "300");
      params.set("depth", "0");
      params.set("sort", "-updatedAt");
      if (search.trim()) params.set("where[or][0][alt][like]", search.trim());
      if (search.trim()) params.set("where[or][1][filename][like]", search.trim());
      if (filter) params.set("where[category][equals]", filter);
      const res = await fetch(`/api/media?${params.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setDocs((data?.docs as MediaDoc[]) || []);
    } catch (e) {
      console.error("MediaPicker load failed", e);
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(loadDocs, 100);
    return () => clearTimeout(t);
  }, [open, loadDocs]);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setUploadError(null);
      try {
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
        if (newDoc?.url) {
          setValue(newDoc.url);
          setOpen(false);
        } else {
          await loadDocs();
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
      }
    },
    [filter, loadDocs, setValue],
  );

  const previewUrl = useMemo(() => (raw ? normalizeUrl(raw) : ""), [raw]);

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
          >
            Uploader
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
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="grid-image-picker__body">
        <div className="grid-image-picker__preview">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="grid-image-picker__preview-img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
              }}
            />
          ) : (
            <div className="grid-image-picker__preview-empty">Aucune image</div>
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
              <h3>Bibliothèque média</h3>
              <div className="grid-image-picker__modal-filters">
                <input
                  type="search"
                  placeholder="Rechercher (alt, filename)…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  onClick={loadDocs}
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
              {loading ? (
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
                      <img src={thumb || url} alt={doc.alt || ""} />
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
