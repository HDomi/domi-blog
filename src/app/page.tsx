import { SoloCarousel } from "@/components/apps/SoloCarousel";
import { SuiteSection } from "@/components/apps/SuiteSection";
import { FluidBackground } from "@/components/fluid/FluidBackground";
import { SOLOS, SUITES } from "@/content/apps";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import styles from "./page.module.scss";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <FluidBackground />
      {/* 사이트 제목·설명은 SEO·스크린 리더용으로만 둔다. */}
      <h1 className="sr-only">{site.title}</h1>
      <p className="sr-only">{site.description}</p>

      <div className={styles.content}>
        <SuiteSection suites={SUITES} />
        <SoloCarousel solos={SOLOS} />
      </div>
    </>
  );
}
