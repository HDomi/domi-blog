"use client";

import React, { useRef, useState } from "react";
import { useMessage } from "@/hooks/message";
import { supabase } from "@/utils/supabase";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
// import MyEditor from "@/components/blog/PostEditor";
import style from "../blog.module.scss";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/inputs/CustomInput";
import CustomSelect from "@/components/inputs/CustomSelect";

const NoSsrEditor = dynamic(() => import("@/components/blog/PostEditor"), {
  ssr: false,
});

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

const Edit = () => {
  const { messages, handleMessage } = useMessage();
  const router = useRouter();
  const userInfo = useRecoilValue(userInfoRecoil);
  const [title, settitle] = useState("");
  const [content, setcontent] = useState("잘 입력해보세요.");
  const [category, setcategory] = useState("dev");
  const categoryList = [
    { value: "dev", label: "DEV" },
    { value: "css", label: "CSS" },
    { value: "free", label: "FREE" },
    { value: "test", label: "TEST" },
  ];
  const handleSumbit = async () => {
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: userInfo.id,
        user_email: userInfo.email,
        title,
        content,
        category,
      },
    ]);
    router.push("/blog");
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
  const editorRef = useRef<any>(null);

  return (
    <div className={style["post-page"]}>
      <div className={style["post-detail-edit-inner"]}>
        <div className={style["post-detail-header"]}>
          <div className={style["input-wrap"]}>
            <CustomInput
              value={title}
              placeholder="제목을 입력해주세요."
              onChange={(e: any) => settitle(e)}
            />
            <CustomSelect
              options={categoryList}
              selectedValue={category}
              onChange={(e: any) => setcategory(e)}
            />
          </div>
          <p className={style["post-date"]}>
            <button onClick={handleSumbit}>전송</button>
          </p>
        </div>
        <div className={style["post-edit-content"]}>
          <NoSsrEditor
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
export default Edit;
