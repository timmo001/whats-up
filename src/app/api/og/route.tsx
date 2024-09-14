import { ImageResponse } from "next/og";
import { MessageCircleQuestion } from "lucide-react";

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
          backgroundColor: "#020817",
          fontSize: 84,
          fontWeight: 600,
        }}
      >
        <MessageCircleQuestion size={420} />

        <div style={{ marginTop: 8 }}>What's Up?</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
