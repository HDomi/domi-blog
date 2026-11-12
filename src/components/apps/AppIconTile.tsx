import Image from "next/image";
import type { AppIcon } from "@/content/apps";
import styles from "./AppIconTile.module.scss";

type Props = {
  icon: AppIcon;
  name: string;
  /** 렌더할 최대 크기 (px). 실제 크기는 부모가 CSS 로 정한다. */
  size: number;
  priority?: boolean;
  className?: string;
};

/**
 * 앱 아이콘 타일. 모서리를 둥글게 잘라 아이콘마다 다른 모서리 처리를 맞춘다.
 * 아이콘 파일이 없으면 이름 첫 글자로 자리 표시 아이콘을 그린다.
 */
export function AppIconTile({ icon, name, size, priority, className }: Props) {
  return (
    <span
      className={`${styles.tile} ${icon.src ? "" : styles.placeholder} ${className ?? ""}`}
      style={{ "--tone": icon.tone, "--icon-scale": icon.scale ?? 1 } as React.CSSProperties}
    >
      {icon.src ? (
        <Image className={styles.image} src={icon.src} alt="" width={size} height={size} priority={priority} draggable={false} />
      ) : (
        <span className={styles.monogram} aria-hidden="true">
          {name[0]}
        </span>
      )}
    </span>
  );
}
