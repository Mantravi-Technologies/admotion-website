"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

const MAGNETIC_STRENGTH = 0.35;
const SPRING = { type: "spring" as const, stiffness: 150, damping: 15 };

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  as?: "a" | "button";
}

/**
 * Button that is slightly pulled toward the cursor on hover (magnetic effect).
 */
export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  as = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * MAGNETIC_STRENGTH;
    const deltaY = (e.clientY - centerY) * MAGNETIC_STRENGTH;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const content = (
    <motion.span
      ref={ref}
      className="inline-block"
      animate={position}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  );

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500";

  if (as === "a" && href) {
    return (
      <a href={href} className={`${baseClass} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} ${className}`}
    >
      {content}
    </button>
  );
}
