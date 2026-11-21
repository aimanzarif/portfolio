/*
 * Pixel Zarif, voyager's human. 14×28 art pixels: a skinny guy, 170cm, big head because pixel art.
 * Middle-part hair, glasses, mature tan skin, sage baju Melayu (cekak musang collar, gold buttons),
 * songket sampin, brown capal.
 */
const ROWS = [
  "....HHHHHH....",
  "...HHHHHHHH...",
  "..HHHHSSHHHH..",
  "..HHHSSSSHHH..",
  "..HHSSSSSSHH..",
  "..HGGGGGGGGH..",
  "..SGlEGGElGS..",
  "..SGGGSSGGGS..",
  "..SBSSSSSSBS..",
  "...SSMSSMSS...",
  "....sSMMSs....",
  ".....sSSs.....",
  ".....KSSK.....",
  "....CCKKCC....",
  "...CCCUUCCC...",
  "...CCCccCCC...",
  "...CCCUUCCC...",
  "...CCCccCCC...",
  "...SWWWWWWS...",
  "....WwWWwW....",
  "....WWWWWW....",
  "....CCCCCC....",
  "....CC..CC....",
  "....CC..CC....",
  "....CC..CC....",
  "....CC..CC....",
  "....FF..FF....",
  "...PPP..PPP...",
] as const;

const COLORS: Record<string, string> = {
  H: "#231f1d", // hair
  S: "#b67a4b", // skin, mature tan
  s: "#9a6339", // skin shade
  F: "#b67a4b", // feet
  G: "#55595a", // glasses frame
  E: "#1c1f20", // eyes
  l: "#f4ead9", // lens glint
  B: "#e2877a", // blush
  M: "#6e3424", // smile
  C: "#a9d3b8", // baju Melayu, sage
  c: "#86b598", // placket shade
  K: "#86b598", // cekak musang collar
  U: "#e9b23a", // gold buttons
  W: "#2f6b4f", // sampin, songket
  w: "#e9b23a", // songket gold thread
  P: "#7a4b2a", // capal
};

type Run = { x: number; y: number; w: number; color: string };

/** Merge each row into horizontal runs so the SVG stays small. */
function runs(blink: boolean): Run[] {
  const out: Run[] = [];
  ROWS.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      let ch: string = row[x];
      if (blink && (ch === "E" || ch === "l")) ch = "G"; // eyes shut behind the glasses
      const color = COLORS[ch];
      let w = 1;
      while (x + w < row.length) {
        let next: string = row[x + w];
        if (blink && (next === "E" || next === "l")) next = "G";
        if (next !== ch) break;
        w++;
      }
      if (color) out.push({ x, y, w, color });
      x += w;
    }
  });
  return out;
}

const OPEN = runs(false);
const SHUT = runs(true);

export function ZarifSprite({ blink, worried, className }: { blink: boolean; worried: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 14 28" className={className} shapeRendering="crispEdges" aria-hidden>
      {(blink ? SHUT : OPEN).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
      {worried ? (
        <g className="voyager-drop">
          <rect x="13" y="2" width="1" height="1" fill="#9db8f0" />
          <rect x="12" y="3" width="2" height="2" fill="#9db8f0" />
        </g>
      ) : null}
    </svg>
  );
}
