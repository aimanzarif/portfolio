import { type ReactNode } from "react";
import { SplitText } from "@/components/motion-bits";
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
    <section id={id} className={cn("py-10 md:py-14", className)}>
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
    <div className={cn("mb-8 max-w-3xl md:mb-12", className)}>
      {eyebrow ? (
        <p className="font-mono text-[13px] tracking-wide text-accent uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="font-display mt-3 text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.92] font-extrabold tracking-[-0.04em]">
        <SplitText text={title} />
      </h2>
      {copy ? <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{copy}</p> : null}
    </div>
  );
}
