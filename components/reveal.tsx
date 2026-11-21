"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/easing";

export function Reveal({
  children,
  className = "",
  delay = 0,
  tilt = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  tilt?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={tilt ? { opacity: 0, y: 80, rotate: -3, scale: 0.96 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={
        tilt
          ? { type: "spring", stiffness: 120, damping: 16, delay: delay / 1000 }
          : { duration: 0.7, delay: delay / 1000, ease }
      }
    >
      {children}
    </motion.div>
  );
}
