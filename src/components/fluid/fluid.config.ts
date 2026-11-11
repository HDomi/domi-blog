/**
 * 유체 배경 조정값. 값만 두고 로직은 넣지 않는다.
 * 셰이더 상수는 컴파일 때 GLSL 에 그대로 박힌다 (shaders.ts 참고).
 */

/* ---------- 색 ---------- */

/** 유체 3색 + 펄 하이라이트. 위에 UI 글자가 없어서 라이트/다크 구분 없이 같은 팔레트. */
export const PALETTE = {
  ink: "#0e1118", // 미드나이트 (바탕)
  steel: "#1d3440", // 딥 페트롤 (중간층)
  accent: "#3a2636", // 다크 플럼 (사이사이 접혀 드는 색)
  flake: "#faf5eb", // 펄 입자 하이라이트
} as const;

/** 색끼리 섞이는 정도. 기준값은 노이즈 값 (~0–1) 기준. */
export const MIX = {
  /** 주 흐름장에서 ink → steel 로 넘어가는 구간. 낮출수록 steel 이 많아진다. */
  steelBand: [0.26, 0.46],
  /** 보조 흐름장에서 accent 가 섞이는 구간. 낮출수록 accent 가 많아진다. */
  accentBand: [0.44, 0.62],
  /** accent 흐름장을 만드는 두 워프 필드의 가중치. */
  accentField: [0.7, 0.5],
  /** 바탕 위 accent 의 최대 불투명도. */
  accentAmount: 0.85,
} as const;

/** 색이 접히는 자리의 가는 대리석 결. */
export const VEINS = {
  frequency: 16,
  warpFrequency: 5,
  sharpness: 14, // 높을수록 가늘다
  amount: 0.22,
  brightness: 1.25, // accent 색에 곱하는 배율
  /** 결은 ink→steel 구간 중 이 범위에서만 보인다. */
  mask: [0.2, 0.7],
} as const;

/* ---------- 무늬의 움직임 ---------- */

export const FLOW = {
  scale: 1.35, // 무늬 확대. 높을수록 덩어리가 작아진다
  speed: 0.045, // 흐르는 속도
  warpQ: 2.6, // 1차 도메인 워프 세기
  warpR: 2.2, // 2차 도메인 워프 세기
  /** 휘저은 변위가 무늬를 미는 정도. */
  stirWarp: 0.6,
  /** 시작 시점의 흐름 시간(초). 첫 프레임이 밋밋하지 않게 한다. */
  startTime: 7,
} as const;

/* ---------- 표면 ---------- */

export const SHADING = {
  normalStrength: 0.05, // 기울기 → 가짜 노멀 세기
  lightDir: [-0.4, 0.6, 1.0],
  diffuseBase: 0.9,
  diffuseAmount: 0.12,
  specPower: 18,
  specAmount: 0.05,
  /** 경사면에만 생기는 박막 무지갯빛. 0 이면 끔. */
  iridescence: 0.12,
} as const;

export const FLAKES = {
  cellsPerHeight: 120, // 격자 밀도 (화면 높이당 칸 수)
  density: 0.045, // 펄이 있는 칸의 비율
  size: 0.22, // 반지름 (칸 크기 기준)
  brightness: 0.35,
  twinkleSharpness: 6,
} as const;

export const VIGNETTE = {
  amount: 0.15,
  start: 0.4,
  end: 1.1,
} as const;

/* ---------- 마우스 붓 ---------- */

export const BRUSH = {
  /** 1배 폭일 때 가우시안 exp(-d²/R) 의 R. */
  baseRadius: 0.012,
  /** 기준 대비 붓 폭. 폭은 √R 에 비례하므로 R = baseRadius × widthRatio². */
  widthRatio: 0.3,
  forceScale: 0.9, // 마우스 속도 → 미는 힘
  maxForce: 3,
  /** 불규칙한 붓 자국: 노이즈 크기(붓 단위)와 테두리·세기·방향을 흔드는 정도. */
  noiseScale: 1.6,
  edgeMin: 0.55,
  edgeRange: 0.9,
  strengthMin: 0.6,
  strengthRange: 0.8,
  angleJitter: 2.2, // 방향 흔들림 전체 폭 (라디안)
  swirlMin: 0.15,
  swirlRange: 0.4,
} as const;

/* ---------- 시뮬레이션 ---------- */

export const SIM = {
  velDecayPer60: 0.94, // 속도는 빨리 사라진다
  dispDecayPer60: 0.992, // 휘저은 모양은 천천히 풀린다
  diffusion: 0.3,
  maxVelocity: 4,
  maxDisplacement: 1.5,
} as const;

/* ---------- 성능 ---------- */

export const PERF = {
  simLongSide: 192, // 상태 격자의 긴 변 칸 수
  baseRenderScale: 0.5, // 화면 렌더 배율: CSS px × 이 값 × min(dpr, maxDpr)
  maxDpr: 1.5,
  maxRenderPixels: 1.2e6,
  minRenderScale: 0.25,
  /** 자동 품질 조절: 프레임 시간 중간값이 이보다 느리면 렌더 배율을 낮춘다. */
  slowFrameMs: 22,
  sampleFrames: 90,
  downscaleStep: 0.75,
  maxDt: 1 / 30,
  resizeDebounceMs: 100,
  /** 지연 시작: 브라우저가 한가할 때까지 기다린다 (requestIdleCallback 이 없으면 이 시간 뒤). */
  idleTimeoutMs: 1500,
  idleFallbackMs: 200,
  /** 첫 프레임을 그린 뒤 캔버스 페이드인 시간. */
  fadeInMs: 800,
} as const;
