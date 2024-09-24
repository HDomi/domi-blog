"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PostsProps } from "../../page";
import { getPostDetailApi } from "@/services/blogApi";
import { useAuth } from "@/hooks/auth";
import style from "../../blog.module.scss";
import { MyViewer } from "@/components/blog/PostViewer";
// import dynamic from "next/dynamic";

// const NoSsrViewer = dynamic(() => import("@/components/blog/PostViewer"), {
//   ssr: false,
// });
const PostDetailPage = () => {
  const { setUserLoading } = useAuth();
  const [date, setDate] = useState<string>();
  const [post, setPost] = useState<PostsProps>();
  const { id } = useParams();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      setUserLoading(true);
      const res: any = await getPostDetailApi(id);
      setPost(res);
      let postDate = new Date(res.inserted_at);
      setDate(postDate.toLocaleDateString("kr"));
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
    try {
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <div className={style["post-page"]}>
      <div className={style["post-inner"]}>
        {post && (
          <>
            <div className={style["post-detail-header"]}>
              <p className={style["post-title"]}>{post?.title}</p>
              <p className={style["post-date"]}>{date}</p>
            </div>
            <div className={style["post-detail-content"]}>
              <MyViewer initialValue={post.content} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default PostDetailPage;
