"use client";

/**
 * Custom Field UI component for the DesignSettings global.
 * Mounted via `type: "ui"` field → `admin.components.Field`.
 * Uses useFormFields to read/write the hidden heroCta, stickyHeader,
 * headerMenuStyle, headerMenuTextSize, servicesArrowStyle and sliderSpeed fields.
 */

import { useState } from "react";
import { useField } from "@payloadcms/ui";

/* ─────────────────────────── Toggle ─────────────────────────────── */

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 52,
        height: 28,
        borderRadius: 14,
        border: "1.5px solid",
        borderColor: checked ? "#e5001a" : "rgba(255,255,255,0.18)",
        background: checked
          ? "linear-gradient(90deg,#b50014 0%,#e5001a 100%)"
          : "rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "background 0.25s, border-color 0.25s",
        flexShrink: 0,
        outline: "none",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 4,
          left: checked ? 24 : 4,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: checked ? "#fff" : "rgba(255,255,255,0.55)",
          boxShadow: checked ? "0 2px 8px rgba(229,0,26,0.45)" : "none",
          transition: "left 0.22s cubic-bezier(0.4,0,0.2,1), background 0.22s",
        }}
      />
    </button>
  );
}

/* ─────────────────────────── SpeedSlider ──────────────────────────── */

function SpeedSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 0.1;
  const MAX = 3;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  const presets = [
    { v: 0.1, label: "Très lent" },
    { v: 0.5, label: "Normal" },
    { v: 1.5, label: "Rapide" },
    { v: 3, label: "Ultra" },
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* Track */}
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 20 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            background: "linear-gradient(90deg,#b50014,#e5001a)",
            transition: "width 0.1s",
          }}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            height: 24,
            transform: "translateY(-50%)",
            opacity: 0,
            cursor: "pointer",
            margin: 0,
            padding: 0,
            zIndex: 2,
          }}
        />
        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#e5001a",
            border: "2px solid #fff",
            boxShadow: "0 2px 10px rgba(229,0,26,0.55)",
            pointerEvents: "none",
            transition: "left 0.1s",
            zIndex: 1,
          }}
        />
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {presets.map((p) => {
          const active = Math.abs(value - p.v) < 0.05;
          return (
            <button
              key={p.v}
              type="button"
              onClick={() => onChange(p.v)}
              style={{
                flex: 1,
                padding: "7px 4px",
                borderRadius: 8,
                border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)",
                cursor: "pointer",
                fontSize: 10,
                fontFamily: "var(--font-sans, sans-serif)",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: active ? "#e5001a" : "rgba(255,255,255,0.45)",
                transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Value badge */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{
          display: "inline-block",
          padding: "3px 12px",
          borderRadius: 20,
          background: "rgba(229,0,26,0.1)",
          border: "1px solid rgba(229,0,26,0.3)",
          fontSize: 11,
          fontFamily: "var(--font-mono, monospace)",
          color: "#e5001a",
          letterSpacing: "0.1em",
        }}>
          {value.toFixed(1)} px/frame
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────── Divider ──────────────────────────────── */

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" }} />;
}

/* ─────────────────────────── Main component ────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DesignSettingsUI(_props: any) {
  // useField hooks — each one is bound to the corresponding hidden field in the Payload form.
  // Reading/writing via useField ensures the native Save button sends the correct values.
  const { value: heroCta, setValue: setHeroCta } = useField<string>({ path: "heroCta" });
  const { value: stickyHeader, setValue: setStickyHeader } = useField<boolean>({ path: "stickyHeader" });
  const { value: headerMenuStyle, setValue: setHeaderMenuStyle } = useField<string>({ path: "headerMenuStyle" });
  const { value: headerMenuTextSize, setValue: setHeaderMenuTextSize } = useField<string>({ path: "headerMenuTextSize" });
  const { value: heroTextBackdropOpacity, setValue: setHeroTextBackdropOpacityRaw } = useField<number>({ path: "heroTextBackdropOpacity" });
  const { value: heroTextBackdropBlur, setValue: setHeroTextBackdropBlurRaw } = useField<number>({ path: "heroTextBackdropBlur" });
  const { value: servicesArrowStyle, setValue: setServicesArrowStyle } = useField<string>({ path: "servicesArrowStyle" });
  const { value: sliderSpeed, setValue: setSliderSpeed } = useField<number>({ path: "sliderSpeed" });
  // New fields
  const { value: accentColor, setValue: setAccentColor } = useField<string>({ path: "accentColor" });
  const { value: parallaxIntensity, setValue: setParallaxIntensityRaw } = useField<number>({ path: "parallaxIntensity" });
  const { value: cardHoverStyle, setValue: setCardHoverStyle } = useField<string>({ path: "cardHoverStyle" });
  const { value: cardBorderRadius, setValue: setCardBorderRadius } = useField<string>({ path: "cardBorderRadius" });
  const { value: sectionSpacing, setValue: setSectionSpacing } = useField<string>({ path: "sectionSpacing" });
  const { value: heroGradientIntensity, setValue: setHeroGradientIntensityRaw } = useField<number>({ path: "heroGradientIntensity" });
  const { value: heroTitleSize, setValue: setHeroTitleSize } = useField<string>({ path: "heroTitleSize" });
  const { value: globalFont, setValue: setGlobalFont } = useField<string>({ path: "globalFont" });

  const [saved, setSaved] = useState(false);

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  // Safe derived values with fallbacks
  const heroCtaVal = heroCta ?? "large";
  const stickyHeaderVal = stickyHeader ?? false;
  const headerMenuStyleVal = headerMenuStyle ?? "default";
  const headerMenuTextSizeVal = headerMenuTextSize ?? "large";
  const heroTextBackdropOpacityVal = heroTextBackdropOpacity ?? 1;
  const heroTextBackdropBlurVal = heroTextBackdropBlur ?? 56;
  const servicesArrowStyleVal = servicesArrowStyle ?? "default";
  const sliderSpeedVal = sliderSpeed ?? 0.5;
  const accentColorVal = accentColor ?? "red";
  const parallaxIntensityVal = parallaxIntensity ?? 15;
  const cardHoverStyleVal = cardHoverStyle ?? "zoom";
  const cardBorderRadiusVal = cardBorderRadius ?? "default";
  const sectionSpacingVal = sectionSpacing ?? "normal";
  const heroGradientIntensityVal = heroGradientIntensity ?? 1;
  const heroTitleSizeVal = heroTitleSize ?? "normal";
  const globalFontVal = globalFont ?? "spartan";

  const setParallaxIntensity = (v: number) => setParallaxIntensityRaw(Math.round(Math.min(30, Math.max(0, v))));
  const setHeroGradientIntensity = (v: number) => setHeroGradientIntensityRaw(Number(Math.min(2, Math.max(0, v)).toFixed(2)));

  const setHeroTextBackdropOpacity = (v: number) => {
    setHeroTextBackdropOpacityRaw(Number(Math.min(1.35, Math.max(0.5, v)).toFixed(2)));
  };
  const setHeroTextBackdropBlur = (v: number) => {
    setHeroTextBackdropBlurRaw(Math.round(Math.min(90, Math.max(24, v))));
  };

  return (
    <div style={{ padding: "8px 0 32px" }}>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(229,0,26,0.05) 0%, rgba(20,20,20,0.8) 100%)",
          border: "1px solid rgba(229,0,26,0.18)",
          borderRadius: 18,
          padding: "32px 36px",
          position: "relative",
          overflow: "hidden",
          maxWidth: 680,
        }}
      >
        {/* Left accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 4, height: "100%",
          background: "linear-gradient(180deg,#e5001a,#7a0010)",
          borderRadius: "18px 0 0 18px",
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, paddingLeft: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/>
              <line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/>
              <line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/>
              <line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/>
              <line x1="17" x2="23" y1="16" y2="16"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", fontFamily: "var(--font-sans, sans-serif)" }}>
              Personnalisation
            </span>
          </div>
          {saved && (
            <span style={{ fontSize: 11, color: "#4ade80", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.08em" }}>
              ✓ Modifié — Cliquez Save pour sauvegarder
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingLeft: 10 }}>

          {/* ── 1. Hero CTA ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-5"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Bouton Hero (CTA scroll)
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Apparence du bouton de scroll sur toutes les pages hero (About, Services, Drivers…).
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "large", label: "Large", desc: "Cercle plein" },
                { value: "slim", label: "Slim", desc: "Pill discret" },
              ].map((opt) => {
                const active = heroCtaVal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setHeroCta(opt.value); flash(); }}
                    style={{
                      flex: 1,
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)",
                      background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 2. Sticky Header ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="4" rx="1"/><path d="M3 11h18M3 17h18"/>
                </svg>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                  Menu Sticky
                </span>
                <span style={{
                  fontSize: 9, padding: "2px 7px", borderRadius: 4,
                  background: stickyHeaderVal ? "rgba(229,0,26,0.15)" : "rgba(255,255,255,0.07)",
                  color: stickyHeaderVal ? "#e5001a" : "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  fontFamily: "var(--font-mono, monospace)",
                  border: stickyHeaderVal ? "1px solid rgba(229,0,26,0.3)" : "1px solid transparent",
                }}>
                  {stickyHeaderVal ? "ON" : "OFF"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
                Le menu reste visible et suit le scroll avec un effet glassmorphism.
              </p>
            </div>
            <Toggle checked={stickyHeaderVal} onChange={(v) => { setStickyHeader(v); flash(); }} id="toggle-sticky-header" />
          </div>

          <Divider />

          <Divider />

          {/* ── 3. Header menu style ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="8" />
                <path d="M8 12h8" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Style du menu
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Variante visuelle du header (fonctionne avec sticky OFF ou ON).
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "default", label: "Classique", desc: "Style actuel prod", icon: "─" },
                { value: "liquid", label: "Liquid Glass", desc: "Bulle entourée + flou", icon: "◌" },
              ].map((opt) => {
                const active = headerMenuStyleVal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setHeaderMenuStyle(opt.value); flash(); }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)",
                      background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>
                      {opt.icon}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 4. Header menu text size ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7h16M7 12h10M9 17h6" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Taille texte menu
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Lisibilité des titres du menu desktop/mobile.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "regular", label: "Normal", desc: "Plus discret" },
                { value: "large", label: "Plus visible", desc: "Recommandé" },
              ].map((opt) => {
                const active = headerMenuTextSizeVal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setHeaderMenuTextSize(opt.value); flash(); }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)",
                      background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 5. Hero text backdrop controls ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="12" rx="9" ry="5" />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Ombre texte hero
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Ajuste la lisibilité du texte sans trop assombrir les images de fond.
            </p>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Opacité</span>
                  <span style={{ fontSize: 11, color: "#e5001a", fontFamily: "var(--font-mono, monospace)" }}>{heroTextBackdropOpacityVal.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={1.35}
                  step={0.01}
                  value={heroTextBackdropOpacityVal}
                  onChange={(e) => setHeroTextBackdropOpacity(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Flou</span>
                  <span style={{ fontSize: 11, color: "#e5001a", fontFamily: "var(--font-mono, monospace)" }}>{Math.round(heroTextBackdropBlurVal)} px</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={90}
                  step={1}
                  value={heroTextBackdropBlurVal}
                  onChange={(e) => setHeroTextBackdropBlur(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* ── 6. Services cards arrow style ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 6 6 6-6 6"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Bouton cards Services
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Style de la flèche sur les cartes Value/Talent. Défaut = rendu actuel en production.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { value: "default", label: "Classique", desc: "Style actuel prod", icon: "○ →" },
                { value: "slim", label: "Slim", desc: "Plus aplati", icon: "⬭ ⟶" },
              ].map((opt) => {
                const active = servicesArrowStyleVal === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setServicesArrowStyle(opt.value); flash(); }}
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)",
                      background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>
                      {opt.icon}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "var(--font-sans, sans-serif)" }}>
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 7. Slider Speed ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Vitesse du slider Case Studies
              </span>
            </div>
            <p style={{ margin: "0 0 18px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Vitesse de défilement automatique (px/frame). Lent = 0.1 · Normal = 0.5 · Ultra = 3.
            </p>
            <SpeedSlider value={sliderSpeedVal} onChange={setSliderSpeed} />
          </div>

          <Divider />

          {/* ── 8. Accent Color ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Couleur accent
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Couleur des boutons, tags, flèches et liens actifs sur tout le site.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { value: "red", label: "Rouge", hex: "#b6483f" },
                { value: "white", label: "Blanc", hex: "#f0f0f0" },
                { value: "gold", label: "Or", hex: "#c9a84c" },
                { value: "navy", label: "Bleu", hex: "#2b4a8a" },
              ].map((opt) => {
                const active = accentColorVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setAccentColor(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? `2px solid ${opt.hex}` : "1.5px solid rgba(255,255,255,0.1)", background: active ? `${opt.hex}18` : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: opt.hex, margin: "0 auto 6px", border: active ? `2px solid ${opt.hex}` : "1.5px solid rgba(255,255,255,0.15)", boxShadow: active ? `0 0 12px ${opt.hex}88` : "none" }} />
                    <div style={{ fontSize: 10, fontWeight: 700, color: active ? opt.hex : "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 9. Parallax Intensity ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6l9-3 9 3M3 18l9 3 9-3"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Intensité du parallax hero
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Amplitude du défilement de l&apos;image au scroll. 0 = désactivé · 15 = normal · 30 = fort.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: 0, label: "OFF" }, { v: 8, label: "Subtil" }, { v: 15, label: "Normal" }, { v: 30, label: "Fort" }].map(p => {
                const active = parallaxIntensityVal === p.v;
                return (
                  <button key={p.v} type="button" onClick={() => { setParallaxIntensity(p.v); flash(); }}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: active ? "#e5001a" : "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans, sans-serif)", transition: "all 0.2s" }}
                  >{p.label}</button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 10. Hero Gradient Intensity ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Intensité gradient hero
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Assombrit ou éclaircit le fond des sections hero.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: 0, label: "Minimal" }, { v: 0.5, label: "Léger" }, { v: 1, label: "Normal" }, { v: 1.5, label: "Fort" }, { v: 2, label: "Max" }].map(p => {
                const active = Math.abs(heroGradientIntensityVal - p.v) < 0.05;
                return (
                  <button key={p.v} type="button" onClick={() => { setHeroGradientIntensity(p.v); flash(); }}
                    style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: active ? "#e5001a" : "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans, sans-serif)", transition: "all 0.2s" }}
                  >{p.label}</button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 11. Hero Title Size ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Taille titre hero
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Taille des titres H1 sur toutes les pages hero.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ value: "normal", label: "Normal", desc: "44–96px" }, { value: "large", label: "Large", desc: "52–116px" }, { value: "xl", label: "XL", desc: "60–140px" }].map(opt => {
                const active = heroTitleSizeVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setHeroTitleSize(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "var(--font-mono, monospace)" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 12. Card Hover Style ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Hover cards news
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Effet au survol des cards actualités.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ value: "zoom", label: "Zoom", desc: "Photo s'agrandit" }, { value: "lift", label: "Lift", desc: "Card se lève" }, { value: "flat", label: "Flat", desc: "Aucun effet" }].map(opt => {
                const active = cardHoverStyleVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setCardHoverStyle(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "var(--font-sans, sans-serif)" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 13. Card Border Radius ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="6"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Coins des cards
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Arrondi des coins pour toutes les cards du site.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ value: "sharp", label: "Droit", desc: "6px", radius: 4 }, { value: "default", label: "Arrondi", desc: "22px (défaut)", radius: 10 }, { value: "round", label: "Très arrondi", desc: "36px", radius: 16 }].map(opt => {
                const active = cardBorderRadiusVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setCardBorderRadius(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ width: 28, height: 18, borderRadius: opt.radius, border: active ? "2px solid #e5001a" : "1.5px solid rgba(255,255,255,0.35)", margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>{opt.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, fontFamily: "var(--font-mono, monospace)" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 14. Section Spacing ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="12" y1="6" x2="12" y2="18"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Espacement sections
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Densité verticale entre les sections du site.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ value: "compact", label: "Compact", desc: "48px" }, { value: "normal", label: "Normal", desc: "80px (défaut)" }, { value: "spacious", label: "Aéré", desc: "128px" }].map(opt => {
                const active = sectionSpacingVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setSectionSpacing(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-sans, sans-serif)" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "var(--font-mono, monospace)" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ── 15. Global Font ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans, sans-serif)" }}>
                Police globale
              </span>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans, sans-serif)", lineHeight: 1.6 }}>
              Police utilisée pour les titres et le corps du texte.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ value: "spartan", label: "Spartan", desc: "Défaut" }, { value: "inter", label: "Inter", desc: "Moderne" }, { value: "syne", label: "Syne", desc: "Géométrique" }].map(opt => {
                const active = globalFontVal === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => { setGlobalFont(opt.value); flash(); }}
                    style={{ flex: 1, padding: "12px 8px", borderRadius: 12, border: active ? "1.5px solid #e5001a" : "1.5px solid rgba(255,255,255,0.1)", background: active ? "rgba(229,0,26,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: active ? "#e5001a" : "rgba(255,255,255,0.7)", fontFamily: opt.value === "inter" ? "var(--font-inter, sans-serif)" : opt.value === "syne" ? "var(--font-syne, sans-serif)" : "var(--font-league-spartan, sans-serif)", letterSpacing: opt.value === "spartan" ? "0.08em" : "0.02em", textTransform: "uppercase" }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "var(--font-sans, sans-serif)" }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
