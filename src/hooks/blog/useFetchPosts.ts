import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { IPostsProps, ICategoryList } from "@/types";
import { useLayout } from "@/hooks/layout";
import { getPostsApi, getPostCategoryWithCountApi } from "@/api/post";

const useFetchPosts = (category?: string, searchText?: string) => {
  const [posts, setPosts] = useState<Array<IPostsProps>>([]);
  const [postCount, setPostCount] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<Array<ICategoryList>>([]);
  const { setUserLoading, handleMessage } = useLayout();

  const getPostListApi = async () => {
    try {
      const res = await getPostsApi(category, searchText);
      if (res?.data?.result) {
        setPosts(res.data.result);
        setPostCount(res.data.result.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPostCategoryWithCount = async () => {
    try {
      const res = await getPostCategoryWithCountApi();
      if (res?.data?.result) {
        setCategoryList([
          {
            category: "All",
            count: res.data.result.reduce(
              (acc: number, item: any) => acc + item.count,
              0
            ),
          },
          ...res.data.result,
        ]);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const allFetch = async () => {
    try {
      setUserLoading(true);
      await getPostListApi();
      await getPostCategoryWithCount();
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };
  useEffect(() => {
    allFetch();
  }, [category]);

  return { posts, postCount, categoryList, allFetch };
};

export default useFetchPosts;
