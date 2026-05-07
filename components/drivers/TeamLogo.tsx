"use client";

import { useMemo, useState } from "react";

type TeamLogoVariant = "card" | "hero";

type TeamLogoProps = {
  src: string;
  variant?: TeamLogoVariant;
  className?: string;
};

const PRESETS: Record<
  TeamLogoVariant,
  { slotWidth: number; slotHeight: number; targetArea: number }
> = {
  card: { slotWidth: 96, slotHeight: 24, targetArea: 980 },
  hero: { slotWidth: 132, slotHeight: 32, targetArea: 1_760 },
};

function normalizeLogoSize(
  aspectRatio: number | null,
  preset: (typeof PRESETS)[TeamLogoVariant],
) {
  if (!aspectRatio || !Number.isFinite(aspectRatio) || aspectRatio <= 0) {
    return {
      width: Math.round(preset.slotWidth * 0.72),
      height: Math.round(preset.slotHeight * 0.72),
    };
  }

  const rawWidth = Math.sqrt(preset.targetArea * aspectRatio);
  const rawHeight = Math.sqrt(preset.targetArea / aspectRatio);
  const scale = Math.min(1, preset.slotWidth / rawWidth, preset.slotHeight / rawHeight);

  return {
    width: Math.round(rawWidth * scale),
    height: Math.round(rawHeight * scale),
  };
}

export default function TeamLogo({ src, variant = "card", className }: TeamLogoProps) {
  const preset = PRESETS[variant];
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const size = useMemo(
    () => normalizeLogoSize(aspectRatio, preset),
    [aspectRatio, preset],
  );

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-start ${className ?? ""}`}
      style={{ width: size.width, height: preset.slotHeight }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onLoad={(event) => {
          const image = event.currentTarget;
          if (image.naturalWidth > 0 && image.naturalHeight > 0) {
            setAspectRatio(image.naturalWidth / image.naturalHeight);
          }
        }}
        style={{
          width: size.width,
          height: size.height,
          objectFit: "contain",
          objectPosition: "left center",
          display: "block",
        }}
      />
    </span>
  );
}
