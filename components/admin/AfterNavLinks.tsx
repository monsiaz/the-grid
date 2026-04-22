"use client";

import React from "react";

const RED = "#e63a2e";

const QUICK_LINKS = [
  {
    label: "Site en ligne",
    href: "https://the-grid-sa.vercel.app",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    external: true,
  },
  {
    label: "Actualités",
    href: "https://the-grid-sa.vercel.app/news",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/>
        <path d="M10 2v4"/>
        <path d="M8 10h8"/>
        <path d="M8 14h5"/>
      </svg>
    ),
    external: true,
  },
  {
    label: "Pilotes",
    href: "https://the-grid-sa.vercel.app/drivers",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    external: true,
  },
];

export default function AfterNavLinks() {
  return (
    <div
      style={{
        padding: "16px 10px 8px",
        borderTop: "1px solid #1e1e1e",
        marginTop: "8px",
      }}
    >
      <div
        style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#444",
          padding: "0 10px 10px",
        }}
      >
        Raccourcis
      </div>

      {QUICK_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noreferrer" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "7px 12px",
            borderRadius: "6px",
            color: "#888",
            fontSize: "13px",
            fontWeight: 500,
            textDecoration: "none",
            transition: "background 0.12s, color 0.12s",
            margin: "1px 0",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "#1a1a1a";
            el.style.color = "#f0f0f0";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "transparent";
            el.style.color = "#888";
          }}
        >
          <span style={{ flexShrink: 0, opacity: 0.7 }}>{link.icon}</span>
          <span style={{ flex: 1 }}>{link.label}</span>
          {link.external && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          )}
        </a>
      ))}

      {/* Version tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 12px 4px",
          marginTop: "4px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: RED,
            animation: "none",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "10px",
            color: "#444",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          Production · 2026
        </span>
      </div>
    </div>
  );
}
