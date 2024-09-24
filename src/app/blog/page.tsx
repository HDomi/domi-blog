"use client";

import { useState, useEffect } from "react";
import style from "./blog.module.scss";
import Link from "next/link";
import PostListItem from "@/components/blog/PostListItem";
import { getPostListApi } from "@/services/blogApi";
import { useAuth } from "@/hooks/auth";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";

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
const PostList = () => {
  const [posts, setPosts] = useState<PostsProps[]>();
  const [postCount, setPostCount] = useState<number>(0);
  const { setUserLoading } = useAuth();
  const userInfo = useRecoilValue(userInfoRecoil);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setUserLoading(true);
      const res: any = await getPostListApi();
      setPostCount(res.length);
      setPosts(res);
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };
  return (
    <div className={style["post-page"]}>
      <div className={style["post-inner"]}>
        <div className={style["post-list-header"]}>
          <p>
            게시글 수 <span>:{postCount}</span>
          </p>
          {userInfo.id && <Link href="/blog/create">Create</Link>}
        </div>
        <div className={style["post-list-wrap"]}>
          {posts &&
            posts.map((post: PostsProps) => (
              <PostListItem key={post.id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
