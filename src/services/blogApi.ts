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
