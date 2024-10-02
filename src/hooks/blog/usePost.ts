import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/hooks/auth";
import { userInfo as userInfoRecoil } from "@/store/userInfo";
import { useRecoilValue } from "recoil";
import { IPostsProps, ICategoryList } from "@/types";
import dayjs from "dayjs";

const usePost = (id: number) => {
  const [date, setDate] = useState<string>();
  const [postDetail, setPostDetail] = useState<IPostsProps>();
  const { setUserLoading } = useAuth();

  const getPostDetail = async () => {
    let { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();
    if (post) {
      setPostDetail(post);
      setDate(dayjs(post.inserted_at).format("YYYY-MM-DD HH:mm"));
    }
  };

  const deletePost = async () => {
    const { data, error } = await supabase.from("posts").delete().match({
      id,
    });
    if (error) {
      console.log(error);
      return false;
    }
    return true;
  };

  const allFetch = async () => {
    await getPostDetail();
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
  }, [id]);

  return { postDetail, date, deletePost };
};

export default usePost;
