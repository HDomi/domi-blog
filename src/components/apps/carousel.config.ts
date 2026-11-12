/** 개별 앱 3D 슬라이드 조정값. 값만 두고 로직은 넣지 않는다. */

export const CAROUSEL = {
  /** 가운데 기준 양옆으로 보이는 카드 수. 이보다 먼 카드는 숨긴다. */
  visibleSide: 2,
  /** 옆 카드가 안쪽으로 돌아가는 각도 (deg). */
  angle: 38,
  /** 한 칸 멀어질 때마다 뒤로 밀리는 깊이 (px). */
  depth: 140,
  /** 한 칸 멀어질 때마다 더해지는 어둡기 (0–1). 카드는 불투명하게 두고 어둡게만 눌러서 겹친 카드가 비치지 않게 한다. */
  dimPerStep: 0.3,
  /** 카드 사이 간격 (카드 폭 대비). */
  stepRatio: 0.72,
  /** 한 칸 멀어질 때마다 줄어드는 크기. */
  scalePerStep: 0.06,
  /** 전환 시간 (ms) 과 곡선. */
  transitionMs: 650,
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  /** 드래그로 넘어가는 최소 거리 (px). */
  swipeThreshold: 48,
  /** 드래그 중 카드가 따라오는 비율. */
  dragFollow: 0.5,
  /** 가로 휠(트랙패드) 한 번 넘김 후 다음 넘김까지 대기 (ms). */
  wheelCooldownMs: 450,
  /** 가로 휠 한 번으로 인정할 최소 이동량. */
  wheelThreshold: 24,
} as const;
