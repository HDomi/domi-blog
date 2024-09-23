import { atom } from "recoil";
interface IUserInfo {
  email: string | null;
  created_at: string | null;
  last_sign: string | null;
  id: string | null;
}

export const userInfo = atom<IUserInfo>({
  key: "service",
  default: {
    id: null,
    email: null,
    created_at: null,
    last_sign: null,
  },
});
