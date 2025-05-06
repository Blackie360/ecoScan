import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "EcoScan - EcoPoints Dashboard"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "linear-gradient(to bottom, #f0f9f1, #ffffff)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 40,
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#2d703c",
          }}
        >
          EcoScan
        </div>
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 24,
          color: "#1c3c25",
        }}
      >
        EcoPoints Dashboard
      </div>
      <div
        style={{
          fontSize: 32,
          textAlign: "center",
          color: "#3d8c4e",
          maxWidth: 800,
        }}
      >
        Earn points by scanning waste items and making sustainable choices
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
