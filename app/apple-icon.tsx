import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/* Same mark as app/icon.svg: a shell prompt with a sage block cursor. iOS rounds the corners itself. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1f20",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path
            d="M8.5 10.5 14 16l-5.5 5.5"
            fill="none"
            stroke="#ece7db"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="17" y="9.5" width="7" height="13" rx="1.2" fill="#a9d3b8" />
        </svg>
      </div>
    ),
    size,
  );
}
