"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useLayout } from "@/hooks/layout";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
import style from "../blog.module.scss";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import CustomInput from "@/components/inputs/CustomInput";
import useFetchPosts from "@/hooks/blog/useFetchPosts";
import { ISelectBoxItem } from "@/types";
import CustomAutoComplete from "@/components/inputs/CustomAutoComplete";
import usePost from "@/hooks/blog/usePost";

const NoSsrEditor = dynamic(() => import("@/components/blog/PostEditor"), {
  ssr: false,
});

const Edit = () => {
  const { categoryList } = useFetchPosts();
  const { messages, handleMessage } = useLayout();
  const router = useRouter();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);

  const { getPostDetail, postDetail, updatePostDetail, createPost } = usePost(
    Number(id)
  );
  const userInfo = useRecoilValue(userInfoRecoil);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("잘 입력해보세요.");
  const [category, setCategory] = useState<any>("");
  const [pageCategoryList, setPageCategoryList] = useState<
    Array<ISelectBoxItem>
  >([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idParam = searchParams.get("id");
    setId(idParam);
  }, []);

  useEffect(() => {
    if (categoryList.length > 0) {
      const categories = categoryList
        .map((item: any) => {
          return { value: item.category, label: item.category.toUpperCase() };
        })
        .filter((item: any) => item.value !== "All");
      if (!id) {
        setCategory(categories[0].value);
      }
      setPageCategoryList(categories);
    }
    getPostDetail();
  }, [categoryList, id]);

  useEffect(() => {
    if (id && postDetail) {
      setTitle(postDetail.title);
      setContent(postDetail.content);
      setCategory(postDetail.category);
      setRefresh(!refresh);
    }
  }, [id, postDetail]);

  const handleSumbit = async () => {
    if (id) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleCreate = async () => {
    if (!userInfo.id || !userInfo.email) return;
    const state = await createPost({
      user_id: userInfo.id,
      user_email: userInfo.email,
      title,
      content,
      category,
    });
    if (state) {
      router.push("/blog");
    }
  };

  const handleUpdate = async () => {
    const state = await updatePostDetail({ title, content, category });
    if (state) {
      router.push("/blog");
    }
  };
  const editorRef = useRef<any>(null);

  return (
      <div className={style["post-page"]}>
        <div className={style["post-detail-edit-inner"]} key={String(refresh)}>
          <div className={style["post-detail-header"]}>
            <div className={style["input-wrap"]}>
              <CustomInput
                value={title}
                placeholder="제목을 입력해주세요."
                onChange={(e: any) => setTitle(e)}
              />
              <CustomAutoComplete
                options={pageCategoryList}
                selectedValue={category}
                onChange={(_, val) => setCategory(val)}
              />
            </div>
            <p className={style["post-date"]}>
              <button onClick={handleSumbit}>{id ? "수정" : "전송"}</button>
            </p>
          </div>
          <div className={style["post-edit-content"]}>
            <NoSsrEditor
              editorRef={editorRef}
              initialValue={content}
              setContents={setContent}
            />
          </div>
        </div>
      </div>
  );
};

export default Edit;
