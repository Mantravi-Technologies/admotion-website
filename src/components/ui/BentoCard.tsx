"use client";

import { motion } from "framer-motion";

type Accent = "magenta" | "cyan" | "yellow";

const ACCENT_STYLES: Record<Accent, string> = {
  magenta:
    "border-magenta/50 hover:border-magenta hover:shadow-[0_0_30px_rgba(224,26,79,0.2)]",
  cyan:
    "border-cyan/50 hover:border-cyan hover:shadow-[0_0_30px_rgba(0,180,216,0.2)]",
  yellow:
    "border-yellow/50 hover:border-yellow hover:shadow-[0_0_30px_rgba(255,209,102,0.2)]",
};

interface BentoCardProps {
  title: string;
  description: string;
  accent: Accent;
}

/**
 * Bento grid card with hover scale and accent glow.
 */
export function BentoCard({ title, description, accent }: BentoCardProps) {
  return (
    <motion.article
      className={`group relative overflow-hidden rounded-2xl border-2 bg-surface p-4 transition-colors sm:p-6 ${ACCENT_STYLES[accent]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <h3 className="font-heading text-lg font-semibold text-white sm:text-xl" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-text-muted sm:mt-2 sm:text-base">{description}</p>
    </motion.article>
  );
}
