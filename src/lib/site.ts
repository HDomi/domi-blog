/**
 * 사이트 정체성의 단일 출처.
 * SEO 관련 모든 곳(metadata, OG, sitemap, robots, JSON-LD)이 여기서 값을 읽는다.
 */
export const site = {
  name: "domi",
  title: "domi — Product Engineer",
  description:
    "Product Engineer 도미의 포트폴리오. 웹, 어드민, 게임까지 직접 기획하고 만든 프로젝트 케이스 스터디.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:1133").replace(/\/$/, ""),
  locale: "ko_KR",
  lang: "ko",
  author: {
    name: "domi",
    jobTitle: "Product Engineer",
    // TODO: 실제 프로필 링크 채우기.
    sameAs: [] as string[],
  },
  email: "",
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
