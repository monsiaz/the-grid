"use client";

import React, { useCallback, useRef, useState } from "react";
import { useField, useFormFields } from "@payloadcms/ui";

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

  // Derive the sibling `image` field path:
  // "caseStudies.0.imageFocalPoint" → "caseStudies.0.image"
  const imagePath = path.replace(/\.[^.]+$/, ".image");

  // Read the sibling image URL from the form state
  const imageUrl = useFormFields(
    ([fields]) => (fields[imagePath]?.value ?? "") as string,
  );

  const label = resolveLabel(field?.label) || "Position du cadrage";
  const description = resolveLabel(field?.admin?.description);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

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

  if (!imageUrl) {
    return (
      <div className="grid-image-picker">
        <div className="grid-image-picker__label-row">
          <span className="grid-image-picker__label">{label}</span>
        </div>
        <div className="grid-image-picker__hint" style={{ marginTop: 6 }}>
          Ajoutez d&apos;abord une image ci-dessus pour activer le cadrage.
        </div>
      </div>
    );
  }

  return (
    <div className="grid-image-picker">
      <div className="grid-image-picker__label-row">
        <span className="grid-image-picker__label">{label}</span>
        <button
          type="button"
          className="grid-image-picker__btn grid-image-picker__btn--ghost"
          onClick={() => setValue("50% 50%")}
          title="Recentrer"
        >
          Centrer
        </button>
      </div>

      {/* 16:9 preview with crosshair */}
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl.startsWith("/") || imageUrl.startsWith("http") ? imageUrl : `/${imageUrl}`}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${fx}% ${fy}%`,
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* Grid overlay (rule of thirds) */}
        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>

        {/* Focal point crosshair */}
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

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, opacity: 0.55 }}>
        <span>Cliquez ou glissez pour cadrer</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{fx}% / {fy}%</span>
      </div>
      {description ? (
        <div className="grid-image-picker__desc">{description}</div>
      ) : null}
    </div>
  );
}
