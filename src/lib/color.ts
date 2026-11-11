/** "#rrggbb" / "#rgb" → [r, g, b] (0–255). */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "#rrggbb" → [r, g, b] (0–1, sRGB 값 그대로. 선형 변환 안 함). */
export function hexToUnit(hex: string): [number, number, number] {
  return hexToRgb(hex).map((c) => c / 255) as [number, number, number];
}

/** "#rrggbb" + alpha → "rgb(r g b / a)". */
export function hexToRgba(hex: string, alpha: number) {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
