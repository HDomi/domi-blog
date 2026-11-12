"use client";

import { useCallback, useRef, useState } from "react";
import type { Solo } from "@/content/apps";
import { AppLink } from "./AppLink";
import { CAROUSEL } from "./carousel.config";
import { SectionHeading } from "./SectionHeading";
import styles from "./SoloCarousel.module.scss";

/** 가운데(active)에서 i 번째 카드까지의 원형 거리. 음수는 왼쪽, 양수는 오른쪽. */
function circularOffset(i: number, active: number, n: number) {
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

// 조정값을 CSS 변수로 넘긴다 (출처는 carousel.config 하나).
const stageVars = {
  "--angle": `${CAROUSEL.angle}deg`,
  "--depth": `${CAROUSEL.depth}px`,
  "--dim": CAROUSEL.dimPerStep,
  "--step-ratio": CAROUSEL.stepRatio,
  "--scale-step": CAROUSEL.scalePerStep,
  "--transition": `${CAROUSEL.transitionMs}ms`,
  "--easing": CAROUSEL.easing,
  "--follow": CAROUSEL.dragFollow,
} as React.CSSProperties;

/**
 * 개별 앱 3D 슬라이드.
 * 가운데 카드만 아래에 설명이 나오고, 드래그·화살표 키·가로 휠·버튼으로 넘긴다. 양끝은 이어진다.
 * 옆 카드를 누르면 가운데로 오고, 가운데 카드를 누르면 링크를 연다.
 */
export function SoloCarousel({ solos }: { solos: Solo[] }) {
  const [active, setActive] = useState(0);
  const n = solos.length;
  const current = solos[active];

  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, startX: 0, dx: 0, moved: false });
  const lastWheel = useRef(0);

  const go = useCallback((step: number) => setActive((a) => (((a + step) % n) + n) % n), [n]);

  const setDragVar = (px: number) => stageRef.current?.style.setProperty("--drag", `${px}px`);

  /* ---------- 드래그 ---------- */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, startX: e.clientX, dx: 0, moved: false };
    stageRef.current?.setAttribute("data-dragging", "");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(d.dx) > 6) {
      d.moved = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.moved) setDragVar(d.dx);
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    if (Math.abs(d.dx) > CAROUSEL.swipeThreshold) go(d.dx < 0 ? 1 : -1);
    d.id = -1;
    setDragVar(0);
    stageRef.current?.removeAttribute("data-dragging");
  };

  /* ---------- 키보드·휠 ---------- */

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < CAROUSEL.wheelThreshold) return;
    const now = performance.now();
    if (now - lastWheel.current < CAROUSEL.wheelCooldownMs) return;
    lastWheel.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  };

  /* ---------- 카드 ---------- */

  const onCardClick = (i: number, solo: Solo) => {
    if (drag.current.moved) {
      drag.current.moved = false; // 드래그 끝의 클릭은 무시
      return;
    }
    if (i !== active) setActive(i);
    else if (solo.href) window.open(solo.href, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.section} aria-labelledby="solos-title">
      <SectionHeading id="solos-title" title="Solos" lead="서로 이어지지 않은, 각자 따로 만든 앱과 게임." />

      <div
        ref={stageRef}
        className={styles.stage}
        style={stageVars}
        role="region"
        aria-roledescription="carousel"
        aria-label="개별 앱 목록. 좌우 화살표 키로 넘긴다."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <ul className={styles.track} role="list">
          {solos.map((solo, i) => {
            const d = circularOffset(i, active, n);
            const ad = Math.abs(d);
            const hidden = ad > CAROUSEL.visibleSide;
            return (
              <li
                key={solo.id}
                className={styles.slot}
                style={
                  {
                    "--d": d,
                    "--ad": Math.min(ad, CAROUSEL.visibleSide + 1),
                    "--dir": Math.sign(d),
                    zIndex: 10 - ad,
                  } as React.CSSProperties
                }
                data-active={i === active || undefined}
                data-hidden={hidden || undefined}
                aria-hidden={hidden || undefined}
              >
                <button
                  type="button"
                  className={styles.card}
                  style={{ "--c0": solo.cover[0], "--c1": solo.cover[1] } as React.CSSProperties}
                  onClick={() => onCardClick(i, solo)}
                  tabIndex={i === active ? 0 : -1}
                  aria-current={i === active || undefined}
                  aria-label={i === active ? `${solo.name} 열기` : `${solo.name} 보기`}
                >
                  <span className={styles.initial} aria-hidden="true">
                    {solo.name[0]}
                  </span>
                  <span className={styles.kind}>{solo.kind}</span>
                  <span className={styles.cardName}>{solo.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 가운데 카드 설명. key 로 바뀔 때마다 짧게 나타난다. */}
      <div className={styles.caption} aria-live="polite">
        <div key={current.id} className={styles.captionInner}>
          <p className={styles.captionMeta}>
            {current.kind}
            <span className={styles.counter}>
              {active + 1} / {n}
            </span>
          </p>
          <h3 className={styles.captionName}>{current.name}</h3>
          <p className={styles.captionSummary}>{current.summary}</p>
          <AppLink href={current.href} label={`${current.name} 열기`} />
        </div>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="이전 앱">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <div className={styles.dots}>
          {solos.map((solo, i) => (
            <button
              key={solo.id}
              type="button"
              className={styles.dot}
              aria-label={`${solo.name} 보기`}
              aria-current={i === active || undefined}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="다음 앱">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
