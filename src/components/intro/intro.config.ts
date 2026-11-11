/**
 * 인트로 조정값. 값만 두고 로직은 넣지 않는다.
 * 시간은 1배속 기준으로 적고 `TIMING.speed` 로 나눠서 쓴다 (introTimeline.ts 참고).
 */

/* ---------- 타이밍 ---------- */

export const TIMING = {
  /** 전체 재생 속도. 올리면 빨라진다. 아래 모든 시간에 적용된다. */
  speed: 1.25,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",

  /** 링: 두 선이 화면 끝에서 들어와 반원으로 말린다. */
  ringMs: 2400,
  /** D 와 M 은 링이 닫히기 이만큼 전에 같이 시작한다. */
  lettersLeadMs: 400,
  lettersMs: 1900,

  /** M 왼쪽 위 메움 조각은 글자 타임라인 끝부분에 나타난다 (lettersMs 비율). */
  wedgeFadeFrom: 0.75,
  wedgeEasing: "ease-out",

  /** i 점: 세로 획 꼭대기에서 튀어나와 살짝 커졌다가 자리 잡는다. */
  dot: {
    startAt: 0.85, // 글자 타임라인 기준 비율
    ms: 480,
    overshoot: 1.15,
    overshootAt: 0.6, // 오버슈트 키프레임 위치
    popEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
    settleEasing: "ease-in-out",
  },

  /** 다 그린 뒤: 잠깐 멈췄다가 오버레이를 페이드아웃한다. */
  holdMs: 350,
  fadeMs: 700,
  fadeEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/* ---------- 오버레이 ---------- */

export const OVERLAY = {
  /** 로고 색 (브랜드 색이라 라이트/다크 테마와 무관). */
  color: "#fff",
  /** 뒤 페이지를 덮는 dim. */
  dim: "rgb(0 0 0 / 0.6)",
  /** backdrop-filter 미지원일 때의 dim (블러가 없으니 더 진하게). */
  dimFallback: "rgb(0 0 0 / 0.85)",
  blurPx: 10,
  saturate: 1.2,
} as const;

/* ---------- 크기: 화면 짧은 변 기준 비율, 최대값 있음 ---------- */

export const SIZE = {
  radiusRatio: 0.22, // 링 반지름 / 화면 짧은 변
  maxRadius: 220, // px
} as const;

/**
 * 이동하는 선분은 자기가 될 부분보다 조금 길게 잡는다.
 * 그래야 머리가 이음새에서 딱 멈추지 않고 경로 끝을 지나간다.
 */
export const SEGMENT_RATIO = {
  ring: 1.06,
  letter: 1.02,
} as const;

/* ---------- 로고 형태: 300×300 원본 로고에서 잰 값 (px) ---------- */

export const LOGO = {
  cx: 149.5,
  cy: 149.5,
  r: 122.5, // 링 중심선 반지름
  ringWidth: 3,
} as const;

/**
 * D 중심선. 로고는 세로 획이 가로 획보다 두껍다.
 * 그래서 D 는 가로 획 두께로 그리고 그룹을 x 축으로 `vWidth / hWidth` 배 늘린다.
 * 그러면 세로 획(과 진입선)이 vWidth 두께로 나온다.
 */
export const D = {
  hWidth: 23.5, // 가로 획 두께
  vWidth: 27, // 세로 획 두께
  stemX: 63, // 왼쪽 세로 획 중심 (x 50–76)
  stemTop: 102, // 왼쪽 세로 획은 위 가로 획 아래 틈을 두고 시작
  bottomY: 172, // 아래 가로 획 중심 (y 161–183)
  rightX: 182, // 오른쪽 세로 획 중심 (x 169–195)
  topY: 70.5, // 위 가로 획 중심 (y 59–82)
  leftEnd: 50, // 위 가로 획 왼쪽 끝
  corner: 25, // 오른쪽 둥근 모서리 두 곳의 중심선 반지름
} as const;

/**
 * M 중심선: 오른쪽 세로 획, V, 왼쪽 세로 획. 아래에서 오른쪽 세로 획을 타고 올라오며 그린다.
 * 꼭짓점은 M 의 평평한 윗면보다 위에, V 의 뾰족한 끝은 평평한 바닥보다 아래에 있다.
 * `top`/`bottom` 에서 clip 으로 잘라 로고처럼 평평하게 만든다.
 */
export const M = {
  width: 13.5, // 획 두께
  leftX: 153.5, // 왼쪽 세로 획 중심 (x 147–160)
  rightX: 239.5, // 오른쪽 세로 획 중심 (x 233–246)
  top: 143,
  bottom: 220,
  apexY: 125, // 대각선이 세로 획과 만나는 높이 (`top` 위라 잘림)
  vertex: { x: 196.7, y: 217.6 }, // 두 대각선이 만나는 점
  /** 세로 획 바깥으로 clip 사각형에 주는 가로 여유. */
  clipPadX: 20,
  /**
   * 로고에서는 왼쪽 세로 획과 왼쪽 대각선 사이가 윗부분에서 꽉 차 있다.
   * stroke 로 그리면 그 자리에 틈이 남아서 사각형으로 메운다.
   */
  wedge: { x: 159.5, y: 148, width: 7.5, height: 15 },
} as const;

/**
 * i 점. M 의 오른쪽 세로 획이 i 의 세로 획을 겸한다.
 * 원본 점은 지름 약 23px, 세로 획 위로 6px, 중심이 2px 어긋나 있는데 여기서는 중앙에 맞춘다.
 */
export const DOT = {
  r: 11.5,
  gap: 6, // 점과 세로 획 꼭대기 사이 간격
} as const;
