"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Magnetic } from "@/components/animate-ui/primitives/effects/magnetic";
import { Shine } from "@/components/animate-ui/primitives/effects/shine";
import { Tilt, TiltContent } from "@/components/animate-ui/primitives/effects/tilt";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { profile } from "@/lib/profile";
import { Container } from "@/components/site";
import { ease } from "@/lib/easing";
import { useFinePointer } from "@/hooks/use-fine-pointer";

const nameLines = ["Zarif Nur", "Aiman."];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const letter = {
  hidden: { opacity: 0, y: "1.1em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const statHrefs = {
  "Bachelor CGPA": "#education",
  "Concurrent projects": "#experience",
  "Test cases logged": "#work",
  "Industry experience": "#experience",
} as const;

export function Hero() {
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const [roleIndex, setRoleIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [photoHot, setPhotoHot] = useState(false);
  const [activeStat, setActiveStat] = useState<string | null>(null);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 20, mass: 0.4 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 20, mass: 0.4 });

  const photoShiftX = useTransform(springX, [0, 1], [-10, 10]);
  const photoShiftY = useTransform(springY, [0, 1], [-8, 8]);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % profile.roles.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

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
    <section id="top" className="relative">
      <Container className="pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-32">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.a
            href="#contact"
            variants={fadeUp}
            className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-line bg-card/70 px-3 py-1.5 text-left text-[11px] leading-4 font-medium text-accent sm:rounded-full sm:text-xs sm:leading-normal"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent opacity-40 motion-safe:animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </motion.a>

          <h1 className="font-display mt-5 text-[2.35rem] leading-[1.08] tracking-tight sm:mt-6 sm:text-6xl md:text-7xl">
            {nameLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                {line.split("").map((char, index) => (
                  <motion.span
                    key={`${line}-${index}`}
                    variants={letter}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.div
            variants={fadeUp}
            className="mt-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="mb-3 text-sm text-muted-foreground">I work across</p>
            <div className="flex flex-wrap gap-2" aria-label="Focus areas">
              {profile.roles.map((role, index) => {
                const selected = index === roleIndex;
                return (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setRoleIndex(index);
                      setPaused(true);
                    }}
                    className="relative min-h-9 rounded-full px-3 py-1.5 text-xs sm:px-3.5 sm:text-sm"
                  >
                    {selected ? (
                      <motion.span
                        layoutId="role-pill"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full border border-line" />
                    )}
                    <span className={`relative z-10 ${selected ? "text-primary-foreground" : "text-muted-foreground"}`}>
                      {role}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            Graduate QA engineer in {profile.location}. I test software, write requirements, and
            help teams ship with fewer surprises.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Magnetic strength={0.28} range={110} onlyOnHover className="w-full sm:w-auto">
              <Button asChild hoverScale={1.05} tapScale={0.96} className="w-full rounded-full px-6 sm:w-auto">
                <a href="#work">See selected work</a>
              </Button>
            </Magnetic>
            <Magnetic strength={0.22} range={100} onlyOnHover className="w-full sm:w-auto">
              <Button variant="outline" asChild hoverScale={1.04} className="w-full rounded-full sm:w-auto">
                <a href="#contact">Get in touch</a>
              </Button>
            </Magnetic>
            <Magnetic strength={0.22} range={100} onlyOnHover className="w-full sm:w-auto">
              <Button variant="outline" asChild hoverScale={1.04} className="w-full rounded-full sm:w-auto">
                <a href={profile.cvHref} target="_blank" rel="noreferrer">
                  {profile.cvLabel}
                </a>
              </Button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          style={reduced || !finePointer ? undefined : { x: photoShiftX, y: photoShiftY }}
          className="relative mx-auto w-full max-w-[17.5rem] overflow-hidden sm:max-w-sm md:max-w-md lg:max-w-none lg:overflow-visible"
        >
          <Magnetic
            strength={0.16}
            range={180}
            onlyOnHover
            className="relative w-full"
            style={{ display: "block" }}
            onMouseEnter={() => setPhotoHot(true)}
            onMouseLeave={() => setPhotoHot(false)}
          >
            <span
              aria-hidden
              className="absolute top-3 left-3 h-full w-full rounded-[1.75rem] bg-primary/90 sm:top-5 sm:left-5"
            />
            <Tilt className="relative" maxTilt={reduced || !finePointer ? 0 : 11}>
              <TiltContent>
                <Shine asChild enableOnHover color="rgba(255,255,255,0.35)" duration={900}>
                  <div className="relative aspect-3/4 overflow-hidden rounded-[1.75rem] bg-muted">
                    <Image
                      src="/zarif.png"
                      alt="Zarif Nur Aiman Bin Khairul Bahri in graduation attire"
                      fill
                      priority
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 280px"
                      className="object-cover object-top transition-transform duration-700"
                      style={{ transform: photoHot && finePointer && !reduced ? "scale(1.04)" : "scale(1)" }}
                    />
                    <AnimatePresence>
                      {photoHot || (finePointer === false) ? (
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-primary/80 to-transparent px-5 pt-16 pb-5"
                        >
                          <p className="text-sm text-primary-foreground">UiTM · ISE · Class of 2026</p>
                          <p className="mt-1 text-xs text-primary-foreground/75">Johor, Malaysia</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </Shine>
              </TiltContent>
            </Tilt>
          </Magnetic>
        </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-3 md:grid-cols-4">
          {profile.stats.map((stat, index) => {
            const hot = activeStat === stat.label;
            return (
              <motion.a
                key={stat.label}
                href={statHrefs[stat.label]}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07, ease }}
                whileHover={reduced ? undefined : { y: -6 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setActiveStat(stat.label)}
                onMouseLeave={() => setActiveStat(null)}
                onFocus={() => setActiveStat(stat.label)}
                onBlur={() => setActiveStat(null)}
                className={`h-full rounded-2xl border bg-card/80 px-3 py-4 text-left transition-colors sm:px-5 sm:py-6 ${
                  hot ? "border-accent shadow-[0_18px_40px_-24px_rgba(44,54,57,0.45)]" : "border-line"
                }`}
              >
                <p className="text-[10px] tracking-wide text-muted-foreground uppercase sm:text-xs">{stat.label}</p>
                <p className="font-display mt-2 inline-flex items-baseline text-2xl tracking-tight sm:text-3xl">
                  <SlidingNumber number={stat.number} decimalPlaces={stat.decimalPlaces} inView />
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <motion.a
            href="#about"
            className="inline-flex flex-col items-center gap-1 text-xs tracking-[0.2em] text-muted-foreground uppercase"
            animate={reduced ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent opacity-40 motion-safe:animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            Scroll down
          </motion.a>
        </div>
      </Container>
    </section>
  );
}
