export interface IPostsProps {
  id: number;
  user_id: string;
  user_email: string;
  title: string;
  content: string;
  inserted_at: any;
  liked_count: number;
  category: string;
}
export interface ICategoryList {
  category: string;
  count: number;
}
export interface IUserInfo {
  email: string | null;
  created_at: string | null;
  last_sign: string | null;
  id: string | null;
}

export interface ISelectBoxItem {
  value: string;
  label: string;
}
