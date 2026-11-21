"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Runtime errors inside a page. The header-less layout keeps it working even if a section crashed. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-5 py-20 md:px-10">
      <p className="font-mono text-[13px] tracking-[0.06em] text-muted-foreground uppercase">
        Error 500 · zarep.my
      </p>
      <h1 className="font-display mt-6 text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.045em]">
        Something{" "}
        <span className="inline-block -rotate-[1.5deg] bg-destructive px-[0.12em] text-background">rosak.</span>
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground md:text-xl">
        A bit of this page crashed. Not your fault, confirm mine. Try again, usually it settles itself.
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
            <span className="text-accent">$</span> journalctl -u portfolio -n 1
          </p>
          <p className="text-destructive">error: unhandled exception while rendering</p>
          {error.digest ? <p className="text-muted-foreground">ref: {error.digest} (send me this if it keeps happening)</p> : null}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-12 items-center rounded-full bg-foreground px-7 font-semibold text-background transition hover:opacity-90"
        >
          Cuba lagi (try again)
        </button>
        <Link href="/" className="border-b-2 border-accent pb-0.5 font-medium">
          cd ~ (back home)
        </Link>
        <a href="mailto:zarif@zarep.my?subject=Your%20site%20rosak" className="font-mono text-sm text-muted-foreground underline underline-offset-4">
          report it
        </a>
      </div>
    </main>
  );
}
