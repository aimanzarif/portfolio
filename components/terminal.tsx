"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { profile, projects } from "@/lib/profile";
import type { StatusReport } from "@/lib/status";
import { findEgg } from "@/lib/eggs";

type Line = { id: number; kind: "cmd" | "out"; body: ReactNode };

const PROMPT = "zarep@voyager:~$";

const boot: { kind: Line["kind"]; text: string; hint?: boolean }[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "zarif. IT support. fix things one." },
  { kind: "cmd", text: "uptime --pretty" },
  { kind: "out", text: "still up, somehow. scroll down to the homelab for real numbers." },
  { kind: "out", text: "psst. this one real terminal ok. type `help` ↓", hint: true },
];

const bootBody = (line: (typeof boot)[number], text = line.text): ReactNode =>
  line.hint ? <span className="text-accent">{text}</span> : text;

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">
      {children}
    </a>
  );
}

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function statusLine(): Promise<ReactNode> {
  try {
    const res = await fetch("/api/status");
    const report = (await res.json()) as StatusReport;
    if (!report.ok) return "status feed offline. ironic, i know lah.";
    const up = report.monitors.filter((m) => m.status === "up").length;
    return `${up}/${report.monitors.length} services up. ${up === report.monitors.length ? "all green, alhamdulillah." : "aiyo, someone having a bad day. probably me."}`;
  } catch {
    return "cannot reach the status feed. laptop updating kot.";
  }
}

const HIDDEN = new Set(["sudo", "rm", "kopi", "teh", "coffee", "makan", "lunch", "travel", "exit", "logout", "neofetch", "hello", "hi", "hai"]);

function run(raw: string): ReactNode | Promise<ReactNode> | "clear" {
  const first = raw.trim().toLowerCase().split(/\s+/)[0];
  const secret = raw.toLowerCase().includes("secret");
  if (HIDDEN.has(first) || secret) findEgg("terminal");

  const input = raw.trim();
  const cmd = input.toLowerCase();
  const [head, ...rest] = cmd.split(/\s+/);
  const arg = rest.join(" ");

  if (!input) return null;
  if (cmd === "clear") return "clear";

  if (cmd.startsWith("sudo")) {
    return "zarif is not in the sudoers file. this incident will be reported. (to me lah. i'm the admin.)";
  }
  if (cmd.startsWith("rm ")) {
    return (
      <>
        eh, not again. ask me about{" "}
        <button type="button" className="text-accent underline underline-offset-4" onClick={() => jump("incident")}>
          june 2026
        </button>
        .
      </>
    );
  }

  switch (head) {
    case "help":
      return (
        <span className="whitespace-pre-wrap">
          {`whoami        who is this guy
ls            look around
open <name>   open a project (smartroute, ikango)
status        live service status
cv            download my cv
contact       how to reach me
clear         clean slate
...and a few more, but i won't tell lah.`}
        </span>
      );
    case "whoami":
      return `${profile.shortName}. IT support at ServerFreak, Klang. shy sikit at first, then ok already. prefer fixing things than breaking them.`;
    case "ls":
      if (arg === "projects" || arg === "projects/") return projects.map((p) => p.id).join("   ");
      if (arg.startsWith("secret")) return "ls: cannot open directory 'secrets/': Permission denied. nice try, boss.";
      return "projects/   homelab/   cv.pdf   secrets/";
    case "cd":
      if (arg.startsWith("secret")) return "permission denied. still cannot lah.";
      if (arg.startsWith("homelab")) {
        jump("homelab");
        return "jom, going there...";
      }
      if (arg.startsWith("projects")) {
        jump("work");
        return "jom, going there...";
      }
      return `cd: ${arg || "~"}: you already at home what.`;
    case "cat":
      if (arg.startsWith("secret")) return "cat: secrets: Permission denied. kucing pun cakap tak boleh.";
      if (arg === "cv.pdf") return <ExtLink href={profile.cvHref}>pdf one lah, cat cannot help. open here.</ExtLink>;
      return `cat: ${arg || "?"}: no such file. try \`ls\` first.`;
    case "open": {
      const project = projects.find((p) => p.id === arg || p.name.toLowerCase() === arg);
      const live = project?.links.find((l) => l.label === "Live demo");
      if (project && live) return <ExtLink href={live.href}>opening {project.name} →</ExtLink>;
      if (project) return `${project.name} not public, but got in the work section.`;
      return "open what ah? try `open smartroute` or `open ikango`.";
    }
    case "status":
    case "uptime":
      return statusLine();
    case "cv":
      return <ExtLink href={profile.cvHref}>download cv (pdf) →</ExtLink>;
    case "contact":
    case "email":
      return (
        <>
          <ExtLink href={`mailto:${profile.email}`}>{profile.email}</ExtLink> is best. introvert, but i reply
          fast one.
        </>
      );
    case "date":
      return new Date().toString();
    case "kopi":
    case "teh":
    case "coffee":
      return "bancuh-ing... kurang manis, as requested boss.";
    case "makan":
    case "lunch":
      return "keluar makan jap. back in 30 minutes. (malaysian minutes lah.)";
    case "travel":
      return "error: insufficient funds. tunggu gaji masuk first.";
    case "exit":
    case "logout":
      return "where you want to go? scroll down lah.";
    case "hello":
    case "hi":
    case "hai":
      return "hai! jom, type `help`.";
    case "neofetch":
      return (
        <span className="whitespace-pre-wrap">
          {`zarep@voyager
-------------
OS:      Red Hat Enterprise Linux 10
Host:    Acer laptop pretending to be a rack
RAM:     32 GB
Uptime:  type \`status\`
Shell:   bash, and patience`}
        </span>
      );
    default:
      return `command not found: ${head}. try \`help\` lah.`;
  }
}

export function Terminal() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const nextId = useRef(0);
  const booted = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // Boot sequence: commands are typed out, outputs appear whole. Skipped for reduced motion.
  useEffect(() => {
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    const run = async () => {
      const step = reduced ? 0 : 1;
      await wait(reduced ? 0 : 900);
      const result: Line[] = [];
      for (const line of boot) {
        if (!alive || booted.current) return;
        const id = nextId.current++;
        if (line.kind === "cmd" && step) {
          for (let i = 1; i <= line.text.length; i++) {
            await wait(45 + Math.random() * 50);
            if (!alive || booted.current) return;
            setLines([...result, { id, kind: "cmd", body: line.text.slice(0, i) }]);
          }
          await wait(250);
        } else if (step) {
          await wait(line.hint ? 500 : 120);
        }
        if (!alive || booted.current) return;
        result.push({ id, kind: line.kind, body: bootBody(line) });
        setLines([...result]);
      }
      booted.current = true;
    };
    run();
    return () => {
      alive = false;
      timers.forEach(window.clearTimeout);
    };
  }, [reduced]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const push = (kind: Line["kind"], body: ReactNode) => {
    const id = nextId.current++;
    setLines((prev) => [...prev, { id, kind, body }]);
    return id;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!booted.current) {
      booted.current = true;
      setLines(boot.map((line) => ({ id: nextId.current++, kind: line.kind, body: bootBody(line) })));
    }
    const raw = value;
    setValue("");
    setCursor(null);
    if (raw.trim()) setHistory((prev) => [...prev, raw]);

    const result = run(raw);
    if (result === "clear") {
      setLines([]);
      return;
    }
    push("cmd", raw);
    if (result === null) return;
    if (result instanceof Promise) {
      const id = push("out", "checking...");
      const body = await result;
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, body } : line)));
    } else {
      push("out", result);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!history.length) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    }
  };

  return (
    <aside
      aria-label="Interactive terminal"
      className={`min-w-0 max-w-lg flex-[1_1_20rem] cursor-text overflow-hidden rounded-xl border bg-card transition-colors ${
        touched ? "border-line" : "terminal-invite border-accent/60"
      }`}
      onClick={() => input.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3 font-mono text-xs text-muted-foreground">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-2 truncate">zarep@voyager: ~</span>
        {!touched ? (
          <span className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap text-accent">
            <span className="led size-1.5 rounded-full bg-accent" aria-hidden />
            click to type
          </span>
        ) : null}
      </div>
      <div ref={scroller} className="h-80 overflow-y-auto p-5 font-mono text-[13px] leading-6" aria-live="polite">
        {lines.map((line) =>
          line.kind === "cmd" ? (
            <div key={line.id} className="mt-2 first:mt-0 break-words">
              <span className="text-accent">$</span> {line.body}
            </div>
          ) : (
            <div key={line.id} className="break-words text-muted-foreground">
              {line.body}
            </div>
          ),
        )}
        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
          <label htmlFor="terminal-input" className="sr-only">
            Type a command. Try help.
          </label>
          <span className="text-accent" aria-hidden>
            $
          </span>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div aria-hidden className="pointer-events-none whitespace-pre text-foreground">
              {value}
              <span className="caret-blink inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] bg-accent" />
              {!value ? <span className="ml-2 text-muted-foreground/60">type help</span> : null}
            </div>
            <input
              ref={input}
              id="terminal-input"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setTouched(true)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              title={PROMPT}
              className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none selection:bg-accent/30"
            />
          </div>
        </form>
      </div>
    </aside>
  );
}
