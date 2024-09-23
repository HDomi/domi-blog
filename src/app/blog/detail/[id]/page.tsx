"use client";

import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { useMessage } from "@/hooks/message";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import classNames from "classnames";
import { PostsProps } from "../../page";

export type NextAppPageUserProps = {
  props: {
    user: User;
    loggedIn: boolean;
  };
};

export type NextAppPageRedirProps = {
  redirect: {
    destination: string;
    permanent: boolean;
  };
};

export type NextAppPageServerSideProps =
  | NextAppPageUserProps
  | NextAppPageRedirProps;

export const getServerSidePropsMethod: GetServerSideProps = async ({
  req,
  params,
}): Promise<NextAppPageServerSideProps> => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      loggedIn: !!user,
    },
  };
};
const PostDetailPage = ({ user }: { user: User }) => {
  // const { messages, handleMessage } = useMessage();
  const [date, setDate] = useState<string>();
  const [post, setPost] = useState<PostsProps>();
  const { id } = useParams();
  console.debug(id);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", Number(id))
      .limit(1)
      .single();
    if (error) {
      console.log(error);
      // handleMessage({ message: "Error : No post", type: "error" });
    } else {
      setPost(post);
      let postDate = new Date(post.inserted_at);
      setDate(postDate.toLocaleDateString("kr"));
    }
  };
  return (
    <div className="flex flex-col items-center justify-start py-4 min-h-screen">
      <h2 className="text-2xl my-4">Hello, Supabase User!</h2>

      <h3 className="py-3 font-semibold text-lg text-blue-600">
        Post Detail List
      </h3>
      {post && (
        <section className="text-center lg:text-left">
          <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8 lg:items-end lg:justify-between lg:flex">
            <div className="max-w-xl mx-auto lg:ml-0">
              <h1 className="text-sm font-medium tracking-widest text-indigo-600 uppercase">
                {date}
              </h1>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                {post?.title}
              </h2>
            </div>

            <p className="max-w-xs mx-auto mt-4 text-gray-700 lg:mt-0 lg:mr-0">
              {post?.content}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
export default PostDetailPage;
