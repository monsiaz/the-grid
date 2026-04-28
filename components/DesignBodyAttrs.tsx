"use client";
/**
 * Applies design-settings data attributes to <body> for CSS-driven overrides.
 * Must be a client component since it mutates the DOM.
 */
import { useEffect } from "react";

export default function DesignBodyAttrs({
  cardHoverStyle,
}: {
  cardHoverStyle: "zoom" | "lift" | "flat";
}) {
  useEffect(() => {
    document.body.setAttribute("data-card-hover", cardHoverStyle);
    return () => {
      document.body.removeAttribute("data-card-hover");
    };
  }, [cardHoverStyle]);

  return null;
}
