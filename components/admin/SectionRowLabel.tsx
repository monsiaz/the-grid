"use client";

import { useRowLabel } from "@payloadcms/ui";

/** Maps camelCase / snake_case section IDs to human-readable labels. */
const LABELS: Record<string, string> = {
  hero: "🎬 Hero",
  about: "📝 About",
  coreTeam: "👥 Core team",
  accelere: "🚀 Accélère – Côme",
  quote: "💬 Quote",
  partners: "🤝 Partners",
  grid: "🏎 Drivers grid",
  value: "💼 Commercial value grid",
  caseStudies: "📊 Case studies",
  talent: "⚡ Talent grid",
  partner: "🤝 Hintsa partnership",
  contact: "✉️ Contact / Forms",
  news: "📰 News",
  services: "🛠 Services",
  stats: "📈 Stats",
  timeline: "📅 Timeline",
  faq: "❓ FAQ",
};

function prettify(value: string): string {
  if (LABELS[value]) return LABELS[value];
  // Fallback: split camelCase and capitalise
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export default function SectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ sectionId?: string }>();
  const id = data?.sectionId;
  const label = id ? prettify(id) : `Section ${(rowNumber ?? 0) + 1}`;
  return (
    <span style={{ fontWeight: 600, fontSize: 13 }}>
      {label}
    </span>
  );
}
