import { atom } from "recoil";
import { IUserInfo } from "@/types";

export const userInfo = atom<IUserInfo>({
  key: "service",
  default: {
    id: null,
    email: null,
    created_at: null,
    last_sign: null,
  },
});
