"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps the Header with a sticky glassmorphism effect when stickyHeader = true.
 * When false, renders children as-is (original behaviour).
 */
export default function StickyHeaderWrapper({
  sticky,
  children,
}: {
  sticky: boolean;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    if (!sticky) return;
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sticky]);

  if (!sticky) return <>{children}</>;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        // Glassmorphism that intensifies after scroll
        background: scrolled
          ? "rgba(10,10,10,0.82)"
          : "rgba(10,10,10,0.0)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 4px 32px rgba(0,0,0,0.45)"
          : "none",
        transition:
          "background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      {children}
    </div>
  );
}
