import type { Sky } from "@/lib/weather";

/*
 * Zarif's little room behind the mascots. Everything in it is live:
 * the window follows the real Klang sunrise/sunset and weather, the rack poster follows Uptime Kuma,
 * and the kopi on the shelf follows the time of day.
 */

export type Kopi = "full" | "half" | "empty" | "double";

type Rect = [x: number, y: number, w: number, h: number, fill: string];

const FRAME = "#7a4b2a";

const SKY: Record<"day" | "night", Record<Sky, string>> = {
  day: { clear: "#bfe0ea", cloudy: "#b4c2c6", rain: "#9fadb2", storm: "#7f8b90" },
  night: { clear: "#1f2b3a", cloudy: "#252d36", rain: "#222a33", storm: "#1b2129" },
};

const SKYLINE = (a: string, b: string): Rect[] => [
  [4, 10, 3, 3, a],
  [7, 9, 2, 4, b],
  [9, 11, 3, 2, a],
  [12, 10, 1, 3, b],
  [13, 11, 3, 2, a],
];

function windowView(night: boolean, sky: Sky): Rect[] {
  const out: Rect[] = [[4, 3, 12, 10, SKY[night ? "night" : "day"][sky]]];
  const clear = sky === "clear";
  if (!night && clear) out.push([12, 4, 3, 3, "#e9b23a"], [5, 8, 4, 1, "#f7f3ea"], [6, 7, 2, 1, "#f7f3ea"]);
  if (night && clear)
    out.push([12, 4, 2, 2, "#f4ead9"], [13, 4, 1, 1, SKY.night.clear], [6, 4, 1, 1, "#f4ead9"], [9, 6, 1, 1, "#f4ead9"], [5, 7, 1, 1, "#9db8f0"]);
  if (!clear) {
    const cloud = night ? "#3a4450" : sky === "cloudy" ? "#e6eaeb" : "#8a979c";
    const edge = night ? "#2f3842" : sky === "cloudy" ? "#cfd6d8" : "#76838a";
    out.push([5, 4, 5, 2, cloud], [6, 3, 3, 1, cloud], [5, 6, 5, 1, edge], [11, 5, 4, 2, cloud], [12, 4, 2, 1, cloud], [11, 7, 4, 1, edge]);
  }
  out.push(...(night ? SKYLINE("#141c26", "#0f151d") : SKYLINE("#8fa39a", "#7d9188")));
  if (night) out.push([8, 10, 1, 1, "#e9b23a"], [5, 11, 1, 1, "#e9b23a"], [14, 12, 1, 1, "#e9b23a"]);
  return out;
}

const RAIN: [x: number, delay: number][] = [
  [5, 0], [7, 0.35], [9, 0.15], [11, 0.5], [13, 0.25], [15, 0.6], [6, 0.7], [12, 0.85],
];

const CUP_Y = 10; // sits on the little shelf between the window and the poster

function cup(x: number, level: "full" | "half" | "empty"): Rect[] {
  const out: Rect[] = [
    [x, CUP_Y, 3, 2, "#f4ead9"],
    [x + 3, CUP_Y, 1, 1, "#f4ead9"],
  ];
  if (level === "full") out.push([x, CUP_Y, 3, 1, "#6e3424"]);
  if (level === "half") out.push([x + 1, CUP_Y + 1, 1, 1, "#a0715a"]);
  return out;
}

function kopiRects(kopi: Kopi): Rect[] {
  const shelf: Rect[] = [[18, CUP_Y + 2, 8, 1, "#5e3a20"]];
  if (kopi === "double") return [...shelf, ...cup(18, "empty"), ...cup(22, "full")];
  return [...shelf, ...cup(20, kopi)];
}

export function MascotRoom({
  night,
  sky,
  serviceDown,
  kopi,
}: {
  night: boolean;
  sky: Sky;
  serviceDown: boolean;
  kopi: Kopi;
}) {
  const steamX = kopi === "double" ? 23 : 21;
  const steaming = kopi === "full" || kopi === "double";
  const wet = sky === "rain" || sky === "storm";

  const before: Rect[] = [
    [0, 0, 40, 30, "#e4dccb"],
    [0, 22, 40, 1, "#d2c8b2"],
    [3, 2, 14, 12, FRAME],
    [2, 14, 16, 1, "#5e3a20"],
    ...windowView(night, sky),
  ];
  const after: Rect[] = [
    [10, 3, 1, 10, FRAME],
    [4, 8, 12, 1, FRAME],
    // rack poster
    [27, 3, 10, 9, "#2f6b4f"],
    [28, 4, 8, 7, "#1c1f20"],
    [29, 5, 6, 1, "#55595a"],
    [29, 7, 6, 1, "#55595a"],
    [29, 9, 6, 1, "#55595a"],
    [34, 7, 1, 1, "#a9d3b8"],
    [34, 9, 1, 1, "#e9b23a"],
    // pokok
    [36, 18, 1, 3, "#4f8a64"],
    [37, 16, 1, 5, "#3f7454"],
    [38, 17, 1, 4, "#4f8a64"],
    [35, 19, 1, 2, "#3f7454"],
    [35, 21, 4, 3, "#b0643a"],
    [36, 24, 2, 1, "#8f4f2c"],
    ...kopiRects(kopi),
  ];

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
      <svg viewBox="0 0 40 30" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full" shapeRendering="crispEdges">
        <defs>
          <clipPath id="room-window">
            <rect x="4" y="3" width="12" height="10" />
          </clipPath>
        </defs>
        {before.map(([x, y, w, h, fill], i) => (
          <rect key={`a${i}`} x={x} y={y} width={w} height={h} fill={fill} />
        ))}
        {wet ? (
          <g clipPath="url(#room-window)" fill={night ? "#7f9bc0" : "#e8f1f5"}>
            {RAIN.map(([x, delay]) => (
              <rect key={`${x}-${delay}`} x={x} y="4" width="1" height="2" className="room-rain" style={{ animationDelay: `${delay}s` }} />
            ))}
          </g>
        ) : null}
        {sky === "storm" ? <rect x="4" y="3" width="12" height="10" fill="#f7f3ea" className="room-flash" /> : null}
        {after.map(([x, y, w, h, fill], i) => (
          <rect key={`b${i}`} x={x} y={y} width={w} height={h} fill={fill} />
        ))}
        {/* top poster light mirrors Uptime Kuma: red and blinking when something is down */}
        <rect x="34" y="5" width="1" height="1" fill={serviceDown ? "#ff6b5e" : "#a9d3b8"} className={serviceDown ? "led" : undefined} />
        {steaming ? (
          <>
            <rect x={steamX} y={CUP_Y - 2} width="1" height="1" fill="#f7f3ea" className="voyager-z" />
            <rect x={steamX + 1} y={CUP_Y - 3} width="1" height="1" fill="#f7f3ea" className="voyager-z" style={{ animationDelay: "0.8s" }} />
          </>
        ) : null}
      </svg>
      {night ? <span className="absolute inset-0 bg-[#1f2b3a]/25" /> : null}
      <span className="absolute inset-x-0 bottom-0 h-[9px] border-t-2 border-[#8f6a48] bg-[#a9805a] sm:h-[12px]" />
    </span>
  );
}
