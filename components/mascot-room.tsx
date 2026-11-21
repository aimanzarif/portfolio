/*
 * Zarif's little room behind the mascots: window that follows Klang time,
 * a framed rack poster, a pokok, and kopi on the sill.
 */

type Rect = [x: number, y: number, w: number, h: number, fill: string];

const WALL = "#e4dccb";
const FRAME = "#7a4b2a";

const ALWAYS: Rect[] = [
  [0, 0, 40, 30, WALL],
  // wainscot stripe
  [0, 22, 40, 1, "#d2c8b2"],
  // window frame and sill
  [3, 2, 14, 12, FRAME],
  [2, 14, 16, 1, "#5e3a20"],
  // rack poster
  [24, 3, 10, 9, "#2f6b4f"],
  [25, 4, 8, 7, "#1c1f20"],
  [26, 5, 6, 1, "#55595a"],
  [26, 7, 6, 1, "#55595a"],
  [26, 9, 6, 1, "#55595a"],
  [31, 5, 1, 1, "#a9d3b8"],
  [31, 7, 1, 1, "#a9d3b8"],
  [31, 9, 1, 1, "#e9b23a"],
  // pokok in the corner
  [36, 18, 1, 3, "#4f8a64"],
  [37, 16, 1, 5, "#3f7454"],
  [38, 17, 1, 4, "#4f8a64"],
  [35, 19, 1, 2, "#3f7454"],
  [35, 21, 4, 3, "#b0643a"],
  [36, 24, 2, 1, "#8f4f2c"],
  // kopi on the sill
  [4, 12, 3, 2, "#f4ead9"],
  [7, 12, 1, 1, "#f4ead9"],
  [5, 12, 1, 1, "#6e3424"],
];

const DAY: Rect[] = [
  [4, 3, 12, 10, "#bfe0ea"],
  [12, 4, 3, 3, "#e9b23a"],
  [5, 8, 4, 1, "#f7f3ea"],
  [6, 7, 2, 1, "#f7f3ea"],
  // Klang skyline
  [4, 10, 3, 3, "#8fa39a"],
  [7, 9, 2, 4, "#7d9188"],
  [9, 11, 3, 2, "#8fa39a"],
  [12, 10, 1, 3, "#7d9188"],
  [13, 11, 3, 2, "#8fa39a"],
];

const NIGHT: Rect[] = [
  [4, 3, 12, 10, "#1f2b3a"],
  [12, 4, 2, 2, "#f4ead9"],
  [13, 4, 1, 1, "#1f2b3a"],
  [6, 4, 1, 1, "#f4ead9"],
  [9, 6, 1, 1, "#f4ead9"],
  [5, 7, 1, 1, "#9db8f0"],
  // skyline with lit windows
  [4, 10, 3, 3, "#141c26"],
  [7, 9, 2, 4, "#0f151d"],
  [9, 11, 3, 2, "#141c26"],
  [12, 10, 1, 3, "#0f151d"],
  [13, 11, 3, 2, "#141c26"],
  [8, 10, 1, 1, "#e9b23a"],
  [5, 11, 1, 1, "#e9b23a"],
  [14, 12, 1, 1, "#e9b23a"],
];

const MULLIONS: Rect[] = [
  [10, 3, 1, 10, FRAME],
  [4, 8, 12, 1, FRAME],
];

export function MascotRoom({ night }: { night: boolean }) {
  const rects = [...ALWAYS.slice(0, 2), ...ALWAYS.slice(2, 4), ...(night ? NIGHT : DAY), ...MULLIONS, ...ALWAYS.slice(4)];
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
      <svg
        viewBox="0 0 40 30"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full"
        shapeRendering="crispEdges"
      >
        {rects.map(([x, y, w, h, fill], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
        ))}
        {/* kopi steam */}
        <rect x="5" y="10" width="1" height="1" fill="#f7f3ea" className="voyager-z" />
        <rect x="6" y="9" width="1" height="1" fill="#f7f3ea" className="voyager-z" style={{ animationDelay: "0.8s" }} />
      </svg>
      {night ? <span className="absolute inset-0 bg-[#1f2b3a]/25" /> : null}
      {/* wooden floor */}
      <span className="absolute inset-x-0 bottom-0 h-[9px] border-t-2 border-[#8f6a48] bg-[#a9805a] sm:h-[12px]" />
    </span>
  );
}
