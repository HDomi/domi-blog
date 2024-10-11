"use client";
import { Editor } from "@toast-ui/react-editor";
import { MutableRefObject, useEffect, useState } from "react";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";

const toolbarItems = [
  ["heading", "bold", "italic", "strike"],
  ["hr"],
  ["ul", "ol", "task"],
  ["table", "link"],
  ["image"],
  ["code", "codeblock"],
  ["scrollSync"],
];

interface Props {
  editorRef: React.RefObject<any>;
  initialValue?: string; // 글수정 시 필요
  setContents: (content: string) => void;
}

export const MyEditor = ({ editorRef, initialValue, setContents }: Props) => {
  const [preview, setPreview] = useState<any>(
    window.innerWidth > 1000 ? "vertical" : "tab"
  );

  useEffect(() => {
    if (initialValue) {
      const editorInstance = editorRef.current?.getInstance();
      editorInstance?.setHTML(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResize = () => {
    setPreview(window.innerWidth > 1000 ? "vertical" : "tab");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeHandler = (e: any) => {
    const editorIns = editorRef.current?.getInstance();
    const content = editorIns?.getHTML();
    setContents(content);
  };

  return (
    <>
      {editorRef && (
        <Editor
          ref={editorRef}
          onChange={(v: any) => onChangeHandler(v)}
          initialValue=""
          initialEditType="markdown"
          //   previewStyle="vertical" // tab || vertical
          previewStyle={preview} // tab, vertical
          hideModeSwitch={true}
          width="100%"
          height="calc(100vh - 180px)"
          theme={"dark"} // '' & 'dark'
          usageStatistics={false}
          toolbarItems={toolbarItems}
          useCommandShortcut={true}
          plugins={[colorSyntax]}
          //   hooks={{ addImageBlobHook: onUploadImage }} // firebase 이미지 업로드
        />
      )}
    </>
  );
};
export default MyEditor;
