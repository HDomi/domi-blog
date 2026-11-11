import { hexToUnit } from "@/lib/color";

/** GLSL float 리터럴 (항상 소수점을 붙인다). */
export const f = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));

/** 숫자 세 개로 GLSL vec3 를 만든다. */
export const vec3 = (x: number, y: number, z: number) => `vec3(${f(x)}, ${f(y)}, ${f(z)})`;

/** "#rrggbb" 색으로 GLSL vec3 를 만든다 (0–1 sRGB). */
export const hex3 = (hex: string) => vec3(...hexToUnit(hex));

/** 두 fragment 셰이더가 같이 쓰는 value noise. */
export const NOISE = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
`;
