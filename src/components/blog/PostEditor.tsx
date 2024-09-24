"use client";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/toastui-editor.css";
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
  //   images?: MutableRefObject<Images[]>; // 글수정 시 필요

  images?: any;
  initialValue?: string; // 글수정 시 필요
  setContents: (content: string) => void;
}
interface Images {
  fileName: string;
  url: string;
}

export const MyEditor = ({
  editorRef,
  images,
  initialValue,
  setContents,
}: Props) => {
  // const onUploadImage = async (blob:Blob, callback: (url: string, altText?: string) => void) => {
  //     const fileName = `${Date.now().toString()}_${blob.name}`;
  //     const storageRef = ref(storage, `images/${fileName}`);
  //     const imageFile = new File([blob], fileName, { type: 'image/jpeg' });

  //     const options = {
  //       maxSizeMB: 1,
  //       maxWidthOrHeight: 1920,
  //       useWebWorker: true,
  //     }

  //     try {
  //       const compressdFile = await imageCompression(imageFile, options)
  //       const snapshot = await uploadBytes(storageRef, compressdFile);
  //       const url = await getDownloadURL(snapshot.ref);
  //       images.current = Array.isArray(images.current) ? [...images.current, {fileName: fileName, url: url.replaceAll(/&/g, '&amp;')}] : [{fileName: fileName, url: url.replaceAll(/&/g, '&amp;')}]

  //       callback(url, 'image')

  //     } catch (error) {
  //       console.log('error', error)
  //       alert('이미지 업로드 실패')
  //     }
  //   }
  const [preview, setPreview] = useState<any>(
    window.innerWidth > 1000 ? "vertical" : "tab"
  );

  useEffect(() => {
    if (initialValue) {
      const editorInstance = editorRef.current?.getInstance();
      editorInstance?.setHTML(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

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
