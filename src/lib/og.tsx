import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** 공용 OG 카드 렌더러. 임시 디자인이라 실제 디자인이 나오면 다시 꾸민다. */
export function renderOg({ title, subtitle }: { title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background: "#111",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 40, opacity: 0.7, marginTop: 16 }}>{subtitle}</div>}
      </div>
    ),
    ogSize,
  );
}
