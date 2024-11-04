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
export interface IPostDetailProps {
  user_id?: string;
  user_email?: string;
  title: string;
  content: string;
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
//레이아웃
export type MessageType = "info" | "success" | "error";

export interface IMessageProps {
  message: string;
  messageType: MessageType;
}

export interface ILayoutContextProps {
  userLoading: boolean;
  messages: IMessageProps[];
  setUserLoading: (v: boolean) => void;
  handleMessage: (message: IMessageProps) => void;
}

export interface IProviderProps {
  children: React.ReactNode;
}
//auth

export interface ISupabaseAuthPayload {
  email: string;
  password: string;
}

export interface IAuthContextProps {
  user: any;
  signUp: (payload: ISupabaseAuthPayload) => void;
  signIn: (payload: ISupabaseAuthPayload) => void;
  signOut: () => void;
  loggedIn: boolean;
  isDomi: boolean;
}

export interface ISkillItem {
  title: string;
  progress: number;
}

export interface IFormFieldProps {
  email: string;
  password: string;
}
export type SupabaseAuthPayload = IFormFieldProps;
