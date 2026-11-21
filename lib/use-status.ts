"use client";

import { useEffect, useState } from "react";
import type { StatusReport } from "@/lib/status";

/* One shared poll for every component that shows status (rack vent, live panel, terminal). */
let current: StatusReport | null = null;
let inflight: Promise<StatusReport> | null = null;
const listeners = new Set<(report: StatusReport) => void>();
let timer: number | null = null;

function load() {
  inflight ??= fetch("/api/status")
    .then((res) => res.json() as Promise<StatusReport>)
    .catch((): StatusReport => ({ ok: false, checkedAt: new Date().toISOString() }))
    .then((report) => {
      current = report;
      inflight = null;
      listeners.forEach((fn) => fn(report));
      return report;
    });
  return inflight;
}

export function useStatus() {
  const [report, setReport] = useState<StatusReport | null>(current);

  useEffect(() => {
    listeners.add(setReport);
    if (!current) load();
    if (timer === null) timer = window.setInterval(load, 60_000);
    return () => {
      listeners.delete(setReport);
      if (listeners.size === 0 && timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return report;
}

export type StatusSummary = "up" | "degraded" | "unknown";

export function summarize(report: StatusReport | null): { state: StatusSummary; up: number; total: number } {
  if (!report || !report.ok || report.monitors.length === 0) return { state: "unknown", up: 0, total: 0 };
  const up = report.monitors.filter((m) => m.status === "up").length;
  return { state: up === report.monitors.length ? "up" : "degraded", up, total: report.monitors.length };
}
