"use client";

import { useState, useEffect } from "react";
import style from "./blog.module.scss";
import Link from "next/link";
import PostListItem from "@/components/blog/PostListItem";
import { useAuth } from "@/hooks/auth";
import { IPostsProps } from "@/types";
import useFetchPosts from "@/hooks/blog/useFetchPosts";
import CNJ from "@/utils/classNameJoiner";
import Image from "next/image";
import DomiLogoW from "../../../public/images/domi_logo_w.svg";
import CustomInput from "@/components/inputs/CustomInput";
import CustomButton from "@/components/inputs/CustomButton";
import { useRouter } from "next/navigation";
import cx from "clsx";

const PostList = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "All"
  );
  const [searchText, setSearchText] = useState<string>("");
  const { posts, postCount, categoryList, allFetch } = useFetchPosts(
    selectedCategory,
    searchText
  );
  const { isDomi } = useAuth();

  const clickSearch = () => {
    allFetch();
  };
  return (
    <div className={style["post-page"]}>
      <div className={style["post-inner"]}>
        <div className={style["left-console"]}>
          <div className={style["console-item"]}>
            <div className={CNJ([style["left-logo-wrap"], "beauty-box"])}>
              <Image
                src={DomiLogoW.src}
                alt="DomiLogoW"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className={style["console-item"]}>
            <p className="box-title">Search</p>

            <div className={CNJ([style["post-search-wrap"], "beauty-box"])}>
              <CustomInput
                type="text"
                placeholder="검색"
                isSearch
                isTransparent
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onkeypress={(e) => {
                  if (e.key === "Enter") {
                    clickSearch();
                  }
                }}
                onIconClickEvent={clickSearch}
              />
            </div>
          </div>
          <div className={style["console-item"]}>
            <p className="box-title">Category</p>
            <div className={cx(style["category-list-wrap"], "beauty-box")}>
              {categoryList &&
                categoryList.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={cx(style["category-list-item"], {
                      [style.active]: selectedCategory === item.category,
                    })}
                    onClick={() => setSelectedCategory(item.category)}
                  >
                    {item.category} (<span>{item.count}</span>)
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={style["right-list"]}>
          <div className={CNJ([style["list-header"], "beauty-box"])}>
            <p>
              {selectedCategory}({postCount})
            </p>
            {isDomi && (
              <CustomButton
                onClick={(e) => {
                  router.push("/blog/edit");
                }}
              >
                Create
              </CustomButton>
            )}
          </div>
          <div className={CNJ([style["list-wrapper"], "beauty-box"])}>
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
