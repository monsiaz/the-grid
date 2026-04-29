"use client";

import React, { useCallback, useRef, useState } from "react";
import { useField, useFormFields } from "@payloadcms/ui";
import "./ImagePicker.scss";

type FocalPointPickerProps = {
  path: string;
  field?: {
    label?: string | Record<string, string>;
    admin?: { description?: string | Record<string, string> };
  };
};

function resolveLabel(value: string | Record<string, string> | undefined, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.en || value.fr || Object.values(value)[0] || fallback;
}

/**
 * Visual focal-point picker for an image field.
 *
 * Automatically looks for a sibling `image` field (same path prefix) to show
 * the image preview. The user clicks anywhere on the preview to set the focal
 * point. The stored value is a CSS `object-position` string like "42% 28%".
 *
 * Usage: add an `imageFocalPoint` (text) field next to any `imageField` and
 * point its Field component to "@/components/admin/FocalPointPicker".
 */
export default function FocalPointPicker({ path, field }: FocalPointPickerProps) {
  const { value, setValue } = useField<string>({ path });

  // Derive the sibling image field path:
  // "caseStudies.0.imageFocalPoint" -> "caseStudies.0.image"
  // "heroBackgroundImageFocalPoint" -> "heroBackgroundImage"
  const imagePath = path.endsWith("FocalPoint")
    ? path.slice(0, -"FocalPoint".length)
    : path.replace(/\.[^.]+$/, ".image");

  // Read the sibling image URL from the form state
  const imageUrl = useFormFields(
    ([fields]) => {
      const direct = imagePath !== path ? fields[imagePath]?.value : undefined;
      if (typeof direct === "string" && direct.trim()) return direct;

      // Payload array rows can occasionally expose nested field paths with
      // slightly different prefixes. Fall back to an image field in the same row.
      const parentPath = path.includes(".") ? path.slice(0, path.lastIndexOf(".")) : "";
      const sibling = Object.entries(fields).find(([fieldPath, fieldState]) => {
        return (
          fieldPath !== path &&
          fieldPath.endsWith(".image") &&
          (!parentPath || fieldPath.startsWith(`${parentPath}.`)) &&
          typeof fieldState?.value === "string" &&
          fieldState.value.trim().length > 0
        );
      });

      return (sibling?.[1]?.value ?? "") as string;
    },
  );

  const label = resolveLabel(field?.label) || "Position du cadrage";
  const description = resolveLabel(field?.admin?.description);

  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imageRatio, setImageRatio] = useState<number | null>(null);

  // Parse current stored value to percentages (default: 50 50)
  const parsed = (value || "50% 50%").match(/(\d+(?:\.\d+)?)/g);
  const fx = Math.max(0, Math.min(100, parseFloat(parsed?.[0] ?? "50")));
  const fy = Math.max(0, Math.min(100, parseFloat(parsed?.[1] ?? "50")));

  const computePos = useCallback((e: React.MouseEvent | MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setValue(`${x}% ${y}%`);
  }, [setValue]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    computePos(e);

    const onMove = (ev: MouseEvent) => computePos(ev);
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [computePos]);

  const normalizedImageUrl =
    imageUrl && (imageUrl.startsWith("/") || imageUrl.startsWith("http"))
      ? imageUrl
      : imageUrl
        ? `/${imageUrl}`
        : "";
  const frameRatio = 16 / 9;
  const hasVisibleCrop = imageRatio == null || Math.abs(imageRatio - frameRatio) > 0.03;

  const preview = (
    <>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          width: "100%",
          overflow: "hidden",
          borderRadius: 8,
          cursor: dragging ? "grabbing" : "crosshair",
          userSelect: "none",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={normalizedImageUrl}
          alt=""
          draggable={false}
          onLoad={(event) => {
            const img = event.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setImageRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${fx}% ${fy}%`,
            display: "block",
            pointerEvents: "none",
          }}
        />

        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        </svg>

        <div
          aria-hidden
          style={{
            position: "absolute",
            left: `${fx}%`,
            top: `${fy}%`,
            transform: "translate(-50%, -50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(220,38,38,0.35)",
            border: "2px solid #ef4444",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        <span>
          {hasVisibleCrop
            ? "Cliquez ou glissez pour choisir le cadrage prod 16/9."
            : "Image deja au format 16/9 : le point bouge, mais la photo ne glisse presque pas car elle reste entiere."}
        </span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fx}% / {fy}%</span>
      </div>
      {!hasVisibleCrop ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>
            Apercu zoome de controle : il sert seulement a visualiser le point focal quand le rendu prod ne croppe pas la photo.
          </div>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              width: "100%",
              overflow: "hidden",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizedImageUrl}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `${fx}% ${fy}%`,
                transform: "scale(1.18)",
                transformOrigin: `${fx}% ${fy}%`,
                display: "block",
                pointerEvents: "none",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: `${fx}%`,
                top: `${fy}%`,
                transform: "translate(-50%, -50%)",
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(220,38,38,0.35)",
                border: "2px solid #ef4444",
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );

  if (!imageUrl) {
    return (
      <div className="grid-image-picker">
        <div className="grid-image-picker__label-row">
          <span className="grid-image-picker__label">{label}</span>
        </div>
        <div className="grid-image-picker__hint">
          Ajoutez d&apos;abord une image ci-dessus pour activer le cadrage.
        </div>
      </div>
    );
  }

  return (
    <div className="grid-image-picker">
      <div className="grid-image-picker__label-row">
        <span className="grid-image-picker__label">{label}</span>
        <div className="grid-image-picker__toolbar">
          <button
            type="button"
            className="grid-image-picker__btn grid-image-picker__btn--primary"
            onClick={() => setOpen(true)}
          >
            Cadrer / preview
          </button>
          <button
            type="button"
            className="grid-image-picker__btn grid-image-picker__btn--ghost"
            onClick={() => setValue("50% 50%")}
            title="Recentrer"
          >
            Centrer
          </button>
        </div>
      </div>

      <div className="grid-image-picker__hint">
        Cadrage actuel&nbsp;: {fx}% / {fy}%. Ouvrez la preview pour ajuster sans encombrer le formulaire.
      </div>
      {description ? (
        <div className="grid-image-picker__desc">{description}</div>
      ) : null}
      {open ? (
        <div
          className="grid-image-picker__modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.currentTarget === e.target) setOpen(false);
          }}
        >
          <div className="grid-image-picker__modal-inner" style={{ maxWidth: 980 }}>
            <header className="grid-image-picker__modal-header">
              <h3>Prévisualisation du cadrage</h3>
              <div className="grid-image-picker__modal-filters">
                <button
                  type="button"
                  className="grid-image-picker__btn grid-image-picker__btn--ghost"
                  onClick={() => setValue("50% 50%")}
                >
                  Centrer
                </button>
                <button
                  type="button"
                  className="grid-image-picker__btn"
                  onClick={() => setOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </header>
            <div style={{ padding: "1rem" }}>
              {preview}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
