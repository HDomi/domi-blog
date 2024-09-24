"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMessage } from "@/hooks/message";
import { supabase } from "@/utils/supabase";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
import { Editor } from "@toast-ui/react-editor";
import MyEditor from "@/components/blog/PostEditor";
import style from "../blog.module.scss";

type FormFieldProps = {
  title: string;
  content: string;
};
export interface PostsProps {
  id: number;
  user_id: string;
  user_email: string;
  title: string;
  content: string;
  inserted_at: any;
  liked_count: number;
  thumbnail?: string;
}

const CreatePost = () => {
  const { messages, handleMessage } = useMessage();
  const userInfo = useRecoilValue(userInfoRecoil);
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("");
  const handleSumbit = async () => {
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: userInfo.id,
        user_email: userInfo.email,
        title,
        content,
      },
    ]);

    if (error) {
      console.log(error);
      handleMessage({
        message: "Error : Create A Post",
        type: "error",
      });
    } else {
      console.log(data);
    }
  };
  const editorRef = useRef<Editor>(null);
  const editorIns = editorRef.current?.getInstance();
  return (
    <div className={style["post-page"]}>
      <div className={style["post-inner"]}>
        <div className={style["post-detail-header"]}>
          <div className={style["input-wrap"]}>
            <input
              className={style["custom-input"]}
              type="text"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
          </div>
          <p className={style["post-date"]}>
            <button onClick={handleSumbit}>전송</button>
          </p>
        </div>
        <div className={style["post-edit-content"]}>
          <MyEditor
            editorRef={editorRef}
            images={null}
            initialValue={content}
            setContents={setcontent}
          />
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
