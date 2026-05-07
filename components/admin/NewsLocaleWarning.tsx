"use client";

import React from "react";
import { useLocale } from "@payloadcms/ui";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  de: "Deutsch",
  nl: "Nederlands",
  zh: "中文",
};

export default function NewsLocaleWarning() {
  const locale = useLocale();
  const code = (locale as { code?: string } | null)?.code ?? "en";
  if (code === "en") return null;
  const label = LOCALE_LABELS[code] ?? code.toUpperCase();
  return (
    <div
      role="note"
      style={{
        margin: "0 0 12px 0",
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(234, 179, 8, 0.12)",
        border: "1px solid rgba(234, 179, 8, 0.45)",
        color: "#facc15",
        fontSize: 13,
        lineHeight: 1.45,
      }}
    >
      ⚠️ Vous éditez en <strong>{label}</strong>. Les nouveaux articles doivent
      être créés en <strong>English</strong> pour être traduits automatiquement
      dans toutes les langues. Toute modification ici verrouille la version{" "}
      {label} contre la prochaine retraduction automatique.
    </div>
  );
}
