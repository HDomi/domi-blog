import { TIMING } from "./intro.config";

/** TIMING 에 전체 속도를 적용한 절대 타임라인 (ms). */
export function buildTimeline(t: typeof TIMING = TIMING) {
  const s = (ms: number) => ms / t.speed;

  const ringMs = s(t.ringMs);
  const lettersStart = ringMs - s(t.lettersLeadMs);
  const lettersMs = s(t.lettersMs);

  return {
    easing: t.easing,
    ring: { delay: 0, duration: ringMs },
    letters: { delay: lettersStart, duration: lettersMs },
    wedge: {
      delay: lettersStart + lettersMs * t.wedgeFadeFrom,
      duration: lettersMs * (1 - t.wedgeFadeFrom),
      easing: t.wedgeEasing,
    },
    dot: {
      delay: lettersStart + lettersMs * t.dot.startAt,
      duration: s(t.dot.ms),
      overshoot: t.dot.overshoot,
      overshootAt: t.dot.overshootAt,
      popEasing: t.dot.popEasing,
      settleEasing: t.dot.settleEasing,
    },
    exit: { hold: s(t.holdMs), fade: s(t.fadeMs), easing: t.fadeEasing },
  };
}

export type Timeline = ReturnType<typeof buildTimeline>;

export const TIMELINE = buildTimeline();
