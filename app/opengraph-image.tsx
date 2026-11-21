import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const alt = `${profile.shortName} — I keep things running.`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const INK = "#1c1f20";
const BONE = "#ece7db";
const SAGE = "#a9d3b8";
const MUTED = "#b4b8ae";

/** Fetch a Google Font as TTF for the image. Falls back to the default font if offline. */
async function loadFont(family: string, weight: number) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8)" } },
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const [display, mono] = await Promise.all([loadFont("Bricolage Grotesque", 800), loadFont("JetBrains Mono", 500)]);
  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 800 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "Mono", data: mono, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          color: BONE,
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontFamily: "Mono", fontSize: 30 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: SAGE, marginRight: 22 }} />
          <span style={{ fontWeight: 500 }}>zarep.my</span>
          <span style={{ color: SAGE, marginLeft: 14 }}>~$</span>
          <div style={{ width: 16, height: 32, background: SAGE, marginLeft: 10 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontWeight: 800 }}>
          <div style={{ display: "flex", fontSize: 128, lineHeight: 0.95, letterSpacing: -5 }}>I keep things</div>
          <div style={{ display: "flex", marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                fontSize: 128,
                lineHeight: 1,
                letterSpacing: -5,
                background: SAGE,
                color: INK,
                padding: "0 20px 10px",
                transform: "rotate(-1.5deg)",
              }}
            >
              running.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Mono",
            fontSize: 24,
            color: MUTED,
            letterSpacing: 1,
          }}
        >
          <span>{`${profile.shortName.toUpperCase()} · ${profile.title.toUpperCase()}`}</span>
          <span>{profile.location.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
