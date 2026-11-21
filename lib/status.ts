export type MonitorStatus = "up" | "down" | "pending" | "maintenance";

export type StatusMonitor = {
  name: string;
  status: MonitorStatus;
  /** 24-hour uptime, 0–100, or null when Uptime Kuma has no figure yet. */
  uptime24: number | null;
};

export type StatusReport =
  | { ok: true; checkedAt: string; monitors: StatusMonitor[] }
  | { ok: false; checkedAt: string; reason?: string };
