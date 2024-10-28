"use client";

import { use, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import style from "../../blog.module.scss";
import dynamic from "next/dynamic";
import usePost from "@/hooks/blog/usePost";
import "highlight.js/styles/atom-one-dark.css";

const NoSsrViewer = dynamic(() => import("@/components/blog/PostViewer"), {
  ssr: false,
});
const PostDetailPage = () => {
  const { id } = useParams();
  const { getPostDetail, postDetail, date } = usePost(Number(id));

  useEffect(() => {
    if (id) {
      getPostDetail();
    }
  }, [id]);

  return (
    <div className={style["post-page"]}>
      <div className={style["post-detail-edit-inner"]}>
        {postDetail && (
          <>
            <div className={style["post-detail-header"]}>
              <p className={style["post-title"]}>{postDetail?.title}</p>
              <p className={style["post-date"]}>{date}</p>
            </div>
            <div className={style["post-detail-content"]}>
              <NoSsrViewer initialValue={postDetail?.content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default PostDetailPage;
