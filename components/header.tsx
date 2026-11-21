"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
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
      className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-background/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3 font-mono text-[17px] font-bold">
            <span className="led size-2.5 rounded-full bg-accent" aria-hidden />
            zarep.my
          </a>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navItems.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`px-3.5 py-2 text-[15px] transition-colors ${
                    isActive ? "text-foreground underline decoration-accent decoration-2 underline-offset-8" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden min-h-11 items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-accent-foreground transition hover:opacity-90 md:inline-flex"
            >
              Email me
            </a>
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
          <nav
            className="flex max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto border-t border-line py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
            aria-label="Mobile"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3.5 text-lg text-muted-foreground"
              >
                {item.label}
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
              className="mt-2 mb-3 inline-flex min-h-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground"
            >
              Email me
            </a>
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
