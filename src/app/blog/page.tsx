"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import style from "./blog.module.scss";
import Link from "next/link";
import PostListItem from "@/components/blog/PostListItem";
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
const PostList = ({ user }: { user: User }) => {
  const [posts, setPosts] = useState<PostsProps[]>();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("id");
    if (error) {
      console.log(error);
    } else setPosts(posts);
  };
  return (
    <div className={style["post-page"]}>
      <div className={style["post-list-wrap"]}>
        {posts &&
          posts.map((post: PostsProps, index: number) => (
            <PostListItem key={post.id} post={post} />
          ))}
      </div>
    </div>
  );
};

export default PostList;
