"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useFinePointer } from "@/hooks/use-fine-pointer";

export function PointerBackground() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 20, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 20, mass: 0.4 });

  const orbOneX = useTransform(springX, [0, 1], [-50, 70]);
  const orbOneY = useTransform(springY, [0, 1], [-30, 50]);
  const orbTwoX = useTransform(springX, [0, 1], [40, -60]);
  const orbTwoY = useTransform(springY, [0, 1], [30, -40]);
  const orbThreeX = useTransform(springX, [0, 1], [-30, 40]);
  const orbThreeY = useTransform(springY, [0, 1], [20, -30]);
  const spotlightX = useTransform(springX, (value) => `${value * 100}%`);
  const spotlightY = useTransform(springY, (value) => `${value * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(640px circle at ${spotlightX} ${spotlightY}, rgba(162, 123, 92, 0.18), transparent 55%)`;

  useEffect(() => {
    if (reduced || !finePointer) return;
    const onMove = (event: MouseEvent) => {
      pointerX.set(event.clientX / window.innerWidth);
      pointerY.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [pointerX, pointerY, reduced, finePointer]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <motion.div
        className="absolute -top-24 right-[-8%] h-64 w-64 rounded-full bg-accent/20 blur-3xl sm:h-120 sm:w-120"
        style={reduced ? undefined : { x: orbOneX, y: orbOneY }}
      />
      <motion.div
        className="absolute top-1/3 -left-24 h-52 w-52 rounded-full bg-primary/12 blur-3xl sm:h-88 sm:w-88"
        style={reduced ? undefined : { x: orbTwoX, y: orbTwoY }}
      />
      <motion.div
        className="absolute -bottom-32 right-1/4 hidden h-96 w-96 rounded-full bg-accent/12 blur-3xl sm:block"
        style={reduced ? undefined : { x: orbThreeX, y: orbThreeY }}
      />
    </div>
  );
}
