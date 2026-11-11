"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { OVERLAY } from "./intro.config";
import { computeGeometry, type Stroke } from "./introGeometry";
import { TIMELINE } from "./introTimeline";
import styles from "./Intro.module.scss";

type Phase = "draw" | "leaving" | "done";

// 화면 크기를 외부 store 로 읽는다. 서버(와 hydration)에서는 null 이고,
// 클라이언트는 resize 때 다시 렌더해서 형태를 새로 계산한다.
const subscribeResize = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const getViewport = () => `${window.innerWidth}x${window.innerHeight}`;
const getServerViewport = () => null;

// 오버레이 모양과 퇴장 타이밍을 CSS 변수로 스타일시트에 넘긴다 (값의 출처는 intro.config 하나).
const overlayVars = {
  "--intro-color": OVERLAY.color,
  "--intro-dim": OVERLAY.dim,
  "--intro-dim-fallback": OVERLAY.dimFallback,
  "--intro-blur": `${OVERLAY.blurPx}px`,
  "--intro-saturate": OVERLAY.saturate,
  "--intro-hold": `${TIMELINE.exit.hold}ms`,
  "--intro-fade": `${TIMELINE.exit.fade}ms`,
  "--intro-fade-easing": TIMELINE.exit.easing,
} as React.CSSProperties;

export function Intro() {
  const [phase, setPhase] = useState<Phase>("draw");
  const viewport = useSyncExternalStore(subscribeResize, getViewport, getServerViewport);
  const geo = useMemo(() => {
    if (!viewport) return null;
    const [w, h] = viewport.split("x").map(Number);
    return computeGeometry(w, h);
  }, [viewport]);

  const mClipId = `intro-m-clip-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const wedgeRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  // resize 해도 처음부터 다시 하지 않고 이어지도록 진행 시간을 기억한다.
  const elapsedRef = useRef(0);

  // Web Animations 에 px 숫자를 직접 넣는다. Chrome 은 CSS 키프레임의 var()/calc() 를 보간하지 못한다.
  useEffect(() => {
    if (!geo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timing = (t: { delay: number; duration: number }, easing?: string): KeyframeAnimationOptions => ({
      delay: reduce ? 0 : t.delay,
      duration: reduce ? 1 : t.duration,
      easing,
      fill: "both",
    });

    const strokes: [Stroke, { delay: number; duration: number }][] = [
      [geo.ring[0], TIMELINE.ring],
      [geo.ring[1], TIMELINE.ring],
      [geo.d, TIMELINE.letters],
      [geo.m, TIMELINE.letters],
    ];
    const animations: Animation[] = [];

    strokes.forEach(([s, t], i) => {
      const el = pathRefs.current[i];
      if (!el) return;
      animations.push(
        el.animate(
          [{ strokeDashoffset: `${s.from}px` }, { strokeDashoffset: `${s.to}px` }],
          timing(t, TIMELINE.easing),
        ),
      );
    });

    if (wedgeRef.current) {
      animations.push(
        wedgeRef.current.animate([{ opacity: 0 }, { opacity: 1 }], timing(TIMELINE.wedge, TIMELINE.wedge.easing)),
      );
    }

    if (dotRef.current) {
      const { dot } = TIMELINE;
      animations.push(
        dotRef.current.animate(
          [
            { transform: `translateY(${geo.dot.rise}px) scale(0)`, easing: dot.popEasing },
            { transform: `translateY(0) scale(${dot.overshoot})`, offset: dot.overshootAt, easing: dot.settleEasing },
            { transform: "translateY(0) scale(1)" },
          ],
          timing(dot),
        ),
      );
    }

    animations.forEach((a) => (a.currentTime = elapsedRef.current));

    let cancelled = false;
    Promise.all(animations.map((a) => a.finished))
      .then(() => !cancelled && setPhase("leaving"))
      .catch(() => {}); // resize/unmount 로 취소된 경우

    return () => {
      cancelled = true;
      // 끝난 애니메이션은 끝 시간에 멈춰 있으니 가장 많이 진행된 값을 쓴다.
      elapsedRef.current = Math.max(0, ...animations.map((a) => Number(a.currentTime ?? 0)));
      animations.forEach((a) => a.cancel());
    };
  }, [geo]);

  // 인트로가 화면을 덮는 동안 스크롤을 막는다.
  useEffect(() => {
    if (phase === "done") return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (phase === "leaving" && e.target === e.currentTarget) setPhase("done");
  };

  const renderStroke = (s: Stroke, i: number, className: string, clipPath?: string) => (
    <path
      key={i}
      ref={(el) => {
        pathRefs.current[i] = el;
      }}
      className={className}
      d={s.d}
      strokeWidth={s.width}
      strokeDasharray={`${s.segLen} ${s.gap}`}
      strokeDashoffset={s.from}
      clipPath={clipPath}
    />
  );

  return (
    <div
      className={`${styles.intro} ${phase === "leaving" ? styles.leaving : ""}`}
      style={overlayVars}
      data-intro
      aria-hidden="true"
      onAnimationEnd={handleAnimationEnd}
    >
      {geo && (
        <svg className={styles.svg} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
          {geo.ring.map((s, i) => renderStroke(s, i, styles.ring))}
          <g transform={geo.dTransform}>{renderStroke(geo.d, 2, styles.letter)}</g>
          <g transform={geo.mTransform}>
            <clipPath id={mClipId}>
              {geo.mClip.map((r, i) => (
                <rect key={i} {...r} />
              ))}
            </clipPath>
            {renderStroke(geo.m, 3, styles.letter, `url(#${mClipId})`)}
            <rect ref={wedgeRef} {...geo.mWedge} fill="currentColor" opacity={0} />
            <circle ref={dotRef} className={styles.dot} cx={geo.dot.cx} cy={geo.dot.cy} r={geo.dot.r} />
          </g>
        </svg>
      )}
    </div>
  );
}
