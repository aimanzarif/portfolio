import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

export const alt = `${profile.shortName} — ${profile.title}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const photo = await readFile(join(process.cwd(), "public/zarif.png"));
const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#DCD7C8",
          color: "#2C3639",
          padding: 64,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            border: "1px solid rgba(44, 54, 57, 0.16)",
            background: "#E8E4D8",
            padding: 56,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingRight: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#A27B5C",
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 64,
                  lineHeight: 1.05,
                  letterSpacing: -1.5,
                }}
              >
                {profile.shortName}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 16,
                  color: "#3F4E4F",
                  fontSize: 32,
                }}
              >
                {profile.title}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                color: "#3F4E4F",
                fontSize: 22,
              }}
            >
              {profile.location} · CPRE-FL
            </div>
          </div>
          <img
            src={photoSrc}
            width={320}
            height={430}
            alt=""
            style={{
              objectFit: "cover",
              objectPosition: "50% 18%",
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
