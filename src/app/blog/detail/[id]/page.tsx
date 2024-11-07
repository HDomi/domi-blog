"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import style from "../../blog.module.scss";
import dynamic from "next/dynamic";
import usePost from "@/hooks/blog/usePost";
import "highlight.js/styles/atom-one-dark.css";
import { useAuth } from "@/hooks/auth";
import CustomButton from "@/components/inputs/CustomButton";
import { useRouter } from "next/navigation";
import { useLayout } from "@/hooks/layout";
import cx from "clsx";

const NoSsrViewer = dynamic(() => import("@/components/blog/PostViewer"), {
  ssr: false,
});
const PostDetailPage = () => {
  const { isDomi } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const { getPostDetail, postDetail, date } = usePost(Number(id));
  const { deletePost } = usePost(id);
  const { setUserLoading } = useLayout();

  const deletePostHandler = async () => {
    try {
      setUserLoading(true);
      const state = await deletePost();
      if (state) {
        router.push("/blog");
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };
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
            {isDomi && (
              <div className={cx(style["post-detail-header"], style["sub"])}>
                <CustomButton
                  onClick={(e) => {
                    router.push(`/blog/edit?id=${postDetail.id}`);
                  }}
                >
                  Edit
                </CustomButton>
                <CustomButton onClick={(e) => deletePostHandler()}>
                  Delete
                </CustomButton>
              </div>
            )}
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
