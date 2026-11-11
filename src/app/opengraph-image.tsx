import { ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

/** 기본 OG 이미지. 자체 이미지가 없는 페이지는 pageMetadata 의 기본값으로 이걸 쓴다. */
export default function OpengraphImage() {
  return renderOg({ title: site.name, subtitle: site.author.jobTitle });
}
