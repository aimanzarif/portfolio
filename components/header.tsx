"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Magnetic } from "@/components/animate-ui/primitives/effects/magnetic";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, profile } from "@/lib/profile";
import { Container } from "@/components/site";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = ["about", "experience", "work", "skills", "education", "contact"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 10);
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background,box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-b border-line bg-background/80 shadow-[0_8px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-3.5">
        <a href="#top" className="font-display text-lg tracking-tight">
          Zarif
        </a>
        <nav className="relative hidden items-center md:flex">
          {navItems.map((item) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-[13px] transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/8"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic strength={0.25} range={80} className="hidden md:block">
            <Button size="sm" variant="outline" asChild hoverScale={1.04} className="rounded-full">
              <a href={profile.cvHref} target="_blank" rel="noreferrer">
                {profile.cvLabel}
              </a>
            </Button>
          </Magnetic>
          <Magnetic strength={0.25} range={80} className="hidden md:block">
            <Button size="sm" asChild hoverScale={1.04} className="rounded-full">
              <a href="#contact">Let’s talk</a>
            </Button>
          </Magnetic>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`h-px w-5 bg-foreground transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-foreground transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
        </div>
        {open ? (
          <nav className="flex max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto border-t border-line py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-base text-muted-foreground"
              >
                {item.label}
              </a>
            ))}
            <Button variant="outline" asChild hoverScale={1.02} className="mt-2 w-full rounded-full">
              <a href={profile.cvHref} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                {profile.cvLabel}
              </a>
            </Button>
            <Button asChild hoverScale={1.02} className="mb-3 w-full rounded-full">
              <a href="#contact" onClick={() => setOpen(false)}>
                Let’s talk
              </a>
            </Button>
          </nav>
        ) : null}
      </Container>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
        style={{ scaleX: progress }}
      />
    </header>
  );
}
