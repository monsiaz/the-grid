"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef } from "react";
import type { DriverGalleryImage } from "../driversData";

type DriverGalleryCarouselProps = {
  images: DriverGalleryImage[];
  prevLabel?: string;
  nextLabel?: string;
};

export default function DriverGalleryCarousel({
  images,
  prevLabel = "Previous image",
  nextLabel = "Next image",
}: DriverGalleryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByStep = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-gallery-slide]");
    const step = card?.offsetWidth ?? track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  if (images.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      {/* Scrollable track — snap-x, one slide visible at a time with peek on sides */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((img, i) => (
          <div
            key={`gallery-slide-${i}`}
            data-gallery-slide
            className="relative w-full shrink-0 snap-center"
            style={{ aspectRatio: "16/10" }}
          >
            <Image
              src={img.image}
              alt=""
              fill
              className="object-cover"
              style={img.focalPoint ? { objectPosition: img.focalPoint } : undefined}
              sizes="(max-width: 700px) 100vw, 560px"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Chevron buttons */}
      {images.length > 1 ? (
        <div className="mt-2 flex items-center justify-center gap-2" aria-hidden>
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => scrollByStep(-1)}
            className="pill-button pill-button-outline h-9 min-h-9 w-9 px-0 text-white"
          >
            <ChevronLeft className="size-4 shrink-0" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByStep(1)}
            className="pill-button pill-button-outline h-9 min-h-9 w-9 px-0 text-white"
          >
            <ChevronRight className="size-4 shrink-0" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
