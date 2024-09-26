import { supabase } from "@/utils/supabase";

export const getPostListApi = async () => {
  let { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("id");
  if (error) {
    console.log(error);
  } else return posts;
};
export const getPostCategoryWithCount = async () => {
  const { data, error } = await supabase.rpc("get_post_category_with_count");
  if (error) {
    console.log(error);
    return [];
  } else {
    return data;
  }
};
export const getPostDetailApi = async (id: any) => {
  let { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", Number(id))
    .limit(1)
    .single();
  if (error) {
    console.log(error);
  } else return post;
};
export const deletePostApi = async (id: any) => {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .match({
      id: Number(id),
    });
  if (error) {
    console.log(error);
    return false;
  }
  return true;
};
