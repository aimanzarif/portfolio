"use client";

import { useEffect, useState } from "react";
import type { MonitorStatus } from "@/lib/status";
import { useStatus } from "@/lib/use-status";
import { useVitals } from "@/lib/use-vitals";
import { cn } from "@/lib/utils";

const dot: Record<MonitorStatus, string> = {
  up: "bg-accent led",
  down: "bg-destructive",
  pending: "bg-muted-foreground",
  maintenance: "bg-muted-foreground",
};

const label: Record<MonitorStatus, string> = {
  up: "Up",
  down: "Down",
  pending: "Pending",
  maintenance: "Maintenance",
};

function ago(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)} min ago`;
}

export function StatusPanel({ statusHref }: { statusHref: string }) {
  const report = useStatus();
  const [, tick] = useState(0);

  useEffect(() => {
    const clock = window.setInterval(() => tick((n) => n + 1), 10_000);
    return () => window.clearInterval(clock);
  }, []);

  return (
    <div className="mt-8 rounded-md border-2 border-line bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-2 font-bold text-foreground">
          <span className="led size-2 rounded-full bg-accent" aria-hidden />
          LIVE STATUS
        </span>
        <span>
          {report ? `checked ${ago(report.checkedAt)} · ` : ""}
          <a href={statusHref} target="_blank" rel="noreferrer" className="underline underline-offset-4">
            full page ↗
          </a>
        </span>
      </div>

      {report === null ? (
        <p className="mt-4 font-mono text-sm text-muted-foreground">ping-ing the laptop, wait ah...</p>
      ) : !report.ok || report.monitors.length === 0 ? (
        <p className="mt-4 font-mono text-sm text-muted-foreground">
          Status feed offline. Ironic, I know lah. The full page might still work.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {report.monitors.map((monitor) => (
            <li key={monitor.name} className="flex items-center gap-3 py-2.5 text-[15px]">
              <span className={cn("size-2 shrink-0 rounded-full", dot[monitor.status])} aria-hidden />
              <span className="min-w-0 flex-1 truncate">{monitor.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {monitor.uptime24 !== null ? `${monitor.uptime24}% · 24h` : "no data yet"}
              </span>
              <span className="sr-only">{label[monitor.status]}</span>
            </li>
          ))}
        </ul>
      )}
      <VitalsLine />
    </div>
  );
}

function VitalsLine() {
  const vitals = useVitals();
  if (!vitals?.ok) return null;
  const parts = [
    vitals.cpu !== null ? `CPU ${vitals.cpu}%` : null,
    vitals.tempC !== null ? `${vitals.tempC}°C` : null,
    vitals.ramPct !== null ? `RAM ${vitals.ramPct}%` : null,
    vitals.load1 !== null ? `load ${vitals.load1}` : null,
  ].filter(Boolean);
  if (!parts.length) return null;
  return (
    <p className="mt-3 border-t border-line pt-3 font-mono text-xs text-muted-foreground">
      <span className="text-foreground">voyager right now:</span> {parts.join(" · ")}
    </p>
  );
}
