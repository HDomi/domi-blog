import { Bodoni_Moda, Geist } from "next/font/google";

/** 본문 글꼴. 한글은 시스템 글꼴로 이어진다 (_root.scss 의 --font-sans 참고). */
export const bodyFont = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

/** 제목 글꼴: 대비가 큰 디도네 세리프. 이탤릭을 주로 쓴다. */
export const displayFont = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-bodoni",
});
