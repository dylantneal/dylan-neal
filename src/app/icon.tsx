import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1426",
          borderRadius: "7px",
          position: "relative",
        }}
      >
        {/* Subtle corner traces */}
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            width: 6,
            height: 1,
            background: "#c5a44e",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            width: 1,
            height: 6,
            background: "#c5a44e",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            width: 6,
            height: 1,
            background: "#c5a44e",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 5,
            right: 5,
            width: 1,
            height: 6,
            background: "#c5a44e",
            opacity: 0.4,
          }}
        />
        {/* DN monogram */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: "#c5a44e",
            letterSpacing: "0.5px",
            fontFamily: "serif",
            marginTop: 1,
          }}
        >
          DN
        </div>
      </div>
    ),
    { ...size }
  );
}
