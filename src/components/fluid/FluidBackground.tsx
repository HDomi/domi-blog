"use client";

import { useEffect, useRef, useState } from "react";
import { hexToRgba } from "@/lib/color";
import { PALETTE, PERF } from "./fluid.config";
import type { FluidHandle } from "./fluidEngine";
import styles from "./FluidBackground.module.scss";

// 대체 배경 (WebGL 로딩 전 / 미지원) 색. 셰이더와 같은 팔레트에서 가져온다.
const fallbackVars = {
  "--fluid-ink": PALETTE.ink,
  "--fluid-steel": hexToRgba(PALETTE.steel, 0.9),
  "--fluid-accent": hexToRgba(PALETTE.accent, 0.6),
  "--fluid-fade-in": `${PERF.fadeInMs}ms`,
} as React.CSSProperties;

/**
 * 마우스로 휘저을 수 있는 대리석 유체 배경 (WebGL2).
 * - 엔진은 브라우저가 한가할 때 지연 로딩해서 hydration·첫 화면과 경쟁하지 않는다.
 *   첫 프레임 전까지는 CSS 그라디언트가 보인다.
 * - 페이지 뒤에 고정되고, 마우스 이벤트는 window 에서 읽어서 위 콘텐츠는 그대로 클릭된다.
 */
export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let handle: FluidHandle | null = null;
    let cancelled = false;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = async () => {
      const { createFluid } = await import("./fluidEngine");
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      handle = createFluid(canvas, {
        reducedMotion: reduceMq.matches,
        onFirstFrame: () => !cancelled && setReady(true),
      });
    };

    // Safari 에는 requestIdleCallback 이 없다.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => void start(), { timeout: PERF.idleTimeoutMs })
      : setTimeout(() => void start(), PERF.idleFallbackMs);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      handle?.destroy();
    };
  }, []);

  return (
    <div className={styles.root} style={fallbackVars} aria-hidden="true">
      <canvas ref={canvasRef} className={`${styles.canvas} ${ready ? styles.ready : ""}`} />
    </div>
  );
}
