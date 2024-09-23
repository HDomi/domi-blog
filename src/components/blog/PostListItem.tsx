"use client";

import style from "@/app/blog/blog.module.scss";
import Link from "next/link";

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

const ListPosts = ({ post }: { post: PostsProps }) => {
  return (
    <Link className={style["post-item"]} href={`/blog/detail/${post.id}`}>
      <div
        className={`${style.thumnail} ${
          post.thumbnail ? "" : style["null-img"]
        }`}
      >
        {post.thumnail ? (
          <img src={post.thumbnail} alt={post.title} />
        ) : (
          <p>NULL</p>
        )}
      </div>
      <div className={style["info-wrap"]}>
        <div className={style["info-text"]}>
          <h1 className={style["tltle-text"]}>{post.title}</h1>
          <p className={style.content}>{post.content}</p>
          {/* <span className={style.date}>{post.inserted_at}</span> */}
        </div>
      </div>
      <div className={style["post-card-footer"]}>
        <p className={style.email}>{post.user_email}</p>
        <p>{post.liked_count}</p>
      </div>
    </Link>
  );
};

export default ListPosts;
