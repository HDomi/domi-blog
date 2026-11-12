import styles from "./SectionHeading.module.scss";

type Props = {
  id: string;
  title: string;
  /** 섹션이 무엇을 담는지 한 줄로. */
  lead: string;
};

/** 섹션 제목 + 한 줄 설명. 제목 id 는 섹션의 aria-labelledby 에 쓴다. */
export function SectionHeading({ id, title, lead }: Props) {
  return (
    <header className={styles.heading}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      <p className={styles.lead}>{lead}</p>
    </header>
  );
}
