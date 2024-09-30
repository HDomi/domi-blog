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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { setUserLoading, isDomi } = useAuth();
  const userInfo = useRecoilValue(userInfoRecoil);

  useEffect(() => {
    allFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allFetch = async () => {
    await fetchPosts();
    await fetchPostsCategory();
  };

  const fetchPosts = async (category?: string) => {
    try {
      setUserLoading(true);
      const res: any = await getPostListApi(category);
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
      setCategoryList([
        {
          category: "All",
          count: res.reduce((acc: number, item: any) => acc + item.count, 0),
        },
        ...res,
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };
  const selectCategoryHandler = async (category: string) => {
    if (category === "All") {
      setSelectedCategory("All");
      fetchPosts();
      return;
    }
    setSelectedCategory(category.toUpperCase());
    fetchPosts(category);
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
                categoryList.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={style["category-list-item"]}
                    onClick={() => selectCategoryHandler(item.category)}
                  >
                    <p>
                      {item.category.toUpperCase()} (<span>{item.count}</span>)
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
