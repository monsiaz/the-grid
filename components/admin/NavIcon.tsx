"use client";

import React from "react";

/** Icône compacte The Grid pour la sidebar repliée */
export default function AdminNavIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="The Grid"
      role="img"
    >
      {/* Red accent bar */}
      <rect x="0" y="18" width="44" height="8" rx="2" fill="#e63a2e" />
      {/* G letter simplified */}
      <path d="M8 8H36V14H14V30H36V36H8V8Z" fill="white" opacity="0.9" />
      <path d="M24 22H36V30H24V22Z" fill="white" opacity="0.9" />
    </svg>
  );
}
