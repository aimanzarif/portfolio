"use client";

import { useGaji } from "@/lib/gaji";
import { cn } from "@/lib/utils";

/** The boarding-pass stamp and gate, which the Konami "gaji masuk" cheat approves. */
export function TravelStamp() {
  const paid = useGaji();
  return (
    <span
      key={paid ? "paid" : "waiting"}
      className={cn(
        "mt-3 inline-block -rotate-3 rounded-md border-2 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide",
        paid ? "travel-stamp border-accent bg-accent text-accent-foreground" : "border-destructive text-destructive",
      )}
    >
      {paid ? "APPROVED · GAJI DAH MASUK" : "WAITING FOR GAJI"}
    </span>
  );
}

export function TravelGate() {
  const paid = useGaji();
  return <dd className={cn("font-bold", paid && "text-accent")}>{paid ? "NOW BOARDING" : "when gaji masuk"}</dd>;
}
