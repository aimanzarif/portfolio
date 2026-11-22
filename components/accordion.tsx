"use client";

import { type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * A small single-open accordion (replaces the Radix one): one item open at a time, click the
 * open one to close it. Buttons carry aria-expanded/aria-controls; Up/Down/Home/End move between
 * the triggers like the WAI-ARIA accordion pattern.
 */

export type AccordionItem = { id: string; trigger: ReactNode; content: ReactNode };

export function Accordion({
  items,
  defaultOpen = null,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}: {
  items: AccordionItem[];
  defaultOpen?: string | null;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen);
  const reduced = useReducedMotion();
  const base = useId();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const group = event.currentTarget.closest("[data-accordion]");
    const triggers = [...(group?.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]") ?? [])];
    const at = triggers.indexOf(event.currentTarget);
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? triggers.length - 1 : (at + (event.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
    event.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <div data-accordion className={cn("w-full", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        const buttonId = `${base}-${item.id}-button`;
        const panelId = `${base}-${item.id}-panel`;
        return (
          <div key={item.id} className={cn("border-b last:border-b-0", itemClassName)}>
            <h3 className="flex">
              <button
                type="button"
                id={buttonId}
                data-accordion-trigger
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
                onKeyDown={onKeyDown}
                className={cn(
                  "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  triggerClassName,
                )}
              >
                {item.trigger}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className={cn(
                    "pointer-events-none size-4 shrink-0 translate-y-0.5 fill-none stroke-current stroke-2 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 22 }}
                  className="overflow-hidden"
                >
                  <div className={cn("pt-0 pb-4 text-sm", contentClassName)}>{item.content}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
