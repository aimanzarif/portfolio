import Link from "next/link";
import { cn } from "@/lib/utils";

/** Two-way switch between the playful home page and the plain recruiter résumé. */
export function ModeToggle({ mode, className }: { mode: "fun" | "hr"; className?: string }) {
  const item = (active: boolean) =>
    cn(
      "inline-flex min-h-9 items-center rounded-full px-3 font-mono text-[12px] font-bold whitespace-nowrap transition-colors",
      active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
    );

  return (
    <div
      role="group"
      aria-label="Page style"
      className={cn("items-center gap-0.5 rounded-full border border-line p-0.5", className)}
    >
      <Link href="/" aria-current={mode === "fun" ? "page" : undefined} className={item(mode === "fun")}>
        FUN
      </Link>
      <Link href="/resume" aria-current={mode === "hr" ? "page" : undefined} className={item(mode === "hr")}>
        RECRUITER
      </Link>
    </div>
  );
}
