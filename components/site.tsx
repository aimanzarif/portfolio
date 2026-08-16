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
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-8", className)}>
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
    <section id={id} className={cn("py-16 sm:py-20 md:py-32", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mb-8 max-w-2xl md:mb-16">
      <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">{eyebrow}</p>
      <h2 className="font-display mt-3 text-[1.75rem] leading-tight tracking-tight sm:text-3xl md:text-5xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">{copy}</p>
      ) : null}
    </div>
  );
}
