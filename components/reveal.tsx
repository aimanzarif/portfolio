"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/easing";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease }}
    >
      {children}
    </motion.div>
  );
}
