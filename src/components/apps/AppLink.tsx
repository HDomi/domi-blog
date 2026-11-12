import styles from "./AppLink.module.scss";

type Props = {
  href?: string;
  label: string;
  className?: string;
};

/** 외부 링크. 주소가 아직 없으면 눌리지 않는 "링크 준비 중" 표시로 바뀐다. */
export function AppLink({ href, label, className }: Props) {
  if (!href) {
    return <span className={`${styles.link} ${styles.pending} ${className ?? ""}`}>링크 준비 중</span>;
  }
  return (
    <a className={`${styles.link} ${className ?? ""}`} href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
