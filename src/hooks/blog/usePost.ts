import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { IPostsProps, IPostDetailProps } from "@/types";
import dayjs from "dayjs";
import { useLayout } from "@/hooks/layout";
import postCodeHighlighter from "@/utils/postCodeHighlighter";
import { getPostDetailApi } from "@/api/post";

const usePost = (id: any) => {
  const [date, setDate] = useState<string>();
  const [postDetail, setPostDetail] = useState<IPostsProps>();
  const { setUserLoading } = useLayout();

  const getPostDetail = async () => {
    try {
      if (!id) return;
      setUserLoading(true);
      const res = await getPostDetailApi(id);
      if (res?.data?.result) {
        const newPost = {
          ...res.data.result,
          content: postCodeHighlighter(res.data.result.content, "javascript"),
        };
        setPostDetail(newPost);
        setDate(
          dayjs(res.data.result.inserted_at)
            .subtract(9, "hour")
            .format("YYYY-MM-DD HH:mm")
        );
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  };

  const createPost = async (paramsData: IPostDetailProps) => {
    try {
      setUserLoading(true);
      const { data, error } = await supabase.from("posts").insert([
        {
          ...paramsData,
        },
      ]);
      return true;
    } catch (error: any) {
      return false;
    } finally {
      setUserLoading(false);
    }
  };

  const updatePostDetail = async (paramsData: IPostDetailProps) => {
    try {
      setUserLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .update([
          {
            title: paramsData.title,
            content: paramsData.content,
            category: paramsData.category,
          },
        ])
        .match({
          id,
        });

      return true;
    } catch (error: any) {
      return false;
    } finally {
      setUserLoading(false);
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

  return {
    getPostDetail,
    postDetail,
    date,
    deletePost,
    createPost,
    updatePostDetail,
  };
};

export default usePost;
