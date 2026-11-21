import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-10", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-32", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  className,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-3xl md:mb-16", className)}>
      {eyebrow ? (
        <p className="font-mono text-[13px] tracking-wide text-accent uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-display mt-4 text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.04em]">
        {title}
      </h2>
      {copy ? <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{copy}</p> : null}
    </div>
  );
}
