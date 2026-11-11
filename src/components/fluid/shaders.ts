import { BRUSH, FLAKES, FLOW, MIX, PALETTE, SHADING, SIM, VEINS, VIGNETTE } from "./fluid.config";
import { f, hex3, NOISE, vec3 } from "./glsl";

/** 화면을 덮는 삼각형 하나. gl_VertexID 를 써서 vertex buffer 가 필요 없다. */
export const VERT = /* glsl */ `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
out vec2 vUv;
void main() {
  vec2 p = P[gl_VertexID];
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

/**
 * 저해상도 상태 갱신. 한 패스에서 전부 처리한다:
 *   rg = 속도 (uv/초), ba = 누적 변위 (uv)
 * - 상태 전체를 semi-Lagrangian 방식으로 이류
 * - 부드럽게 하려고 약간 확산
 * - 마우스 붓: 노이즈로 테두리·세기·미는 방향이 흔들리는 불규칙한 붓
 * - 감쇠: 속도는 빨리 사라지고 변위는 천천히 풀린다 (휘저은 흔적이 남는다)
 * 매 프레임 값(dt, 감쇠, 마우스)은 uniform 이고 조정값은 fluid.config 에서 온다.
 */
export const SIM_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDt;
uniform float uVelDecay;
uniform float uDispDecay;
uniform vec2 uPoint;
uniform vec2 uForce;
uniform float uRadius;
uniform float uAspect;
uniform float uTime;

const float DIFFUSION = ${f(SIM.diffusion)};
const float MAX_VEL = ${f(SIM.maxVelocity)};
const float MAX_DISP = ${f(SIM.maxDisplacement)};
const float NOISE_SCALE = ${f(BRUSH.noiseScale)};
const float EDGE_MIN = ${f(BRUSH.edgeMin)};
const float EDGE_RANGE = ${f(BRUSH.edgeRange)};
const float STRENGTH_MIN = ${f(BRUSH.strengthMin)};
const float STRENGTH_RANGE = ${f(BRUSH.strengthRange)};
const float ANGLE_JITTER = ${f(BRUSH.angleJitter)};
const float SWIRL_MIN = ${f(BRUSH.swirlMin)};
const float SWIRL_RANGE = ${f(BRUSH.swirlRange)};
${NOISE}
void main() {
  vec4 s = texture(uState, vUv);
  vec2 back = vUv - uDt * s.xy;
  vec4 a = texture(uState, back);
  vec4 n = texture(uState, back + vec2(uTexel.x, 0.0)) + texture(uState, back - vec2(uTexel.x, 0.0))
         + texture(uState, back + vec2(0.0, uTexel.y)) + texture(uState, back - vec2(0.0, uTexel.y));
  a = mix(a, n * 0.25, DIFFUSION);

  vec2 d = vUv - uPoint;
  d.x *= uAspect;
  float rr = sqrt(uRadius);

  // 불규칙한 붓: 붓 크기 단위로 시간에 따라 흐르는 노이즈가 감쇠 모양을 비틀어
  // 자국이 원이 아니라 들쭉날쭉한 얼룩이 되고, 미는 방향도 흔들린다.
  vec2 bp = d / rr * NOISE_SCALE;
  float n1 = noise(bp + vec2(uTime * 1.7, -uTime * 1.3));
  float n2 = noise(bp * 2.3 - vec2(uTime * 2.1, uTime * 0.7) + 17.0);
  float edge = EDGE_MIN + EDGE_RANGE * (0.65 * n1 + 0.35 * n2);
  float g = exp(-dot(d, d) / (uRadius * edge * edge));
  g *= STRENGTH_MIN + STRENGTH_RANGE * n2;

  float ang = (n1 - 0.5) * ANGLE_JITTER;
  vec2 force = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * uForce;
  vec2 swirl = vec2(-d.y, d.x) / rr * length(uForce) * (SWIRL_MIN + SWIRL_RANGE * n2);

  vec2 vel = a.xy * uVelDecay + (force + swirl) * g;
  vec2 disp = a.zw * uDispDecay + vel * uDt;
  o = vec4(clamp(vel, -MAX_VEL, MAX_VEL), clamp(disp, -MAX_DISP, MAX_DISP));
}
`;

/**
 * 대리석처럼 섞이는 유체: 도메인 워프 fbm 을 휘저은 상태만큼 밀고, 3색 팔레트와 가는 결로 칠한다.
 * 가짜 노멀로 새틴 광택을 주고, 무지갯빛을 살짝 넣고, 같은 흐름을 타는 펄 입자를 드문드문 뿌린다.
 */
export const DISPLAY_FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uState;
uniform float uTime;
uniform vec2 uRes;

// 팔레트
const vec3 INK = ${hex3(PALETTE.ink)};
const vec3 STEEL = ${hex3(PALETTE.steel)};
const vec3 ACCENT = ${hex3(PALETTE.accent)};
const vec3 FLAKE = ${hex3(PALETTE.flake)};
// 흐름
const float FLOW_SCALE = ${f(FLOW.scale)};
const float FLOW_SPEED = ${f(FLOW.speed)};
const float WARP_Q = ${f(FLOW.warpQ)};
const float WARP_R = ${f(FLOW.warpR)};
const float STIR_WARP = ${f(FLOW.stirWarp)};
// 섞임
const vec2 STEEL_BAND = vec2(${f(MIX.steelBand[0])}, ${f(MIX.steelBand[1])});
const vec2 ACCENT_BAND = vec2(${f(MIX.accentBand[0])}, ${f(MIX.accentBand[1])});
const vec2 ACCENT_FIELD = vec2(${f(MIX.accentField[0])}, ${f(MIX.accentField[1])});
const float ACCENT_AMOUNT = ${f(MIX.accentAmount)};
// 결
const float VEIN_FREQ = ${f(VEINS.frequency)};
const float VEIN_WARP_FREQ = ${f(VEINS.warpFrequency)};
const float VEIN_SHARPNESS = ${f(VEINS.sharpness)};
const float VEIN_AMOUNT = ${f(VEINS.amount)};
const float VEIN_BRIGHTNESS = ${f(VEINS.brightness)};
const vec2 VEIN_MASK = vec2(${f(VEINS.mask[0])}, ${f(VEINS.mask[1])});
// 광택
const float NORMAL_STRENGTH = ${f(SHADING.normalStrength)};
const vec3 LIGHT_DIR = ${vec3(SHADING.lightDir[0], SHADING.lightDir[1], SHADING.lightDir[2])};
const float DIFFUSE_BASE = ${f(SHADING.diffuseBase)};
const float DIFFUSE_AMOUNT = ${f(SHADING.diffuseAmount)};
const float SPEC_POWER = ${f(SHADING.specPower)};
const float SPEC_AMOUNT = ${f(SHADING.specAmount)};
const float IRIDESCENCE = ${f(SHADING.iridescence)};
// 펄 입자
const float FLAKE_CELLS = ${f(FLAKES.cellsPerHeight)};
const float FLAKE_THRESHOLD = ${f(1 - FLAKES.density)};
const float FLAKE_SIZE = ${f(FLAKES.size)};
const float FLAKE_BRIGHTNESS = ${f(FLAKES.brightness)};
const float FLAKE_TWINKLE = ${f(FLAKES.twinkleSharpness)};
// 비네트
const float VIGNETTE = ${f(VIGNETTE.amount)};
const vec2 VIGNETTE_RANGE = vec2(${f(VIGNETTE.start)}, ${f(VIGNETTE.end)});
${NOISE}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = r * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec4 s = texture(uState, vUv);
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv - s.zw * STIR_WARP;
  vec2 p = vec2(uv.x * aspect, uv.y) * FLOW_SCALE;
  float t = uTime * FLOW_SPEED;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + WARP_Q * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p + WARP_Q * q + vec2(8.3, 2.8) - t * 0.9));
  float fl = fbm(p + WARP_R * r);

  // 화면 공간 기울기로 만든 가짜 노멀 (해상도와 무관).
  vec2 grad = vec2(dFdx(fl), dFdy(fl)) * uRes.y * NORMAL_STRENGTH;
  vec3 n = normalize(vec3(-grad, 1.0));
  vec3 L = normalize(LIGHT_DIR);
  float diff = clamp(dot(n, L), 0.0, 1.0);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), SPEC_POWER);
  float rim = 1.0 - n.z;

  // 3색 대리석.
  float m1 = smoothstep(STEEL_BAND.x, STEEL_BAND.y, fl);
  float m2 = smoothstep(ACCENT_BAND.x, ACCENT_BAND.y, r.x * ACCENT_FIELD.x + q.y * ACCENT_FIELD.y);
  vec3 col = mix(INK, STEEL, m1);
  col = mix(col, ACCENT, m2 * ACCENT_AMOUNT);
  float vein = pow(1.0 - abs(sin(fl * VEIN_FREQ + r.y * VEIN_WARP_FREQ)), VEIN_SHARPNESS)
             * smoothstep(VEIN_MASK.x, VEIN_MASK.y, m1);
  col = mix(col, ACCENT * VEIN_BRIGHTNESS, vein * VEIN_AMOUNT);

  // 새틴 광택 + 경사면에만 아주 약한 무지갯빛.
  col *= DIFFUSE_BASE + DIFFUSE_AMOUNT * diff;
  float phase = fl * 2.2 + r.x * 1.4 + rim * 2.5 + t * 0.6;
  vec3 iri = 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.33, 0.67)));
  col = mix(col, col * (0.85 + 0.3 * iri), IRIDESCENCE * rim);
  col += spec * SPEC_AMOUNT;

  // 흐름을 타고 움직이는 드문드문한 펄 입자.
  vec2 gp = vec2(uv.x * aspect, uv.y) * FLAKE_CELLS;
  vec2 cell = floor(gp);
  vec2 fr = fract(gp) - 0.5;
  float h = hash(cell);
  vec2 off = (vec2(hash(cell + 7.1), hash(cell + 3.3)) - 0.5) * 0.6;
  float tw = pow(0.5 + 0.5 * sin(uTime * (1.2 + h * 2.5) + h * 40.0), FLAKE_TWINKLE);
  float flake = step(FLAKE_THRESHOLD, h) * tw * smoothstep(FLAKE_SIZE, 0.0, length(fr - off));
  col = mix(col, FLAKE, flake * FLAKE_BRIGHTNESS);

  col *= mix(1.0, 1.0 - VIGNETTE, smoothstep(VIGNETTE_RANGE.x, VIGNETTE_RANGE.y, length(vUv - 0.5) * 1.6));
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0; // 디더링: 색 띠(banding) 방지
  o = vec4(col, 1.0);
}
`;
