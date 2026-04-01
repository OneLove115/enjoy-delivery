import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EnJoy - Elite Gourmet Delivery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1025 0%, #2d1b4e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, color: "#5A31F4" }}>
          EnJoy
        </div>
        <div style={{ fontSize: 32, color: "#a78bfa", marginTop: 16 }}>
          Elite Gourmet Delivery
        </div>
        <div style={{ fontSize: 22, color: "#7c3aed", marginTop: 24 }}>
          Order from 1000+ curated restaurants
        </div>
      </div>
    ),
    { ...size }
  );
}
