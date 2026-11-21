"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/profile";

export default function NotFound() {
  const path = usePathname() || "/that-page";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-5 py-20 md:px-10">
      <p className="font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">
        Error 404 · zarep.my
      </p>
      <h1 className="font-display mt-6 text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
        This page{" "}
        <span className="inline-block -rotate-[1.5deg] bg-accent px-[0.12em] text-accent-foreground">kena delete.</span>
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
        Not me this time ok. I think. Either the link salah, or the page never existed in the first place.
      </p>

      <div className="mt-10 max-w-xl overflow-hidden rounded-xl border border-line bg-card">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3 font-mono text-xs text-muted-foreground">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-2">zarep@voyager: ~</span>
        </div>
        <div className="space-y-1 p-5 font-mono text-[13px] leading-6 break-all">
          <p>
            <span className="text-accent">$</span> cd {path}
          </p>
          <p className="text-muted-foreground">bash: cd: {path}: No such file or directory</p>
          <p className="pt-2">
            <span className="text-accent">$</span> whoami
          </p>
          <p className="text-muted-foreground">still {profile.firstName.toLowerCase()}. the page is the one missing, not me.</p>
          <p className="pt-2">
            <span className="text-accent">$</span>{" "}
            <span className="caret-blink inline-block h-4 w-2 translate-y-0.5 bg-accent" aria-hidden />
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-full bg-foreground px-7 font-semibold text-background transition hover:opacity-90"
        >
          cd ~ (back home)
        </Link>
        <Link href="/resume" className="border-b-2 border-accent pb-0.5 font-medium">
          Or the recruiter version
        </Link>
      </div>
    </main>
  );
}
