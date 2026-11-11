type JsonLdProps = { data: Record<string, unknown> | Record<string, unknown>[] };

/** schema.org 구조화 데이터를 렌더한다. script 태그가 깨지지 않게 `<` 는 이스케이프한다. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
