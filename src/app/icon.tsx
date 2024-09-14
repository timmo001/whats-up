import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 248,
  height: 248,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 248,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{ position: "absolute", top: -4, left: 248 / 2 - 256 / 2 }}
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    },
  );
}
