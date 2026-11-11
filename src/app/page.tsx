import { FluidBackground } from "@/components/fluid/FluidBackground";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <FluidBackground />
      {/* 아직 보이는 UI 는 없다. SEO·스크린 리더용으로만 둔다. */}
      <h1 className="sr-only">{site.title}</h1>
      <p className="sr-only">{site.description}</p>
    </>
  );
}
