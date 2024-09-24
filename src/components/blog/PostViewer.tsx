"use client";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/toastui-editor.css";
// import { Viewer } from "@toast-ui/react-editor";
interface Props {
  initialValue: string;
}
export const MyViewer = ({ initialValue }: Props) => {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: initialValue }}></div>
    </>
  );
};
export default MyViewer;
