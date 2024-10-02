import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/hooks/auth";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
import { IPostsProps, ICategoryList } from "@/types";

const useFetchPosts = (category?: string | null) => {
  const [posts, setPosts] = useState<Array<IPostsProps>>([]);
  const [postCount, setPostCount] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<Array<ICategoryList>>([]);
  const { setUserLoading } = useAuth();

  const getPostListApi = async () => {
    let query = supabase.from("posts").select("*").order("id");
    const categoryParam = category === "All" ? null : category;
    if (categoryParam) {
      query = query.eq("category", categoryParam);
    }
    let { data: apiPosts, error } = await query;
    if (apiPosts) {
      setPostCount(apiPosts.length);
      setPosts(apiPosts);
    }
  };

  const getPostCategoryWithCount = async () => {
    try {
      const { data, error } = await supabase.rpc(
        "get_post_category_with_count"
      );
      if (data) {
        setCategoryList([
          {
            category: "All",
            count: data.reduce((acc: number, item: any) => acc + item.count, 0),
          },
          ...data,
        ]);
      }
      if (error) {
        console.log(error);
        return [];
      } else {
        return data;
      }
    } catch (error: any) {
    } finally {
    }
  };

  const allFetch = async () => {
    await getPostListApi();
    await getPostCategoryWithCount();
  };
  useEffect(() => {
    try {
      setUserLoading(true);
      allFetch();
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  }, [category]);

  return { posts, postCount, categoryList, allFetch };
};

export default useFetchPosts;
