import { D, DOT, LOGO, M, SEGMENT_RATIO, SIZE } from "./intro.config";

/**
 * 이동하는 stroke 하나: dash 한 개가 `d` 경로를 따라 미끄러진다.
 * dashoffset `from` → dash 가 경로 시작 바로 앞에 있다 (머리가 화면 끝)
 * dashoffset `to`   → dash 꼬리가 로고 부분 시작점에 있다. 진입선은 빠져나간 상태
 */
export type Stroke = {
  d: string;
  width: number;
  segLen: number;
  /** dash 간격: 경로 전체보다 길게 잡아 dash 가 반복되지 않게 한다. */
  gap: number;
  from: number;
  to: number;
};

export type Rect = { x: number; y: number; width: number; height: number };

export type IntroGeometry = {
  w: number;
  h: number;
  ring: [Stroke, Stroke];
  d: Stroke;
  /** D 그룹의 SVG transform (로고 좌표 → 화면). */
  dTransform: string;
  m: Stroke;
  /** M 그룹의 SVG transform (로고 좌표 → 화면). */
  mTransform: string;
  /** M stroke 를 자르는 사각형들 (M 로컬 좌표): 평평한 위아래 + 진입선 기둥. */
  mClip: Rect[];
  /** M 왼쪽 세로 획과 대각선이 위에서 붙는 자리를 메우는 조각 (M 로컬 좌표). */
  mWedge: Rect;
  /** i 점 (M 로컬 좌표). `rise` 는 점 중심에서 세로 획 꼭대기까지 거리. */
  dot: { cx: number; cy: number; r: number; rise: number };
};

/** 타원 둘레의 1/4 (라마누잔 근사). */
function quarterEllipse(rx: number, ry: number) {
  const h = (rx - ry) ** 2 / (rx + ry) ** 2;
  return (Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))) / 4;
}

function travelling(d: string, width: number, entryLen: number, partLen: number, ratio: number): Stroke {
  const segLen = partLen * ratio;
  return { d, width, segLen, gap: (entryLen + partLen) * 2, from: segLen, to: -entryLen };
}

/**
 * 화면 크기에 맞춘 로고 형태 (화면 중앙 배치). 순수 함수: 같은 입력이면 같은 결과.
 *
 * 링: 경로 두 개.
 *   왼쪽 끝 → 원 위쪽 → 오른쪽 반원 (시계 방향)
 *   오른쪽 끝 → 원 아래쪽 → 왼쪽 반원 (시계 방향)
 * D: 화면 위에서 ↓ 왼쪽 세로 획 → 아래 가로 획 → 모서리 ↑ 오른쪽 세로 획 → 모서리 ← 위 가로 획
 * M: 화면 아래에서 ↑ 오른쪽 세로 획 → V 내려감 → 올라감 → 왼쪽 세로 획 ↓
 */
export function computeGeometry(w: number, h: number): IntroGeometry {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(Math.min(w, h) * SIZE.radiusRatio, SIZE.maxRadius);
  const k = r / LOGO.r; // 로고 px → 화면 px

  /* 링 (화면 좌표) */
  const ringWidth = Math.max(1, LOGO.ringWidth * k);
  const lineLen = w / 2 + ringWidth;
  const arcLen = Math.PI * r;
  const ringStroke = (d: string) => travelling(d, ringWidth, lineLen, arcLen, SEGMENT_RATIO.ring);

  /* D (로컬 좌표: 원점은 로고 중심, x 는 늘림 배율로 나눔) */
  const sx = D.vWidth / D.hWidth;
  const X = (x: number) => (x - LOGO.cx) / sx;
  const Y = (y: number) => y - LOGO.cy;
  const rx = D.corner / sx;
  const ry = D.corner;

  const dEntryStart = -cy / k - D.hWidth; // 화면 위쪽 끝 바로 바깥
  const cornerX = X(D.rightX - D.corner);
  const p = {
    stemX: X(D.stemX),
    stemTop: Y(D.stemTop),
    bottomY: Y(D.bottomY),
    rightX: X(D.rightX),
    lowerArcEnd: Y(D.bottomY - D.corner),
    upperArcStart: Y(D.topY + D.corner),
    topY: Y(D.topY),
    leftEnd: X(D.leftEnd),
  };
  const dPath = [
    `M ${p.stemX} ${dEntryStart}`,
    `V ${p.stemTop}`,
    `V ${p.bottomY}`,
    `H ${cornerX}`,
    `A ${rx} ${ry} 0 0 0 ${p.rightX} ${p.lowerArcEnd}`,
    `V ${p.upperArcStart}`,
    `A ${rx} ${ry} 0 0 0 ${cornerX} ${p.topY}`,
    `H ${p.leftEnd}`,
  ].join(" ");
  const dEntryLen = p.stemTop - dEntryStart;
  const dLen =
    p.bottomY - p.stemTop + // 왼쪽 세로 획
    (cornerX - p.stemX) + // 아래 가로 획
    quarterEllipse(rx, ry) +
    (p.lowerArcEnd - p.upperArcStart) + // 오른쪽 세로 획
    quarterEllipse(rx, ry) +
    (cornerX - p.leftEnd); // 위 가로 획

  /* M (로컬 좌표: 원점은 로고 중심, 늘림 없음) */
  const mx = (x: number) => x - LOGO.cx;
  const my = (y: number) => y - LOGO.cy;
  const mEntryStart = (h - cy) / k + M.width; // 화면 아래쪽 끝 바로 바깥
  const mPath = [
    `M ${mx(M.rightX)} ${mEntryStart}`,
    `V ${my(M.bottom)}`,
    `V ${my(M.apexY)}`,
    `L ${mx(M.vertex.x)} ${my(M.vertex.y)}`,
    `L ${mx(M.leftX)} ${my(M.apexY)}`,
    `V ${my(M.bottom)}`,
  ].join(" ");
  const mEntryLen = mEntryStart - my(M.bottom);
  const stemLen = M.bottom - M.apexY;
  const mLen =
    stemLen +
    Math.hypot(M.rightX - M.vertex.x, M.vertex.y - M.apexY) +
    Math.hypot(M.vertex.x - M.leftX, M.vertex.y - M.apexY) +
    stemLen;
  const half = M.width / 2 + 0.5;

  return {
    w,
    h,
    ring: [
      ringStroke(`M ${-ringWidth} ${cy - r} H ${cx} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`),
      ringStroke(`M ${w + ringWidth} ${cy + r} H ${cx} A ${r} ${r} 0 0 1 ${cx} ${cy - r}`),
    ],
    d: travelling(dPath, D.hWidth, dEntryLen, dLen, SEGMENT_RATIO.letter),
    dTransform: `translate(${cx} ${cy}) scale(${k * sx} ${k})`,
    m: travelling(mPath, M.width, mEntryLen, mLen, SEGMENT_RATIO.letter),
    mTransform: `translate(${cx} ${cy}) scale(${k})`,
    mClip: [
      // 평평한 위아래 사이의 M 몸통
      {
        x: mx(M.leftX - M.clipPadX),
        y: my(M.top),
        width: M.rightX - M.leftX + M.clipPadX * 2,
        height: M.bottom - M.top,
      },
      // 오른쪽 세로 획 아래로 화면 끝까지 이어지는 진입선 기둥
      {
        x: mx(M.rightX) - half,
        y: my(M.bottom),
        width: half * 2,
        height: mEntryStart - my(M.bottom) + M.width,
      },
    ],
    mWedge: { ...M.wedge, x: mx(M.wedge.x), y: my(M.wedge.y) },
    dot: {
      cx: mx(M.rightX),
      cy: my(M.top - DOT.gap - DOT.r),
      r: DOT.r,
      rise: DOT.gap + DOT.r,
    },
  };
}
