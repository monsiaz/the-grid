"use client";

import { motion, AnimatePresence, useScroll, useTransform, type Variants } from "framer-motion";

// ── F1-inspired animation variants ──────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const heroDescription: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6, transition: { duration: 0.3, ease: "easeOut" } },
};

export const imageHover = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.4, ease: "easeOut" } },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } },
};

export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, originX: 0 },
};

// ── Default viewport / transition config ────────────────────────────

export const viewport = { once: true, margin: "-80px" as const };

export const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

export const smoothTransition = {
  duration: 0.7,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

export const fastTransition = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

// Re-export motion for convenience
export { motion, AnimatePresence, useScroll, useTransform };
