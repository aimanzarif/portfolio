"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { profile, projects } from "@/lib/profile";
import type { StatusReport } from "@/lib/status";
import { EGGS, eggHints, findEgg, foundEggs } from "@/lib/eggs";
import { emitVoyager } from "@/lib/voyager-events";
import { GUESTBOOK_MAX, GuestbookSign, guestbookList } from "@/components/guestbook";

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

const COMMANDS = ["help", "whoami", "ls", "cd", "cat", "open", "status", "ping", "ssh", "guestbook", "eggs", "history", "cv", "contact", "clear"];
const ARGS: Record<string, string[]> = {
  open: projects.map((p) => p.id),
  cd: ["projects", "homelab", "secrets"],
  cat: ["cv.pdf", "secrets"],
  ls: ["projects", "secrets"],
  ping: ["zarep.my"],
  ssh: ["zarif@zarep.my"],
  guestbook: ["sign "],
};

/** Shell-style completion: returns the completed input, or the candidates when it's ambiguous. */
function complete(input: string): { value: string } | { options: string[] } | null {
  const parts = input.split(" ");
  if (parts.length === 1) {
    const hits = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
    if (hits.length === 1) return { value: `${hits[0]} ` };
    return hits.length ? { options: hits } : null;
  }
  const [cmd, ...rest] = parts;
  const partial = rest.join(" ").toLowerCase();
  const hits = (ARGS[cmd.toLowerCase()] ?? []).filter((a) => a.startsWith(partial));
  if (hits.length === 1) return { value: `${cmd} ${hits[0]}` };
  return hits.length ? { options: hits } : null;
}

async function ping(): Promise<ReactNode> {
  const times: number[] = [];
  for (let i = 0; i < 4; i++) {
    const start = performance.now();
    try {
      await fetch(`/api/ping?seq=${i}`, { cache: "no-store" });
      times.push(Math.round(performance.now() - start));
    } catch {
      return "ping: zarep.my: cannot reach lah. the laptop tidur kot.";
    }
  }
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  return (
    <span className="whitespace-pre-wrap">
      {`PING zarep.my (a laptop in Klang)
${times.map((t, i) => `reply from zarep.my: seq=${i + 1} time=${t} ms`).join("\n")}
--- 4 sent, 4 received, avg ${avg} ms. ${avg < 150 ? "laju jugak." : "slow sikit, maybe your wifi."}`}
    </span>
  );
}

function run(raw: string, history: readonly string[] = []): ReactNode | Promise<ReactNode> | "clear" {
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
    case "eggs": {
      const found = foundEggs();
      return (
        <span className="block">
          <span className="block">
            {found.length === EGGS.length ? "semua dah jumpa. respect." : `${found.length}/${EGGS.length} easter eggs found. hints:`}
          </span>
          {EGGS.map((egg) => (
            <span key={egg} className={found.includes(egg) ? "block text-muted-foreground line-through" : "block"}>
              {found.includes(egg) ? "[x] " : "[ ] "}
              {eggHints[egg]}
            </span>
          ))}
        </span>
      );
    }
    case "help":
      return (
        <span className="whitespace-pre-wrap">
          {`whoami        who is this guy
ls            look around
open <name>   open a project (smartroute, ikango)
status        live service status
ping          measure the trip to my laptop
ssh zarif     talk to me (opens your email)
guestbook     read the guestbook (sign: guestbook sign <message>)
eggs          easter egg progress, with hints
history       what you typed so far
cv            download my cv
contact       how to reach me
clear         clean slate
tab           autocomplete, like a real shell
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
    case "ping":
      return ping();
    case "ssh":
      if (!arg) return "ssh: who you want to connect to? try `ssh zarif`.";
      window.setTimeout(() => {
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Hai Zarif (from your terminal)")}`;
      }, 900);
      return `connecting to ${profile.email}... opening your email app. say hai!`;
    case "history":
      if (!history.length) return "no history yet. you're clean.";
      return (
        <span className="whitespace-pre-wrap">
          {history.map((h, i) => `${String(i + 1).padStart(4, " ")}  ${h}`).join("\n")}
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
  const [awaitingName, setAwaitingName] = useState<string | null>(null);
  const nextId = useRef(0);
  const booted = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

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

    // Guestbook: second step, the name prompt
    if (awaitingName !== null) {
      setValue("");
      const name = raw.trim().slice(0, 24);
      push("cmd", name || "(anon)");
      push("out", <GuestbookSign message={awaitingName} name={name} />);
      setAwaitingName(null);
      return;
    }

    // Guestbook: list or start signing
    const gb = raw.trim().match(/^guestbook(?:\s+(\S+))?(?:\s+([\s\S]*))?$/i);
    if (gb) {
      setValue("");
      setCursor(null);
      setHistory((prev) => [...prev, raw.trim()]);
      push("cmd", raw);
      emitVoyager({ type: "command", command: "guestbook" });
      const sub = (gb[1] ?? "").toLowerCase();
      if (sub === "sign") {
        const message = (gb[2] ?? "").trim().replace(/^["']|["']$/g, "");
        if (!message) {
          push("out", "usage: guestbook sign <message>. example: guestbook sign hai from penang!");
        } else if (message.length > GUESTBOOK_MAX) {
          push("out", `too long lah. max ${GUESTBOOK_MAX} characters (yours: ${message.length}).`);
        } else {
          setAwaitingName(message);
          push("out", "your name? (press enter to stay anonymous)");
        }
        return;
      }
      const id = push("out", "opening the guestbook...");
      const body = await guestbookList();
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, body } : line)));
      return;
    }
    setValue("");
    setCursor(null);
    if (raw.trim()) setHistory((prev) => [...prev, raw.trim()]);

    const result = run(raw, raw.trim() ? [...history, raw.trim()] : history);
    if (result === "clear") {
      setLines([]);
      return;
    }
    push("cmd", raw);
    if (raw.trim()) emitVoyager({ type: "command", command: raw.trim().toLowerCase() });
    if (result === null) return;
    if (result instanceof Promise) {
      const id = push("out", "checking...");
      const body = await result;
      setLines((prev) => prev.map((line) => (line.id === id ? { ...line, body } : line)));
    } else {
      push("out", result);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // The prompt is a textarea so long commands wrap; Enter still runs the command.
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
      return;
    }
    // Tab completes; on an empty prompt it stays a normal Tab so keyboard users can move on.
    if (event.key === "Tab" && value.trim()) {
      event.preventDefault();
      const result = complete(value);
      if (!result) return;
      if ("value" in result) {
        setValue(result.value);
      } else {
        push("cmd", value);
        push("out", result.options.join("   "));
      }
      return;
    }
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
      className={`flex min-w-0 max-w-lg flex-[1_1_20rem] cursor-text flex-col overflow-hidden rounded-xl border bg-card transition-colors xl:max-w-none xl:self-stretch ${
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
      <div ref={scroller} className="h-80 overflow-y-auto p-5 font-mono text-[13px] leading-6 xl:h-0 xl:min-h-80 xl:flex-[1_1_0px] xl:text-[14px] xl:leading-7" aria-live="polite">
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
        <form onSubmit={onSubmit} className="mt-2 flex items-start gap-2">
          <label htmlFor="terminal-input" className="sr-only">
            Type a command. Try help.
          </label>
          <span className="text-accent" aria-hidden>
            $
          </span>
          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div aria-hidden className="pointer-events-none whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
              {value}
              <span className="caret-blink inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] bg-accent" />
              {!value ? (
                <span className="ml-2 text-muted-foreground/60">{awaitingName !== null ? "your name (optional)" : "type help"}</span>
              ) : null}
            </div>
            <textarea
              ref={input}
              id="terminal-input"
              rows={1}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[\r\n]+/g, " "));
                emitVoyager({ type: "typing" });
              }}
              onKeyDown={onKeyDown}
              onFocus={() => setTouched(true)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              title={PROMPT}
              className="absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent p-0 font-[inherit] leading-[inherit] whitespace-pre-wrap text-transparent caret-transparent outline-none [overflow-wrap:anywhere] selection:bg-accent/30"
            />
          </div>
        </form>
      </div>
    </aside>
  );
}
