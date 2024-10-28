import hljs from "highlight.js";

export const highlighter = (code: any, codeType: any) => {
  const changeMd = hljs.highlight(code, { language: codeType }).value;
  return changeMd;
};

export const postCodeHighlighter = (postContent: any, type: string) => {
  let converted = postContent.replaceAll("&gt;", ">").replaceAll("&lt;", "<");
  let startIndex = 0;
  while ((startIndex = converted.indexOf("<code", startIndex)) !== -1) {
    const endIndex = converted.indexOf("</code>", startIndex);
    if (endIndex !== -1) {
      const preTag = converted.substring(
        startIndex,
        endIndex + "</code>".length
      );
      const highlightedPreTag = highlighter(preTag, type);
      converted = converted
        .replace(preTag, highlightedPreTag)
        .replaceAll("&lt;br&gt;", "")
        .replaceAll("&lt;code&gt;", "")
        .replaceAll("&lt;/code&gt;", "");
      startIndex = endIndex + highlightedPreTag.length;
    } else {
      break;
    }
  }
  return converted;
};
export default postCodeHighlighter;
