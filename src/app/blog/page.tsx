"use client";

import { useState, useEffect } from "react";
import style from "./blog.module.scss";
import Link from "next/link";
import PostListItem from "@/components/blog/PostListItem";
import { getPostListApi, getPostCategoryWithCount } from "@/services/blogApi";
import { useAuth } from "@/hooks/auth";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
import { IPostsProps } from "@/types";

const PostList = () => {
  const [posts, setPosts] = useState<IPostsProps[]>();
  const [postCount, setPostCount] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const { setUserLoading } = useAuth();
  const userInfo = useRecoilValue(userInfoRecoil);

  useEffect(() => {
    allFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allFetch = async () => {
    await fetchPosts();
    await fetchPostsCategory();
  };

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
  const fetchPostsCategory = async () => {
    try {
      setUserLoading(true);
      const res: any = await getPostCategoryWithCount();
      setCategoryList([{ category: "All", count: postCount }, ...res]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };
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
                categoryList.map((category: any, idx: number) => (
                  <div key={idx} className={style["category-list-item"]}>
                    <p>
                      {category.category.toUpperCase()} (
                      <span>{category.count}</span>)
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={style["right-list"]}>
          <div className={`${style["list-header"]} beauty-box`}>
            <p>All({postCount})</p>
          </div>
          <div className={`${style["list-wrapper"]} beauty-box`}>
            {posts &&
              posts.map((post: IPostsProps) => (
                <PostListItem
                  key={post.id}
                  post={post}
                  refreshList={fetchPosts}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
