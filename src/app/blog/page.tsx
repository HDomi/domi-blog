"use client";

import { useState, useEffect } from "react";
import style from "./blog.module.scss";
import Link from "next/link";
import PostListItem from "@/components/blog/PostListItem";
import { useAuth } from "@/hooks/auth";
import { IPostsProps } from "@/types";
import useFetchPosts from "@/hooks/blog/useFetchPosts";

const PostList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "All"
  );
  const { posts, postCount, categoryList, allFetch } =
    useFetchPosts(selectedCategory);
  const { isDomi } = useAuth();

  return (
    <div className={style["post-page"]}>
      <div className={style["post-inner"]}>
        <div className={style["left-console"]}>
          <div className={style["console-item"]}>
            <div className={`${style["left-logo-wrap"]} beauty-box`}>
              무언가 들어가야함
            </div>
          </div>
          <div className={style["console-item"]}>
            <p className="box-title">Search</p>

            <div className={`${style["post-search-wrap"]} beauty-box`}>
              검색이 들어가야함
            </div>
          </div>
          <div className={style["console-item"]}>
            <p className="box-title">Category</p>
            <div className={`${style["category-list-wrap"]} beauty-box`}>
              {categoryList &&
                categoryList.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={style["category-list-item"]}
                    onClick={() => setSelectedCategory(item.category)}
                  >
                    <p>
                      {item.category} (<span>{item.count}</span>)
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={style["right-list"]}>
          <div className={`${style["list-header"]} beauty-box`}>
            <p>
              {selectedCategory}({postCount})
            </p>
            {isDomi && <Link href="/blog/edit">CREATE</Link>}
          </div>
          <div className={`${style["list-wrapper"]} beauty-box`}>
            {posts &&
              posts.map((post: IPostsProps) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  refreshList={allFetch}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
