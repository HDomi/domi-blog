"use client";

import { useEffect, useState } from "react";
import type { Suite } from "@/content/apps";
import { AppIconTile } from "./AppIconTile";
import { AppLink } from "./AppLink";
import { SectionHeading } from "./SectionHeading";
import styles from "./SuiteSection.module.scss";

/**
 * 묶음 앱 섹션: Finder 아이콘 보기처럼 아이콘 아래 이름만 두고, 아이콘을 누르면
 * 오른쪽에서 설명 패널이 밀고 나온다. 같은 아이콘을 다시 누르거나 Esc 를 누르면 닫힌다.
 */
export function SuiteSection({ suites }: { suites: Suite[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 닫히는 동안에도 내용이 남아 있도록 마지막으로 연 묶음을 기억한다
  const [shownId, setShownId] = useState<string | null>(null);
  const shown = suites.find((suite) => suite.id === shownId) ?? null;

  const toggle = (id: string) => {
    if (id === selectedId) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
    setShownId(id);
  };

  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  return (
    <section className={styles.section} aria-labelledby="suites-title">
      <SectionHeading id="suites-title" title="Suites" lead="하나의 컨셉 아래 함께 쓰도록 만든 도구 모음." />

      <div className={`${styles.window} ${selectedId ? styles.open : ""}`}>
        <ul className={styles.grid} role="list">
          {suites.map((suite) => {
            const isSelected = suite.id === selectedId;
            return (
              <li key={suite.id}>
                <button
                  type="button"
                  className={`${styles.item} ${isSelected ? styles.selected : ""}`}
                  aria-pressed={isSelected}
                  aria-controls="suite-detail"
                  onClick={() => toggle(suite.id)}
                >
                  <span className={styles.iconWrap}>
                    <AppIconTile icon={suite.icon} name={suite.name} size={160} />
                  </span>
                  <span className={styles.label}>{suite.name}</span>
                </button>
              </li>
            );
          })}

          {/* 다음 묶음 자리 */}
          <li className={styles.slot} aria-label="다음 묶음 자리">
            <span className={styles.ghostIcon} aria-hidden="true" />
            <span className={styles.slotLabel}>다음 묶음</span>
          </li>
        </ul>

        {/* 설명 패널: 열린 묶음이 없으면 폭이 0 으로 접힌다 */}
        <aside id="suite-detail" className={styles.detail} aria-live="polite" aria-hidden={!selectedId} inert={!selectedId}>
          {shown && (
            <div key={shown.id} className={styles.detailInner} style={{ "--tint": shown.tint } as React.CSSProperties}>
              <span className={styles.detailIcon}>
                <AppIconTile icon={shown.icon} name={shown.name} size={160} />
              </span>
              <h3 className={styles.name}>{shown.name}</h3>
              <p className={styles.concept}>{shown.concept}</p>
              <p className={styles.description}>{shown.description}</p>
              <ul className={styles.tools} role="list" aria-label={`${shown.name} 구성`}>
                {shown.tools.map((tool) => (
                  <li key={tool.name}>
                    <strong>{tool.name}</strong>
                    <span>{tool.summary}</span>
                  </li>
                ))}
              </ul>
              <AppLink href={shown.href} label={`${shown.name} 저장소 열기`} className={styles.link} />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
