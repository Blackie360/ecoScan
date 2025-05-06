import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "EcoScan - Waste Classification with AI"
export const size = {
  width: 800,
  height: 800, // Square format works better for WhatsApp
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 100,
        background: "linear-gradient(to bottom, #f0f9f1, #ffffff)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: "#2d703c",
          }}
        >
          EcoScan
        </div>
      </div>
      <div
        style={{
          fontSize: 40,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#1c3c25",
        }}
      >
        Waste Classification with AI
      </div>
      <div
        style={{
          fontSize: 28,
          textAlign: "center",
          color: "#3d8c4e",
          maxWidth: 700,
        }}
      >
        Identify waste items, learn recycling information, and earn points
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}
