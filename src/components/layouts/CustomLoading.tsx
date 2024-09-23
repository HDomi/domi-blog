"use client";

import { CircularProgress } from "@mui/material";
import style from "./layout.module.scss";

export interface PostsProps {
  id: number;
  user_id: string;
  user_email: string;
  title: string;
  content: string;
  inserted_at: any;
  liked_count: number;
  thumbnail?: string;
}

const CustomLoading = () => {
  return (
    <div className={style["loading-wrap"]}>
      <CircularProgress color="secondary" size={60} />
    </div>
  );
};

export default CustomLoading;
