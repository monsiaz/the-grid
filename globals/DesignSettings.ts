import type { GlobalConfig } from "payload";
import { revalidateAll } from "@/lib/revalidate";

export const DesignSettings: GlobalConfig = {
  slug: "design-settings",
  label: "Custom Design",
  admin: {
    group: "Paramètres",
    description: "Personnalisation visuelle complète : couleurs, typographie, animations, cartes, espacements.",
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    // Custom UI rendered in the form body via a `ui` field — no native field widgets shown.
    {
      name: "designUI",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/DesignSettingsUI#default",
        },
      },
    },
    // Hidden data fields — read/written by DesignSettingsUI via useFormFields.
    {
      name: "heroCta",
      type: "select",
      defaultValue: "large",
      options: [
        { label: "Large (cercle plein)", value: "large" },
        { label: "Slim (pill discret)", value: "slim" },
      ],
      admin: { hidden: true },
    },
    {
      name: "stickyHeader",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true },
    },
    {
      name: "headerMenuStyle",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Classique (prod)", value: "default" },
        { label: "Liquid Glass", value: "liquid" },
      ],
      admin: { hidden: true },
    },
    {
      name: "headerMenuTextSize",
      type: "select",
      defaultValue: "large",
      options: [
        { label: "Normal", value: "regular" },
        { label: "Plus visible", value: "large" },
      ],
      admin: { hidden: true },
    },
    {
      name: "heroTextBackdropOpacity",
      type: "number",
      defaultValue: 1,
      min: 0.5,
      max: 1.35,
      admin: { hidden: true },
    },
    {
      name: "heroTextBackdropBlur",
      type: "number",
      defaultValue: 56,
      min: 24,
      max: 90,
      admin: { hidden: true },
    },
    {
      name: "servicesArrowStyle",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Classique (prod)", value: "default" },
        { label: "Slim (aplati)", value: "slim" },
      ],
      admin: { hidden: true },
    },
    {
      name: "sliderSpeed",
      type: "number",
      defaultValue: 0.5,
      min: 0.1,
      max: 3,
      admin: { hidden: true },
    },
    // ── New settings ──────────────────────────────────────────────────
    {
      name: "accentColor",
      type: "select",
      defaultValue: "red",
      options: [
        { label: "Rouge (défaut)", value: "red" },
        { label: "Blanc", value: "white" },
        { label: "Or", value: "gold" },
        { label: "Bleu nuit", value: "navy" },
      ],
      admin: { hidden: true },
    },
    {
      name: "parallaxIntensity",
      type: "number",
      defaultValue: 15,
      min: 0,
      max: 30,
      admin: { hidden: true },
    },
    {
      name: "cardHoverStyle",
      type: "select",
      defaultValue: "zoom",
      options: [
        { label: "Zoom (défaut)", value: "zoom" },
        { label: "Lift (translation)", value: "lift" },
        { label: "Flat (aucun)", value: "flat" },
      ],
      admin: { hidden: true },
    },
    {
      name: "cardBorderRadius",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Arrondi (défaut 22px)", value: "default" },
        { label: "Droit (6px)", value: "sharp" },
        { label: "Très arrondi (36px)", value: "round" },
      ],
      admin: { hidden: true },
    },
    {
      name: "sectionSpacing",
      type: "select",
      defaultValue: "normal",
      options: [
        { label: "Compact", value: "compact" },
        { label: "Normal (défaut)", value: "normal" },
        { label: "Aéré", value: "spacious" },
      ],
      admin: { hidden: true },
    },
    {
      name: "heroGradientIntensity",
      type: "number",
      defaultValue: 1,
      min: 0,
      max: 2,
      admin: { hidden: true },
    },
    {
      name: "heroTitleSize",
      type: "select",
      defaultValue: "normal",
      options: [
        { label: "Normal (défaut)", value: "normal" },
        { label: "Large", value: "large" },
        { label: "XL", value: "xl" },
      ],
      admin: { hidden: true },
    },
    {
      name: "globalFont",
      type: "select",
      defaultValue: "spartan",
      options: [
        { label: "League Spartan (défaut)", value: "spartan" },
        { label: "Inter (moderne)", value: "inter" },
        { label: "Syne (géométrique)", value: "syne" },
      ],
      admin: { hidden: true },
    },
  ],
  hooks: {
    afterChange: [() => revalidateAll()],
  },
};
