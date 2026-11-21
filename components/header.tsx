"use client";

import { useEffect, useRef, useState } from "react";
import { findEgg } from "@/lib/eggs";
import { motion } from "motion/react";
import { KlangClock } from "@/components/klang-clock";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, profile } from "@/lib/profile";
import { Container } from "@/components/site";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = ["top", "work", "helpdesk", "homelab", "experience", "contact"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useActiveSection(SECTION_IDS);
  const presses = useRef<number[]>([]);
  const currentPath = navItems.find((item) => item.href === `#${active}`)?.path ?? (active === "contact" ? "contact" : "");

  const pressPower = () => {
    const now = Date.now();
    presses.current = [...presses.current.filter((t) => now - t < 2000), now];
    if (presses.current.length >= 5) {
      presses.current = [];
      findEgg("power");
    }
  };

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
    const media = window.matchMedia("(min-width: 1024px)");
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
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <a href="#work" className="skip-link">
        Skip to content
      </a>
      <Container>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={pressPower}
              aria-label="Power LED"
              className="-ml-3 inline-flex size-11 items-center justify-center rounded-full"
            >
              <span className="led size-2.5 rounded-full bg-accent" aria-hidden />
            </button>
            <a href="#top" className="flex items-baseline font-mono text-[17px] whitespace-nowrap" aria-label="zarep.my, back to top">
              <span className="font-bold">zarep.my</span>
              <span className="ml-2 hidden text-accent sm:inline" aria-hidden>
                ~{currentPath ? `/${currentPath}` : ""}
              </span>
              <span className="hidden text-muted-foreground sm:inline" aria-hidden>
                $
              </span>
              <span
                className="caret-blink ml-1 hidden h-[1em] w-[0.55em] translate-y-[0.15em] self-center bg-accent sm:inline-block"
                aria-hidden
              />
            </a>
          </div>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3 py-1.5 font-mono text-[14px] whitespace-nowrap transition-colors ${
                    isActive ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">
                    <span className={isActive ? "" : "text-accent"}>./</span>
                    {item.path}
                  </span>
                </a>
              );
            })}
          </nav>
          <div className="flex items-center justify-end gap-2">
            <KlangClock className="hidden xl:flex" compact />
            <ModeToggle mode="fun" className="hidden xl:flex" />
            <ThemeToggle />
            <a
              href="#contact"
              className="group hidden min-h-11 items-center gap-1.5 rounded-full bg-accent px-5 whitespace-nowrap text-[15px] font-semibold text-accent-foreground transition hover:-rotate-2 lg:inline-flex"
            >
              Say hai
              <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center lg:hidden"
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
          <nav
            className="flex max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto border-t border-line py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3.5 font-mono text-lg text-muted-foreground"
              >
                <span className="text-accent">./</span>
                {item.path}
              </a>
            ))}
            <a
              href={profile.cvHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="py-3.5 text-lg text-muted-foreground"
            >
              {profile.cvLabel}
            </a>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
            >
              Say hai →
            </a>
            <ModeToggle mode="fun" className="mt-3 flex self-start" />
            <KlangClock className="mt-3 mb-3 flex self-start" />
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
