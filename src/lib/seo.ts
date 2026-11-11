import type { Metadata } from "next";
import { absoluteUrl, site } from "./site";

// 루트 app/opengraph-image. 페이지가 `openGraph` 를 지정하면 부모 이미지가 덮어써지므로
// 이 기본값으로 모든 페이지에 공유 이미지가 붙게 한다.
const DEFAULT_OG_IMAGE = "/opengraph-image";

type PageSeo = {
  title?: string;
  description?: string;
  path: string;
  images?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

/** 페이지별 metadata. canonical 과 OG/Twitter 값을 함께 맞춘다. */
export function pageMetadata({
  title,
  description = site.description,
  path,
  images = [DEFAULT_OG_IMAGE],
  type = "website",
  noIndex,
}: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: absoluteUrl(path),
      title: title ?? site.title,
      description,
      siteName: site.name,
      locale: site.locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? site.title,
      description,
      images,
    },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}
