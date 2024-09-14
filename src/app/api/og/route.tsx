import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          backgroundColor: "rgb(2, 8, 23)",
          fontSize: 84,
          fontWeight: 600,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="640"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          style={{
            position: "absolute",
            top: 630 / 2 - 640 / 2,
            left: 1200 / 2 - 640 / 2,
          }}
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="640"
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
    {
      width: 1200,
      height: 630,
    },
  );
}
