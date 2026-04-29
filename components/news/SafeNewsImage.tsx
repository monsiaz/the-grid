"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SafeNewsImageProps = ImageProps & {
  fallbackClassName?: string;
};

export default function SafeNewsImage({
  src,
  alt,
  fallbackClassName,
  onError,
  ...props
}: SafeNewsImageProps) {
  const normalizedSrc = typeof src === "string" ? src.trim() : src;
  const srcKey = typeof normalizedSrc === "string" ? normalizedSrc : "";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasImage = Boolean(normalizedSrc) && (!srcKey || failedSrc !== srcKey);

  if (!hasImage) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(182,72,63,0.32),transparent_42%),linear-gradient(180deg,rgba(35,35,35,1)_0%,rgba(12,12,12,1)_100%)] ${fallbackClassName ?? ""}`}
      />
    );
  }

  return (
    <Image
      {...props}
      src={normalizedSrc}
      alt={alt}
      onError={(event) => {
        if (srcKey) setFailedSrc(srcKey);
        onError?.(event);
      }}
    />
  );
}
