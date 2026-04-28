"use client";

import React, { useCallback, useRef, useState } from "react";
import { useField } from "@payloadcms/ui";

type LogoPickerProps = {
  path: string;
  field?: {
    label?: string | Record<string, string>;
    required?: boolean;
    admin?: { description?: string | Record<string, string> };
  };
  label?: string | Record<string, string>;
  required?: boolean;
};

function resolveLabel(value: string | Record<string, string> | undefined, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.en || value.fr || Object.values(value)[0] || fallback;
}

function normalizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("http")) return url;
  return `/${url}`;
}

export default function LogoPicker(props: LogoPickerProps) {
  const { path, field, label: labelProp, required: requiredProp } = props;
  const { value, setValue } = useField<string>({ path });
  const raw = (value ?? "") as string;

  const label = resolveLabel(labelProp) || resolveLabel(field?.label) || path.split(".").slice(-1)[0];
  const description = resolveLabel(field?.admin?.description);
  const required = requiredProp ?? field?.required;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl = raw ? normalizeUrl(raw) : "";

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);
      setProgress(`${Math.round(file.size / 1024)} KB → upload…`);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload-logo", {
          method: "POST",
          credentials: "include",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (data?.url) setValue(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setUploading(false);
        setProgress(null);
      }
    },
    [setValue],
  );

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
            accept="image/svg+xml,image/png"
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
        <div
          className="grid-image-picker__preview"
          style={{ background: "rgba(255,255,255,0.04)" }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("is-dragover");
          }}
          onDragLeave={(e) => e.currentTarget.classList.remove("is-dragover")}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("is-dragover");
            const f = e.dataTransfer.files?.[0];
            if (f) handleUpload(f);
          }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="grid-image-picker__preview-img"
              style={{ objectFit: "contain", padding: "8px" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
              }}
            />
          ) : (
            <div className="grid-image-picker__preview-empty">
              Aucun logo
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
            placeholder="https://...blob.vercel-storage.com/logos/..."
            onChange={(e) => setValue(e.target.value)}
          />
          {description ? <div className="grid-image-picker__desc">{description}</div> : null}
          <div className="grid-image-picker__hint">
            Formats acceptés&nbsp;: <strong>SVG</strong> · <strong>PNG</strong>. Fichier stocké
            tel quel (sans conversion). Privilégiez le SVG pour une qualité parfaite à toutes les
            tailles. Poids max 4 MB.
          </div>
          {progress ? <div className="grid-image-picker__progress">{progress}</div> : null}
          {error ? <div className="grid-image-picker__error">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
