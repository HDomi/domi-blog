"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostsProps } from "../../page";
import { getPostDetailApi } from "@/services/blogApi";
import { useAuth } from "@/hooks/auth";
import style from "../../blog.module.scss";

const PostDetailPage = () => {
  const { setUserLoading } = useAuth();
  const [date, setDate] = useState<string>();
  const [post, setPost] = useState<PostsProps>();
  const { id } = useParams();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setUserLoading(true);
      const res: any = await getPostDetailApi(id);
      setPost(res);
      let postDate = new Date(res.inserted_at);
      setDate(postDate.toLocaleDateString("kr"));
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
    try {
    } catch (error) {
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
            <div className={style["post-detail-content"]}>{post?.content}</div>
          </>
        )}
      </div>
    </div>
  );
};
export default PostDetailPage;
