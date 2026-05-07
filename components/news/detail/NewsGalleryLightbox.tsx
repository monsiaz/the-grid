"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeNewsImage from "../SafeNewsImage";

export type LightboxImage = {
  src: string;
  credit?: string | null;
  alt?: string | null;
};

type Props = {
  images: LightboxImage[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export default function NewsGalleryLightbox({ images, openIndex, onClose, onNavigate }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = openIndex !== null;

  const prev = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex - 1 + images.length) % images.length);
  }, [openIndex, images.length, onNavigate]);

  const next = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex + 1) % images.length);
  }, [openIndex, images.length, onNavigate]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next, onClose]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-full w-full max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
    >
      {/* Full-screen click-catcher: any click outside the image / credit / nav buttons closes. */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 z-0 h-full w-full cursor-zoom-out bg-transparent"
      />
      <AnimatePresence mode="wait">
        {isOpen && current && (
          <motion.div
            key={openIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 px-16"
          >
            <div
              className="pointer-events-auto relative max-h-[80vh] w-full max-w-[1200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <SafeNewsImage
                  src={current.src}
                  alt={current.alt || ""}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
            </div>
            {current.credit ? (
              <p
                className="pointer-events-auto m-0 text-center text-[12px] italic text-white/60"
                onClick={(e) => e.stopPropagation()}
              >
                {current.credit}
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={prev}
          aria-label="Image précédente"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M13 4l-7 6 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={next}
          aria-label="Image suivante"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path d="M7 4l7 6-7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </dialog>
  );
}
